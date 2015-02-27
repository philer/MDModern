/**
 * MDM communication wrapper/manager
 *
 * The mdm object provides an interface to
 * communicate with MDM the OOP way.
 * Functions called by MDM (from outside) will trigger
 * events. MDM provided data is accessible through getters.
 * Outgoing communication is wrapped in callable functions.
 * 
 * globals:
 *   jQuery
 *   mdm
 *   mdm_enable
 *   mdm_disable
 *   mdm_prompt
 *   mdm_noecho
 *   mdm_add_user
 *   mdm_add_session
 *   mdm_add_language
 *   mdm_set_current_user
 *   mdm_set_current_session
 *   mdm_set_current_language
 *   mdm_error
 *   mdm_msg
 *   mdm_timed
 *   set_welcome_message
 *   set_clock
 *   mdm_hide_shutdown
 *   mdm_hide_restart
 *   mdm_hide_suspend
 *   mdm_hide_quit
 *   mdm_hide_xdmcp
 * 
 * @author  Philipp Miller
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 * 
 */
(function($, win) {
  
  "use strict";
  
  // export mdm object into global namespace
  var mdm = win.mdm = {},
     $mdm          = $(mdm),
      userSelected = false,
      users        = [],
      sessions     = [],
      languages    = [];
  
  /// api functions
  
  /**
   * jQuery style event listener binding
   * @see https://api.jquery.com/on/
   */
  mdm.on  = $mdm.on.bind($mdm);
  
  /**
   * jQuery style event listener binding
   * @see https://api.jquery.com/one/
   */
  mdm.one = $mdm.one.bind($mdm);
  
  // listener used by the mdm module
  mdm.one("userSelected", function(evt, username) {
      userSelected = true;
    });
  
  /**
   * Attempt a login using the provided data.
   * Convenience/Wrapper function for most use cases.
   * 
   * @param  {String|User} user      username or User object
   * @param  {String}      password
   * @return {mdm}                   chainable
   */
  mdm.login = function(user, password, session, language) {
    if (session) {
      mdm.selectSession(session);
    }
    if (language) {
      mdm.selectLanguage(language);
    }
    return mdm
      .selectUser(user)
      .sendPassword(password);
  };
  
  /**
   * Find an existing User by his username
   * 
   * @param  {String} username
   * @return {User}
   */
  mdm.getUser = function(username) {
    for (var i = 0, len = users.length ; i < len ; ++i) {
      if (users[i].name === "" + username) {
        return users[i];
      }
    }
  };
  
  /**
   * Send username to MDM as the user who is logging in.
   * @param  {String|User} user  username or User object
   * @return {mdm}               chainable
   */
  mdm.selectUser = function(user) {
    if (typeof user !== "string") user = user.name;
    
    // additonal safeguard: only send passwords for known users
    // (MDM's replies are kinda unpredictable otherwise)
    if (mdm.getUser(user)) {
      if (debug) debug.log("MDM: sending username");
      alert("USER###" + user);
      userSelected = true;
    }
    else {
      trigger("error", 'User "' + user + '" doesn\'t exist!');
    }
    return mdm;
  };
  
  /**
   * Sends a password. This function also makes sure the password
   * is only sent when MDM expects it so as to not provoke an unexpected
   * response.
   * 
   * @param  {string} password
   * @return {mdm}              chainable
   */
  mdm.sendPassword = function(password) {
    if (!userSelected) {
      trigger("error", "No user selected!");
    }
    else {
      mdm.one("passwordPrompt", function() {
        if (debug) debug.log("MDM: sending password");
        alert("LOGIN###" + password);
      });
    }
    return mdm;
  };
  
  /**
   * Find an existing Session by its filen ame
   * 
   * @param  {String}  session_file file name
   * @return {Session}
   */
  mdm.getSession = function(session_file) {
    for (var i = 0, len = sessions.length ; i < len ; ++i) {
      if (sessions[i].file === "" + session_file) {
        return sessions[i];
      }
    }
  };
  
  /**
   * Set the session to log in into.
   * 
   * @param  {Session} session
   * @return {mdm}             chainable
   */
  mdm.selectSession = function(session) {
    if (debug) debug.log("MDM: sending session info");
    alert("SESSION###" + session.name + "###" + session.file);
    trigger("sessionSelected", session);
    return mdm;
  };
  
  /**
   * Find an existing Language by its (full) code
   * 
   * @param  {String}   code e.g. "en_us.UTF-8"
   * @return {Language}
   */
  mdm.getLanguage = function(code) {
    for (var i = 0, len = languages.length ; i < len ; ++i) {
      if (languages[i].code === "" + code) {
        return languages[i];
      }
    }
  };
  
  /**
   * Set the language for this session
   * 
   * @param  {Language} language
   * @return {mdm}               chainable
   */
  mdm.selectLanguage = function(language) {
    if (debug) debug.log("MDM: sending language info");
    alert("LANGUAGE###" + language.code);
    trigger("languageSelected", language);
    return mdm;
  };
  
  /**
   * Shutdown immediately
   * 
   * @return {mdm}    chainable
   */
  mdm.shutdown = function() {
    if (debug) debug.log("MDM: sending force-shutdown request");
    alert("FORCE-SHUTDOWN###");
    return mdm;
  };
  
  /**
   * Reboot immediately
   * 
   * @return {mdm}    chainable
   */
  mdm.restart = function() {
    if (debug) debug.log("MDM: sending force-restart request");
    alert("FORCE-RESTART###");
    return mdm;
  };
  
  /**
   * Suspend immediately
   * 
   * @return {mdm}    chainable
   */
  mdm.suspend = function() {
    if (debug) debug.log("MDM: sending force-suspend request");
    alert("FORCE-SUSPEND###");
    return mdm;
  };
  
  /**
   * quit MDM (restarts the greeter)
   * 
   * @return {mdm}    chainable
   */
  mdm.quit = function() {
    if (debug) debug.log("MDM: sending quit request");
    alert("QUIT###");
    return mdm;
  };
  
  
  /**
   * Private event triggering function called by
   * MDM api functions
   * @param  {string} evtName
   * @param  {mixed } evtData optional
   */
  function trigger(evtName, evtData) {
    if (debug) debug.log(
        "EVENT: "
        + evtName
        + (evtData ? "\t" + debug.formatString(evtData) : "")
      );
    
    $mdm.triggerHandler(evtName, evtData);
  }
  
  
  /// MODELS
  
  /**
   * Represents a user.
   * 
   * @param {string} username
   * @param {string} gecos     full name etc.
   * @param {string} status    online?
   */
  function User(username, gecos, loggedIn) {
    
    /**
     * login name
     * 
     * @type {string}
     */
    this.name = username;
    
    /**
     * full name etc.
     * 
     * @type {string}
     */
    this.gecos = gecos;
    
    /**
     * online loggedIn
     * 
     * @type {boolean}
     */
    this.loggedIn = !!loggedIn;
    
    /**
     * User's home directory
     * Set to /home/{username} by default
     * and then updated using passwd if available
     * 
     * @type {String}
     */
    this.home = "file:///home/" + username;
  }
  User.prototype = {
    
    /**
     * Simple string representation: username
     * @return {string}
     */
    toString: function toString() {
      return this.name;
    },
    
    /**
     * Tell MDM to use this user for upcoming login
     * @return {User} chainable
     */
    select: function() {
      mdm.selectUser(this);
      return this;
    }
    
  };
  
  /**
   * Represents a session.
   * 
   * @param {string} name
   * @param {string} file
   */
  function Session(name, file) {
    
    /**
     * session name
     * 
     * @type {String}
     */
    this.name = name;
    
    /**
     * session file name
     * @type {String}
     */
    this.file = file;
    
  }
  Session.prototype = {
    
    /**
     * Tell MDM to use this session for upcoming login
     * @return {Session} chainable
     */
    select: function() {
      mdm.selectSession(this);
      return this;
    }
    
  };
  
  /**
   * Represents a language.
   * 
   * @param {string} name
   * @param {string} code
   */
  function Language(name, code) {
    
    /**
     * Language name
     * 
     * @type {String}
     */
    this.name = name;
    
    /**
     * Full language code (e.g. en_US.UTF-8)
     * @type {String}
     */
    this.code = code;
    
  }
  Language.prototype = {
    
    /**
     * Tell MDM to use this language for upcoming login
     * @return {User} chainable
     */
    select: function() {
      mdm.selectLanguage(this);
      return this;
    },
    
    /**
     * country specific language code
     * 
     * @return {String} e.g. en_US
     */
    countryCode: function() {
      return this.code.split('.')[0];
    },
    
    /**
     * short language code
     * 
     * @return {String} e.g. en
     */
    shortCode: function() {
      return this.code.split('_')[0];
    },
    
    /**
     * Language encoding as specified by language code
     * 
     * @return {String} e.g. UTF-8
     */
    charset: function() {
      return this.code.split('.')[1];
    }
    
  };
  
  
  
  /**
   * The MDM API.
   * These functions are called by MDM from the outside,
   * so they need to be declared in global scope.
   * They should ONLY be called by MDM itself.
   */
  
  // Called by MDM to disable user input
  win.mdm_enable = function() {
    trigger("enabled");
  };
  // Called by MDM to enable user input
  win.mdm_disable = function() {
    trigger("disabled");
  };
  
  // Called by MDM to allow the user to input a username
  win.mdm_prompt = function(message) {
    trigger("usernamePrompt");
  };
  // Called by MDM to allow the user to input a password
  win.mdm_noecho = function(message) {
    trigger("passwordPrompt");
  };
  
  // Called by MDM to add a user to the list of users
  win.mdm_add_user = function(username, gecos, status) {
    var user = new User(username, gecos, status);
    users.push(user);
    trigger("userAdded", user);
  };
  // Called by MDM to add a session to the list of sessions
  win.mdm_add_session = function(session_name, session_file) {
    var session = new Session(session_name, session_file);
    sessions.push(session);
    trigger("sessionAdded", session);
  };
  // Called by MDM to add a language to the list of languages
  win.mdm_add_language = function(language_name, language_code) {
    var language = new Language(language_name, language_code);
    languages.push(language);
    trigger("languageAdded", language);
  };
  
  win.mdm_set_current_user = function(username) {
    trigger("userSelected", mdm.getUser(username));
  };
  win.mdm_set_current_session = function(session_name, session_file) {
    trigger("sessionSelected", mdm.getSession(session_file));
  };
  win.mdm_set_current_language = function(language_name, language_code) {
    trigger("languageSelected", mdm.getLanguage(language_code));
  };
  
  // Called by MDM to show an error
  win.mdm_error = function(message) {
    trigger("error", message);
  };
  // Called by MDM to show a message (usually "Please enter your username")
  win.mdm_msg = function(message) {
    trigger("message", message);
  };
  // Called by MDM to show a timed login countdown
  win.mdm_timed = function(message) {
    trigger("timedMessage", message);
    trigger("loginCountdown", +message.match(/[0-9]+/)[0]);
  };
  
  // Called by MDM to set the welcome message
  win.set_welcome_message = function(message) {
    trigger("welcomeMessage", message);
  };
  
  // Called by MDM to update the clock
  win.set_clock = function(message) {
    trigger("clockUpdate", message);
  };
  
  // Called by MDM if the SHUTDOWN command shouldn't appear in the greeter
  win.mdm_hide_shutdown = function() {
    trigger("shutdownHidden");
  };
  // Called by MDM if the RESTART command shouldn't appear in the greeter
  win.mdm_hide_restart = function() {
    trigger("restartHidden");
  };
  // Called by MDM if the SUSPEND command shouldn't appear in the greeter
  win.mdm_hide_suspend = function() {
    trigger("suspendHidden");
  };
  // Called by MDM if the QUIT command shouldn't appear in the greeter
  win.mdm_hide_quit = function() {
    trigger("quitHidden");
  };
  
  // Called by MDM if the XDMCP command shouldn't appear in the greeter
  // apparently not implemented by MDM (mdmwebkit.c @ 2014-07-30)
  win.mdm_hide_xdmcp = function() {
    trigger("xdmcpHidden");
  };
  
  
})(jQuery, window);
