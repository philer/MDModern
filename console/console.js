/**
 * Basic JavaScript Console built on html.
 * 
 * globals: console
 * 
 * @author  Philipp Miller
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 * 
 */
(function(win, doc, undefined) {
  
  "use strict";
  
  var template = '<pre id="console-log"></pre>'
      + '<form id="console-form"><input id="console-input" type="text" autocomplete="off"/>'
      + '<button>»</button></form>'
    
    , defaultDepth = 3
    
    , getById     = doc.getElementById.bind(doc)
    , createElem  = doc.createElement.bind(doc)
    
    , rollback    = []
    , rollbackId  = 0
    
    , consoleElem = getById("console")
    , inputElem
    , logElem
    ;
  
  
  var origConsole = win.console
    , console
      = win.console
      = win.HtmlConsole
      = Object.create(origConsole, {
        
        /**
         * Render a user friendly string representation of arbitrary data
         * 
         * @param  {mixed}   x
         * @param  {integer} depth nesting depth to be displayed
         * @return {string}
         */
          format: {
            value: format,
          },
          
          /**
           * Log a line
           */
          log: {
            value: function() {
              appendLogLine(formatAll(arguments));
              origConsole.log.apply(origConsole, arguments);
              return this;
            },
          },
          
          /**
           * Log a warning line
           */
          warn: {
            value: function() {
              appendLogLine(formatAll(arguments), "warning");
              origConsole.warn.apply(origConsole, arguments);
              return this;
            },
          },
          
          /**
           * Log an error line
           */
          error: {
            value: function() {
              appendLogLine(formatAll(arguments), "error");
              origConsole.error.apply(origConsole, arguments);
              return this;
            },
          },
          
          /**
           * Execute a command
           * @param  {string} cmd
           */
          exec: {
            value: function(cmd) {
              logInput(cmd);
              try {
                this.log(eval.call(null, cmd));
              } catch (e) {
                this.error(e);
              }
              return this;
            },
          },
          
        });
  
  /// INIT
  
  function init() {
    if (!consoleElem) {
      consoleElem = doc.body.appendChild(createElem("div"));
      consoleElem.id = "console";
    }
    consoleElem.innerHTML = template;
    inputElem = getById("console-input");
    logElem   = getById("console-log");
    
    getById("console-form").addEventListener("submit", submit);
    inputElem.addEventListener("keydown", keyNav);
    consoleElem.addEventListener("click", inputElem.focus.bind(inputElem));
    // inputElem.focus();
    
    console.log("HtmlConsole on '" + navigator.userAgent + "'");
  }
  
  /// Functions
  
  /**
   * Submit handler for console input form
   * @param  {SubmitEvent} evt
   */
  function submit(evt) {
    evt.preventDefault();
    var cmd = inputElem.value;
    console.exec(cmd);
    inputElem.value = "";
    inputElem.focus();
  }
  
  /**
   * Add a log line containing the command to be executed
   * @param  {string} cmd
   */
  function logInput(cmd) {
    rollback.push(cmd);
    rollbackId = rollback.length;
    appendLogLine(cmd, "input");
  }
  
  /**
   * Create a single log line in the log element.
   * @param  {array}  msg       string to be logged
   * @param  {string} loglevel  optional class (e.g. 'error' -> 'console-error-line')
   */
  function appendLogLine(msg, loglevel) {
    logElem.insertAdjacentHTML('beforeend', 
        '<div class="console-line'
      + (loglevel ? " console-" + loglevel + "-line" : "")
      + '">' + msg + '</div>'
    );
    
    // scroll down
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
   * Wrapper for format that allows formatting arrays
   * into a single string
   * @param  {Array} xs     array or array-like object of things to be formatted
   * @param  {int}   depth  see format
   * @return {string}
   */
  function formatAll(xs, depth) {
    var formatted = [];
    for (var i = xs.length ; i-- ; ) {
      formatted[i] = format(xs[i], depth);
    }
    return formatted.join(", ");
  }
  
  /**
   * Render a user friendly string representation of arbitrary data
   * 
   * @param  {mixed}   x
   * @param  {integer} depth nesting depth to be displayed
   * @return {string}
   */
  function format(x, depth) {
    if (depth === undefined) {
      depth = defaultDepth;
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
              return depth ? format(elem, depth - 1) : elem;
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
                  return prop + ": " + format(x[prop], depth - 1);
                }) 
              .join(", ")
          + "}" : "{…}";
      case "string":
        return '"' + x + '"';
      
      default:
        return "" + x;
    }
  }
  
  init();
  
})(window, document);