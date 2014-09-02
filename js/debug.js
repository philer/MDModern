/**
 * Debug object provides custom logging interface
 * Defaults to console.log but can be changed (major use case)
 * 
 * @author  Philipp Miller
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 * 
 */
(function(startTime) {
  
  "use strict";
  
  var debug = {},
      log   = [],
      logFunctions = [window.console.log.bind(console)],
      logElem;
  
  window.debug = debug;
  
  /// Functions
  
  /**
   * Adds an entry to the log
   * or returns an array containing all previous log entries
   * if called without argument.
   * 
   * @param  {mixed} msg  formatted using debug.formatString
   * @return {debug}      chainabl
   */
  debug.log = function(msg) {
    if (arguments.length > 1) {
      msg = Array.prototype.join.call(arguments, ", ");
    }
    
    var t  = new Date,
        dt = new Date(t - startTime);
    
    log.push({ message: msg, at: t, sinceStart: dt });
    
    logFunctions.forEach(function(fn) {
      fn(msg, t, dt);
    });
    return debug;
  };
  
  /**
   * Add a log Function that will be called every time
   * debug.log(msg) is called.
   * By default there is only console.log as a log function.
   * 
   * The callback will be called with three parameters:
   *   fn(string msg, Date loggedAt, Date timeSinceStart)
   * 
   * @param {Function} fn
   * @param {boolean}  replace  remove all previous log functions?
   * @return {debug}            chainable
   */
  debug.addLogFunction = function(fn, replace) {
    if (replace === null || replace) {
      logFunctions = [fn];
    }
    else {
      logFunctions.push(fn);
    }
    return debug;
  };
  
  /**
   * Set a jQuery DOM element that will be appended whenever
   * debug.log(msg) is called.
   * Also serves as a getter for the
   * currently used log element if called without arguments.
   * 
   * @param  {jQuery}  $elem   jQuery DOM element
   * @param  {boolean} replace disable other logging output?
   * @return {debug}           chainable
   */
  debug.logElem = function($elem, replace) {
    if ($elem) {
      logElem = $elem;
      return debug.addLogFunction(
        function(msg, t, dt) {
          $elem
            .append(
                dt.toISOString().slice(12,23)
              + "  "
              + debug.formatString(msg, 0).replace(/^"|"$/g, "")
              + "\n"
            )
            .scrollTop(logElem.prop("scrollHeight"));
        },
        replace
      );
    }
    else return logElem;
  };
  
  /**
   * Render a user friendly string representation of
   * Arrays and Objects.
   * 
   * @param  {mixed}   x
   * @param  {integer} depth nesting depth to be displayed
   * @return {string}
   */
  debug.formatString = function formatString(x, depth) {
    depth = +depth;
    
    if (Array.isArray(x)) {
      return "["
        + x.map(
            function(elem) {
              return depth ? formatString(elem, depth-1) : elem;
            })
          .join(", ")
        + "]";
    }
    
    switch (typeof x) {
      case "function":
        return "function";
      
      case "undefined":
        return "undefined";
      
      case "object":
        return "{"
        + Object.getOwnPropertyNames(x)
            .map(
              function(prop) {
                return prop + ": " + (depth ? formatString(x[prop], depth-1) : x[prop]);
              }) 
            .join(", ")
        + "}";
      
      default:
        return x;
    }
  };
  
})(Date.now());
