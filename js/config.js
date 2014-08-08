/**
 * Retrive configuration as array of lines from a file
 * 
 * @author  Philipp Miller
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 * 
 */
(function($) {
  
  "use strict";
  
  var config = {},
      cache  = {};
  
  window.config = config;
  
  /// Functions
  
  /**
   * Fetch a config file via request, maybe parse it, cache it, pass it on.
   * 
   * - filename may be a relative path or a full path,
   *   starting with file:// or http://
   * - parser (optional) may a string naming a predefined parser,
   *   or a callback function. Predefined values are
   *   "plain"       text is kept as is
   *   "lines"       text is split into an array of lines,
   *                 empty lines end comments are removed
   *   "properties"  Default; Typical config file formatting is assumed.
   *                 "key=value" lines are assigned as properties,
   *                 with value being parsed by JSON.parse (if available)
   *                 other lines, following a "[key]" line,
   *                 are assigned as array elements to the "key" property.
   *   "json"        File is parsed by JSON.parse (may not be available!)
   * - callback (optional) is a function that is called with the results.
   * 
   * @param  {string}   filename
   * @param  {mixed}    parser   string or function
   * @param  {Function} callback called with results
   * @return {config}            chaining
   */
  config.require = function(filename, parser, callback) {
    
    if (!callback) {
      // assume default parser
      callback = parser;
      parser = "properties";
    }
    
    // cached config file
    if (cache.hasOwnProperty(filename)) {
      var parsed;
      if (typeof parser === "string") {
        if (!(parsed = cache[filename][parser])) {
          parsed = cache[filename][parser]
                 = getParserFunction(parser)(cache[filename]["plain"]);
        }
      } else {
        // custom parse function
        parsed = parser(cache[filename]["plain"]);
      }
      if (callback) callback(parsed);
      return config;
    }
    
    // new config file
    $.ajax({
      url:      filename,
      type:     "GET",
      dataType: "text",
      
      // firefox logs an error otherwise, no clue what's happening
      mimeType: "text/plain",
      
    }).done(function(content) {
      if (debug) debug.log("LOADED: " + filename);
      
      cache[filename] = { "plain" : content };
      
      if (callback && parser === "plain") {
        callback(content);
      }
      else {
        var parsed = getParserFunction(parser)(content);
        if (typeof parser === "string")
          cache[filename][parser] = parsed;
        
        if (callback) callback(parsed);
      }
      
    });
    return config;
  }
  
  /**
   * Returns a Function that will be used as parser.
   * 
   * @param  {string|Function} parser Functions are returned as is
   * @return {Function}
   */
  function getParserFunction(parser) {
    if (typeof parser === "function") {
      return parser;
    }
    
    switch(parser) {
      case "lines":
        return getLines;
      
      case "properties":
        return parseProperties;
      
      case "json":
        if (JSON) return JSON.parse;
        else break;
      
      case "plain":
      // case "text":
      // default:
        return function(text) { return text; };
    }
    throw new Error('Config: Unknown parser "' + parser + "'");
  }
  
  /**
   * split filecontents into an array of lines,
   * removing empty lines and comments after '#'
   * 
   * @param  {string} text
   * @return {array}           array of strings
   */
  function getLines(text) {
    return _(
        text.split("\n").map(trimComments)
      ).without("");
  }
  
  /**
   * Smart properties parsing
   * 
   * @see config.require
   * 
   * @param  {string} text to be parsed
   * @return {Object}      object with assigned properties
   */
  function parseProperties(text) {
    var props = {},
        currentProp,
        line,
        total,
        matches;
    
    text.split("\n")
      .map(trimComments)
      .forEach(
        function(line, lineNum) {
          
          // kept empty lines until now for correct line numbers
          if (line === "") return;
          
          // property = value
          if (matches = line.match(/^(\S+)\s*=\s*(.*)$/)) {
            props[matches[1]] = JSON ? JSON.parse(matches[2]) : matches[2];
          }
          
          // [property] array definition
          else if (matches = line.match(/^\[(\S+)\]$/)) {
            currentProp = matches[1];
            if (!props.hasOwnProperty(currentProp))
              props[currentProp] = [];
          }
          
          // [property] array entry
          else if (currentProp) {
            props[currentProp].push(line);
          }
          
          else throw new Error("Config: Syntax error on line " + (lineNum + 1));
    });
    
    return props;
  }
  
  /**
   * Remove comments preceded by "#" and trims whitespace.
   * Comments do not have to start at the beginning of the line.
   * 
   * @param  {string} string
   * @return {string}
   */
  function trimComments(string) {
    var i = string.indexOf("#");
    return (0 <= i ? string.slice(0, i) : string).trim();
  }
  
})(jQuery);
