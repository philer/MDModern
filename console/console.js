/**
 * globals: HtmlConsole
 */
(function(doc, undefined) {
  
  "use strict";
  
  var template = '<pre id="console-log"></pre>'
      + '<form id="console-form"><input id="console-input" type="text" autocomplete="off"/>'
      + '<button>»</button></form>';
  
  var cnsl = window.HtmlConsole = {},
      
      getId      = doc.getElementById.bind(doc),
      createElem = doc.createElement.bind(doc),
      
      rollback   = [],
      rollbackId = 0,
      
      consoleElem = getId("console"),
      inputElem,
      logElem;
  
  /// INIT
  function init() {
    if (!consoleElem) {
      consoleElem = doc.body.appendChild(createElem("div"));
      consoleElem.id = "console";
    }
    consoleElem.innerHTML = template;
    inputElem = getId("console-input");
    logElem   = getId("console-log");
    
    getId("console-form").addEventListener("submit", submit);
    inputElem.addEventListener("keydown", keyNav);
    consoleElem.addEventListener("click", inputElem.focus.bind(inputElem));
    // inputElem.focus();
    
    cnsl.log("HtmlConsole on '" + navigator.userAgent + "'");
  }
  
  /// Functions
  
  /**
   * Execute a command
   * @param  {string} cmd
   */
  cnsl.exec = function exec(cmd) {
    logInput(cmd);
    try {
      cnsl.log(eval.call(null, cmd));
    } catch (e) {
      cnsl.error(e);
    }
  };
  
  /**
   * Submit handler for console input form
   * @param  {SubmitEvent} evt
   */
  function submit(evt) {
    evt.preventDefault();
    
    var cmd = inputElem.value;
    inputElem.value = "";
    
    cnsl.exec(cmd);
    
    inputElem.focus();
  }
  
  /**
   * Add a log line containing the command to be executed
   * @param  {string} cmd
   */
  function logInput(cmd) {
    rollback.push(cmd);
    rollbackId = rollback.length;
    cnsl.log("» " + cmd, "input");
  }
  
  /**
   * Log a line
   * @param  {mixed} msg
   */
  cnsl.log = function log(msg, loglevel) {
    var origMsg = msg;
    
    if (loglevel !== "input") {
      msg = cnsl.formatString(msg, 3);
    }
    
    var div = createElem("div");
    div.className = "console-line" + (loglevel ? " console-" + loglevel + "line" : "");
    div.appendChild(doc.createTextNode(msg));
    logElem.appendChild(div);
    scrollLog();
    
    if (origMsg instanceof Error) {
      // console.error(origMsg instanceof Error ? origMsg.message : origMsg);
      throw origMsg;
    } else {
      console.log(origMsg);
    }
  };
  
  /**
   * Log an error line
   * @param  {Error|string} msg
   */
  cnsl.error = function error(msg) {
    cnsl.log(msg, "error");
  };
  
  /**
   * Automatically scroll to the bottom of the log
   */
  function scrollLog() {
    logElem.scrollTop = logElem.scrollHeight - logElem.offsetHeight;
  }
  
  /**
   * Handle up and down key navigation for cycling through console
   * input history
   * @param  {KeypressEvent} evt
   */
  function keyNav(evt) {
    if (evt.keyCode === 38) {
      evt.preventDefault();
      rollUp();
    } else if (evt.keyCode === 40) {
      evt.preventDefault();
      rollDown();
    }
  }
  
  /**
   * Cycle up through the console input history
   */
  function rollUp() {
    if (rollbackId > 0) {
      inputElem.value = rollback[--rollbackId];
    }
  }
  
  /**
   * Cycle down through the console input history
   */
  function rollDown() {
    if (rollbackId < rollback.length - 1) {
      inputElem.value = rollback[++rollbackId];
    } else if (rollbackId === rollback.length - 1) {
      rollbackId++;
      inputElem.value = "";
    }
  }
  
  /**
   * Render a user friendly string representation of
   * Arrays and Objects.
   * 
   * @param  {mixed}   x
   * @param  {integer} depth nesting depth to be displayed
   * @return {string}
   */
  cnsl.formatString = function formatString(x, depth) {
    if (depth === undefined) {
      depth = 1;
    }
    
    switch (x) {
      case undefined:
        return "undefined";
        
      case null:
        return "null";
    }
    
    if (Array.isArray(x)) {
      return "["
        + x.map(
            function(elem) {
              return depth ? formatString(elem, depth-1) : elem;
            })
          .join(", ")
        + "]";
    }
    
    if (x instanceof Error) {
      return x.name + ': "' + x.message + '"'
        // + (x.fileName ? " in " + x.fileName : "")
        + (x.stack ? "\n" + x.stack : "");
    }
    
    switch (typeof x) {
      case "function":
        return "function";
        
      case "object":
        return depth ? "{"
          + Object.getOwnPropertyNames(x)
              .map(
                function(prop) {
                  return prop + ": " + formatString(x[prop], depth-1);
                }) 
              .join(", ")
          + "}" : "{…}";
      case "string":
        return '"' + x + '"';
      
      default:
        return "" + x;
    }
  };
  
  init();
  
})(document);