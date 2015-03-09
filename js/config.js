/**
 * Retrive configuration as array of lines from a file
 * 
 * globals: config (localStorage|sessionStorage)
 * 
 * @author  Philipp Miller
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 * 
 */
(function(win, storage) {
  
  "use strict";
  
  var config = win.config = {
        require: require,
      }
    , configFiles = Object.create(null)
    ;
  
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
  function require(filename, parser, callback) {
    if (filename in configFiles) {
      if (callback || (callback = parser)) {
        configFiles[filename].addCallback(callback);
      }
    }
    else {
      configFiles[filename] = new ConfigFile(filename, parser, callback);
    }
    return config;
  }
  
  /// Model
  
  function ConfigFile(filename, parser, callback) {
    
    if (storage && storage.hasOwnProperty(filename)) {
      this.parsed = JSON.parse(storage.getItem(filename));
      this.loaded = true;
    
      if (callback || (callback = parser)) {
        callback(this.parsed);
      }
      console.log("found '" + filename + "' in storage");
    }
    
    else {
      this.loaded = false;
      this.filename = filename;
      this.callbacks = [];
      
      if (callback) {
        this.parser = getParserFunction(parser);
        this.callbacks.push(callback);
      }
      else {
        // assume default parser
        this.parser = parseProperties;
        
        // callback => parser
        if (parser) {
          this.callbacks.push(parser);
        }
      }
      this._load();
    }
    
  }
  ConfigFile.prototype = {
    
    addCallback: function(fn) {
      if (this.loaded) {
        fn(this.parsed);
      } else {
        this.callbacks.push(fn);
      }
      return this;
    },
    
    _load: function() {
      console.log("loading file '" + this.filename + "'");
      
      this.request = new XMLHttpRequest();
      this.request.open("GET", this.filename);
      this.request.addEventListener("load", this._loaded.bind(this));
      this.request.responseType = "text";
      this.request.send();
    },
    
    _loaded: function() {
      this.loaded = true;
      this.parsed = this.parser(this.request.responseText);
      if (storage) {
        storage.setItem(this.filename, JSON.stringify(this.parsed));
      }
      for (var i = 0, len = this.callbacks.length ; i < len ; ++i) {
        this.callbacks[i](this.parsed);
      }
      delete this.callbacks;
      delete this.request;
    },
    
  };
  
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
        
        /* falls through */
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
    return text.split("\n").map(trimComments).filter(identity);
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
            props[matches[1]] = (JSON ? JSON.parse(matches[2]) : matches[2]);
          }
          
          // [property] array definition
          else if (matches = line.match(/^\[(\S+)\]$/)) {
            currentProp = matches[1];
            if (!props.hasOwnProperty(currentProp)) {
              props[currentProp] = [];
            }
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
  
  /**
   * returns first argument unchanged, does nothing
   * @param  {mixed} x
   * @return {mixed} x
   */
  function identity(x) {
    return x;
  }
  
})(window, false /*window.localStorage*/ /*window.sessionStorage*/);
