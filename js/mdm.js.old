/**
 * MDM communication wrapper/manager
 *
 * The mdm object provides an interface to
 * communicate with MDM the OOP way.
 * Functions called by MDM (from outside) will trigger
 * events. MDM provided data is accessible through getters.
 * Outgoing communication is wrapped in callable functions.
 * 
 * @author  Philipp Miller
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 * 
 */
import win from 'window';
import $ from 'jQuery';
import console from 'console';

// export mdm object into global namespace
const mdm = {};
export default mdm;

// event target (jQuery event aggregate)
const $mdm = $(mdm);

const users     = [];

const sessions  = [];

const languages = [];

// unique username
let selectedUser = null;

// unique session_file
let selectedSession = null;

// unique language_code
let selectedLanguage = null;

// true if mdm_noecho has been called more recently then mdm_prompt
let passwordExpected = false;
let locked = true;

/// API functions ///

/**
 * jQuery style event listener binding
 * @see https://api.jquery.com/on/
 */
mdm.on  = $.fn.on.bind($mdm);

/**
 * jQuery style event listener binding
 * @see https://api.jquery.com/one/
 */
mdm.one = $.fn.one.bind($mdm);

// listener used by the mdm module
mdm
  // .on("userSelected", function(evt, user) {
  //   selectedUser = user.name;
  // })
  .on("passwordPrompt", function() {
    passwordExpected = true; // set to false immediately when sending pw
  })
  .one("prompt", unlock)
  ;


function lock() {
  if (!locked) {
    locked = true;
    trigger('locked');
    return true;
  }
  return false;
}

function unlock() {
  if (locked) {
    locked = false;
    trigger('unlocked');
    return true;
  }
  return false;
}

function _sendUser(user) {
  console.log("MDM: sending username");
  alert("USER###" + user);
}

function _sendPassword(password) {
  console.log("MDM: sending password");
  passwordExpected = false;
  alert("LOGIN###" + password);
}

/**
 * Single-step login, expects both username and password at once.
 * 
 * @param  {string|User} user
 * @param  {string}      password
 * @return {Object}      mdm (chaining)
 */
mdm.login = function(user, password) {
  if (lock()) {
    mdm.one("passwordPrompt", function() {
      mdm.one("prompt", unlock);
      _sendPassword(password);
    });
    _sendUser(user);
  }
  return this;
};

/**
 * Send only the user who's account we want to log into. Use this
 * for the traditional two-step login process and follow up by
 * calling mdm.sendPassword(pw)
 * 
 * @param  {string|User} user
 * @return {object}      mdm (chaining)
 */
mdm.selectUser = function(user) {
  user = ""+user;
  if (user !== selectedUser && lock()) {
    mdm.one("prompt", unlock);
    _sendUser(user);
  }
  return this;
};

/**
 * Send only the password, assuming we have already set a user
 * for login. If no user has been selected yet nothing will happen.
 * 
 * @param  {string} password
 * @return {Object} mdm (chaining)
 */
mdm.sendPassword = function(password) {
  if (lock()) {
    if (passwordExpected) {
      mdm.one("prompt", unlock);
      _sendPassword(password);
      
    } else if (selectedUser) {
      
      // MDM will reset the user after three tries. We will
      // just set the user again in that case, unless no user
      // has been selected at all so far. We then send the PW
      // as soon as MDM asks for it.
      mdm.one("passwordPrompt", function() {
        mdm.one("prompt", unlock);
        _sendPassword(password);
      });
      _sendUser(selectedUser);
    }
  }
  return this;
};

/**
 * Find an existing User by his username
 * 
 * @param  {String} username
 * @return {User}
 */
mdm.getUser = function(username) {
  for (let i = 0, len = users.length ; i < len ; ++i) {
    if (users[i].name === "" + username) {
      return users[i];
    }
  }
};

/**
 * Find an existing Session by its file name
 * 
 * @param  {String}  session_file file name
 * @return {Session}
 */
mdm.getSession = function(session_file) {
  for (let i = 0, len = sessions.length ; i < len ; ++i) {
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
  console.log("MDM: sending session info");
  alert("SESSION###" + session.name + "###" + session.file);
  return mdm;
};

/**
 * Find an existing Language by its (full) code
 * 
 * @param  {String}   code e.g. "en_us.UTF-8"
 * @return {Language}
 */
mdm.getLanguage = function(code) {
  for (let i = 0, len = languages.length ; i < len ; ++i) {
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
  console.log("MDM: sending language info");
  alert("LANGUAGE###" + language.code);
  return mdm;
};

/**
 * Shutdown immediately
 * 
 * @return {mdm}    chainable
 */
mdm.shutdown = function() {
  console.log("MDM: sending force-shutdown request");
  alert("FORCE-SHUTDOWN###");
  return mdm;
};

/**
 * Reboot immediately
 * 
 * @return {mdm}    chainable
 */
mdm.restart = function() {
  console.log("MDM: sending force-restart request");
  alert("FORCE-RESTART###");
  return mdm;
};

/**
 * Suspend immediately
 * 
 * @return {mdm}    chainable
 */
mdm.suspend = function() {
  console.log("MDM: sending force-suspend request");
  alert("FORCE-SUSPEND###");
  return mdm;
};

/**
 * quit MDM (restarts the greeter)
 * 
 * @return {mdm}    chainable
 */
mdm.quit = function() {
  console.log("MDM: sending quit request");
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
  console.log("EVENT: " + evtName, evtData);
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
function User(username, gecos, loggedIn, facefile) {
  
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
   * user online? false if no, localized string if yes
   * 
   * @type {boolean|string}
   */
  this.loggedIn = loggedIn || false;
  
  /**
   * Path to User's facefile (aka. avatar)
   * 
   * Earlier versions of MDM don't provide this parameter
   * so we default to the usual path `/home/<username>/.face`
   * 
   * @type {string}
   */
  this.facefile = facefile || "file:///home/" + username + "/.face";
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
  },
  
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
  },
  
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
  },
  
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
win.mdm_prompt = function(/*message*/) {
  trigger("usernamePrompt");
  trigger("prompt");
};
// Called by MDM to allow the user to input a password
win.mdm_noecho = function(/*message*/) {
  trigger("passwordPrompt");
  trigger("prompt");
};

// Called by MDM to add a user to the list of users
win.mdm_add_user = function(username, gecos, status, facefile) {
  const user = new User(username, gecos, status, facefile);
  users.push(user);
  trigger("userAdded", user);
};
// Called by MDM to add a session to the list of sessions
win.mdm_add_session = function(session_name, session_file) {
  const session = new Session(session_name, session_file);
  sessions.push(session);
  trigger("sessionAdded", session);
};
// Called by MDM to add a language to the list of languages
win.mdm_add_language = function(language_name, language_code) {
  const language = new Language(language_name, language_code);
  languages.push(language);
  trigger("languageAdded", language);
};

win.mdm_set_current_user = function(username) {
  if (username && selectedUser !== username) {
    selectedUser = username;
    trigger("userSelected", mdm.getUser(username) || new User(username));
  }
};
win.mdm_set_current_session = function(session_name, session_file) {
  if (selectedSession !== session_file) {
    selectedSession = session_file;
    trigger("sessionSelected", mdm.getSession(session_file));
  }
};
win.mdm_set_current_language = function(language_name, language_code) {
  if (selectedLanguage !== language_code) {
    selectedLanguage = language_code;
    trigger("languageSelected", mdm.getLanguage(language_code));
  }
};

// Called by MDM to show an error
win.mdm_error = function(message) {
  if (message) trigger("error", message);
};
// Called by MDM to show a message (usually "Please enter your username")
win.mdm_msg = function(message) {
  if (message) trigger("message", message);
};
// Called by MDM to show a timed login countdown
win.mdm_timed = function(message) {
  trigger("timedMessage", message);
  trigger("loginCountdown", +message.match(/[0-9]+/)[0]);
};

// Called by MDM to set the welcome message
win.set_welcome_message = function(message) {
  if (message) trigger("welcomeMessage", message);
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
