import global from 'window';

import {once, trigger} from './internalEvents.js';
import {trigger as publicTrigger} from './events.js';

// Models
import User from './User.js';
import Session from './Session.js';
import Language from './Language.js';

const users = [];
const sessions = [];
const languages = [];

// user.id, session.id and language.id that were selected through user input
const selectedSettings = Object.create(null);

// user.id, session.id and language.id that were chosen by MDM
const currentSettings = Object.create(null);

// Queue for all calls made to MDM's backend API.
// Calls are only run once a previous call has received a reply.
import PromiseQueue from './PromiseQueue.js';
const apiCallQueue = new PromiseQueue();

let passwordExpected = false;

// utility: create a shallow copy of an object including prototype
const copy = obj => Object.assign(Object.create(Object.getPrototypeOf(obj)), obj);

/// LOGIN API ///

/**
 * Attempt a login using the provided data.
 * Convenience/Wrapper function for most use cases.
 * 
 * @param  {User|string}     username
 * @param  {string}          password
 * @param  {Session|string}  session  optional
 * @param  {Language|string} language optional
 */
export function login(user, password, session, language) {
  if (session) {
    selectSession(session);
    if (language) {
      selectLanguage(language);
    }
  }
  if (!selectedSettings.user || selectedSettings.user !== (user.id || user)) {
    selectUser(user);
  }
  return sendPassword(password);
}

/**
 * Attempt a login using the provided password.
 * A user must already be selected; Use this function for a traditional
 * two-step login.
 * 
 * @param  {string} password
 * @return {Promise}
 */
export function sendPassword(password) {
  
  if (!password) {
    return Promise.reject("Password required!");
  }
  if (!selectedSettings.user) {
    return Promise.reject("Please chose a login name!");
  }
  
  const settings = copy(selectedSettings);
  
  return apiCallQueue.push(async function(resolve/*, reject*/) {
    
    if (settings.user !== currentSettings.user || !passwordExpected) {
      await selectUser(settings.user);
    }
    
    if ("session" in settings && settings.session !== currentSettings.session) {
      let session = getSession(settings.session);
      
      // no reply expected
      alert("SESSION###" + session.name + "###" + session.file);
    }
    
    if ("language" in settings && settings.language !== currentSettings.language) {
      let language = getLanguage(settings.language);
      
      // no reply expected
      alert("LANGUAGE###" + language.code);
    }
    
    once("passwordPrompt", function() {
      // we resolve instead of rejecting since this is currently the only
      // relevant case. If the attempt succeeds we get terminated immediately.
      resolve("Login attempt failed");
      return true;
    });
    
    passwordExpected = false;
    alert("LOGIN###" + password);
    
  });
  
}


/// SIMPLE SETTERS ///

/**
 * Set the session to log in into.
 * 
 * @param  {Session} session
 * @return {mdm}             chainable
 */
export function selectUser(user) {
  user = getUser(user);
  selectedSettings.user = user.id;
  return apiCallQueue.push(function(resolve/*, reject*/) {
    
    // For some reason MDM calls mdm_set_current_user twice.
    // We hide the first event and let the second slip through.
    // We use the noecho call to resolve.
    once("userSelected", function() {
      once("passwordPrompt", function() {
        resolve(user);
        return true;
      });
    });
    
    alert("USER###" + user.name);
  });
}

/**
 * Set the session to log in into.
 * 
 * @param  {Session} session
 * @return {mdm}             chainable
 */
export function selectSession(session) {
  session = getSession(session);
  selectedSettings.session = session.id;
  publicTrigger("sessionSelected", session);
  return Promise.resolve(session); // consistent API
}

/**
 * Set the language for this session
 * 
 * @param  {Language} language
 * @return {mdm}               chainable
 */
export function selectLanguage(language) {
  language = getLanguage(language);
  selectedSettings.language = language.id;
  publicTrigger("languageSelected", language);
  return Promise.resolve(language); // consistent API
}


/// GETTERS ///

/**
 * Find an existing User
 * 
 * @param  {mixed} user User object or username
 * @return {User}
 */
export function getUser(user) {
  user = user.id || user;
  return users.find(usr => usr.id === user);
}

/**
 * Find an existing Session
 * 
 * @param  {mixed}   session Session object or session_file name
 * @return {Session}
 */
export function getSession(session) {
  session = session.id || session;
  return sessions.find(sess => sess.id === session);
}

/**
 * Find an existing Language
 * 
 * @param  {mixed}    language Language object or code, e.g. "en_us.UTF-8"
 * @return {Language}
 */
export function getLanguage(language) {
  language = language.id || language;
  return languages.find(lang => lang.id === language);
}



/// BACKEND API ///

/**
 * The MDM API.
 * These functions are called by MDM from the outside,
 * so they need to be declared in global scope.
 * They should ONLY be called by MDM itself.
 */

// Called by MDM to add a user to the list of users
global.mdm_add_user = function(username, gecos, status, facefile) {
  const user = new User(username, gecos, status, facefile);
  users.push(user);
  trigger("userAdded", user);
};

// Called by MDM to add a session to the list of sessions
global.mdm_add_session = function(session_name, session_file) {
  const session = new Session(session_name, session_file);
  sessions.push(session);
  trigger("sessionAdded", session);
};

// Called by MDM to add a language to the list of languages
global.mdm_add_language = function(language_name, language_code) {
  const language = new Language(language_name, language_code);
  languages.push(language);
  trigger("languageAdded", language);
};


// Called by MDM to inform about the currently selected user
global.mdm_set_current_user = function(username) {
  
  // MDM clears the selected user after three failed login attempts
  // (or after one if the username was sent via LOGIN###).
  // We capture the call internally and re-select the user.
  if (!username && selectedSettings.user) {
    
    // capture the upcoming username prompt
    // note: be sure not to use the usernamePrompt event interally
    once("usernamePrompt", () => false);
    once("prompt", () => false);
    
    // send the username immediately, bypassing the queue
    alert("USER###" + selectedSettings.user);
    
    return;
  }
  
  const user = getUser(username) || new User(username);
  currentSettings.user = user.id;
  trigger("userSelected", user);
};

// Called by MDM to inform about the currently selected session
global.mdm_set_current_session = function(session_name, session_file) {
  const session = getSession(session_file) || new Session(session_name, session_file);
  currentSettings.session = session.id;
  trigger("sessionSelected", session);
};

// Called by MDM to inform about the currently selected language
global.mdm_set_current_language = function(language_name, language_code) {
  const language = getLanguage(language_code) || new Language(language_name, language_code);
  currentSettings.language = language.id;
  trigger("languageSelected", language);
};


// Called by MDM when expecting a username via alert("LOGIN###...")
global.mdm_prompt = function(message) {
  passwordExpected = false;
  trigger("prompt", message);
  trigger("usernamePrompt", message);
};

// Called by MDM when expecting a password via alert("LOGIN###...")
global.mdm_noecho = function(message) {
  passwordExpected = true;
  trigger("prompt", message);
  trigger("passwordPrompt", message);
};


// Called by MDM to disable user input
global.mdm_enable = function() {
  trigger("enabled");
};

// Called by MDM to enable user input
global.mdm_disable = function() {
  trigger("disabled");
};


// Called by MDM to show an error
global.mdm_error = function(message) {
  if (message) trigger("error", message);
};
