/**
 * Basic JavaScript Console built on html.
 * 
 * exports: htmlConsole
 * 
 * @author  Philipp Miller
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 * 
 */
(function(win, doc, origConsole, undefined) {
  
  "use strict";
  
  var template = '<pre id="console-log"></pre>'
      + '<form id="console-form"><input id="console-input" type="text" autocomplete="off"/>'
      + '<button>»</button></form>';
    
  var defaultDepth = 1;
    
  var getById     = doc.getElementById.bind(doc);
  var createElem  = doc.createElement.bind(doc);
  
  var rollback    = [];
  var rollbackId  = 0;
  
  var consoleElem;
  var styleElem;
  var inputElem;
  var logElem;
  
  var console
      = win.console
      = win.htmlConsole
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
              return console;
            },
          },
          
          /**
           * Log a warning line
           */
          warn: {
            value: function() {
              appendLogLine(formatAll(arguments), "warning");
              origConsole.warn.apply(origConsole, arguments);
              return console;
            },
          },
          
          /**
           * Log an error line
           */
          error: {
            value: function() {
              appendLogLine(formatAll(arguments), "error");
              origConsole.error.apply(origConsole, arguments);
              return console;
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
              return console;
            },
          },
          
          track: {
            value: function(name, fn) {
              if (!fn) {
                fn = name;
                name = fn.name || "[anonymous function]";
              }
              return function() {
                console.log("called '" + name + "(" + formatAll(arguments) + ")'");
                
                try {
                  fn.apply(this, arguments);
                } catch (e) {
                  console.error(e);
                }
              };
            },
          },
        });
  
  /// INIT
  
  function init() {
    styleElem = getById("console-style");
    if (!styleElem) {
      styleElem = createElem("link");
      styleElem.rel = "stylesheet";
      styleElem.href = "console/console.css";
      styleElem.id = "console-style";
      doc.head.appendChild(styleElem);
    }
    
    consoleElem = getById("console");
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
    
    console.log("Initialized htmlConsole on '" + navigator.userAgent + "'");
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
    var div = createElem("div");
    div.className = "console-line" + (loglevel ? " console-" + loglevel + "-line" : "");
    div.appendChild(doc.createTextNode(msg));
    logElem.appendChild(div);
    
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
  
})(window, window.document, window.console);
