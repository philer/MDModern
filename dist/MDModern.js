(function (exports,win,$,console,doc) {
	'use strict';

	win = 'default' in win ? win['default'] : win;
	$ = 'default' in $ ? $['default'] : $;
	console = 'default' in console ? console['default'] : console;
	doc = 'default' in doc ? doc['default'] : doc;

	var name = "MDModern";
	var version = "0.2.0";
	var license = "GPL-3.0+";

	// export mdm object into global namespace
	var mdm = {};
	// event target (jQuery event aggregate)
	var $mdm = $(mdm);

	// unique username
	var selectedUser = null;

	// unique session_file
	var selectedSession = null;

	// unique language_code
	var selectedLanguage = null;

	var users = [];
	var sessions = [];
	var languages = [];

	// true if mdm_noecho has been called more recently then mdm_prompt
	var passwordExpected = false;
	var locked = true;

	/// API functions ///

	/**
	 * jQuery style event listener binding
	 * @see https://api.jquery.com/on/
	 */
	mdm.on = $.fn.on.bind($mdm);

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
	.on("passwordPrompt", function () {
	  passwordExpected = true; // set to false immediately when sending pw
	}).one("prompt", unlock);

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
	  log("MDM: sending username");
	  alert("USER###" + user);
	}

	function _sendPassword(password) {
	  log("MDM: sending password");
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
	mdm.login = function (user, password) {
	  if (lock()) {
	    mdm.one("passwordPrompt", function () {
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
	mdm.selectUser = function (user) {
	  user = "" + user;
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
	mdm.sendPassword = function (password) {
	  if (lock()) {
	    if (passwordExpected) {
	      mdm.one("prompt", unlock);
	      _sendPassword(password);
	    } else if (selectedUser) {

	      // MDM will reset the user after three tries. We will
	      // just set the user again in that case, unless no user
	      // has been selected at all so far. We then send the PW
	      // as soon as MDM asks for it.
	      mdm.one("passwordPrompt", function () {
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
	mdm.getUser = function (username) {
	  for (var i = 0, len = users.length; i < len; ++i) {
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
	mdm.getSession = function (session_file) {
	  for (var i = 0, len = sessions.length; i < len; ++i) {
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
	mdm.selectSession = function (session) {
	  log("MDM: sending session info");
	  alert("SESSION###" + session.name + "###" + session.file);
	  return mdm;
	};

	/**
	 * Find an existing Language by its (full) code
	 * 
	 * @param  {String}   code e.g. "en_us.UTF-8"
	 * @return {Language}
	 */
	mdm.getLanguage = function (code) {
	  for (var i = 0, len = languages.length; i < len; ++i) {
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
	mdm.selectLanguage = function (language) {
	  log("MDM: sending language info");
	  alert("LANGUAGE###" + language.code);
	  return mdm;
	};

	/**
	 * Shutdown immediately
	 * 
	 * @return {mdm}    chainable
	 */
	mdm.shutdown = function () {
	  log("MDM: sending force-shutdown request");
	  alert("FORCE-SHUTDOWN###");
	  return mdm;
	};

	/**
	 * Reboot immediately
	 * 
	 * @return {mdm}    chainable
	 */
	mdm.restart = function () {
	  log("MDM: sending force-restart request");
	  alert("FORCE-RESTART###");
	  return mdm;
	};

	/**
	 * Suspend immediately
	 * 
	 * @return {mdm}    chainable
	 */
	mdm.suspend = function () {
	  log("MDM: sending force-suspend request");
	  alert("FORCE-SUSPEND###");
	  return mdm;
	};

	/**
	 * quit MDM (restarts the greeter)
	 * 
	 * @return {mdm}    chainable
	 */
	mdm.quit = function () {
	  log("MDM: sending quit request");
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
	  log("EVENT: " + evtName, evtData);
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
	  select: function select() {
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
	  select: function select() {
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
	  select: function select() {
	    mdm.selectLanguage(this);
	    return this;
	  },

	  /**
	   * country specific language code
	   * 
	   * @return {String} e.g. en_US
	   */
	  countryCode: function countryCode() {
	    return this.code.split('.')[0];
	  },

	  /**
	   * short language code
	   * 
	   * @return {String} e.g. en
	   */
	  shortCode: function shortCode() {
	    return this.code.split('_')[0];
	  },

	  /**
	   * Language encoding as specified by language code
	   * 
	   * @return {String} e.g. UTF-8
	   */
	  charset: function charset() {
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
	win.mdm_enable = function () {
	  trigger("enabled");
	};
	// Called by MDM to enable user input
	win.mdm_disable = function () {
	  trigger("disabled");
	};

	// Called by MDM to allow the user to input a username
	win.mdm_prompt = function (message) {
	  trigger("usernamePrompt");
	  trigger("prompt");
	};
	// Called by MDM to allow the user to input a password
	win.mdm_noecho = function (message) {
	  trigger("passwordPrompt");
	  trigger("prompt");
	};

	// Called by MDM to add a user to the list of users
	win.mdm_add_user = function (username, gecos, status, facefile) {
	  var user = new User(username, gecos, status, facefile);
	  users.push(user);
	  trigger("userAdded", user);
	};
	// Called by MDM to add a session to the list of sessions
	win.mdm_add_session = function (session_name, session_file) {
	  var session = new Session(session_name, session_file);
	  sessions.push(session);
	  trigger("sessionAdded", session);
	};
	// Called by MDM to add a language to the list of languages
	win.mdm_add_language = function (language_name, language_code) {
	  var language = new Language(language_name, language_code);
	  languages.push(language);
	  trigger("languageAdded", language);
	};

	win.mdm_set_current_user = function (username) {
	  if (username && selectedUser !== username) {
	    selectedUser = username;
	    trigger("userSelected", mdm.getUser(username) || new User(username));
	  }
	};
	win.mdm_set_current_session = function (session_name, session_file) {
	  if (selectedSession !== session_file) {
	    selectedSession = session_file;
	    trigger("sessionSelected", mdm.getSession(session_file));
	  }
	};
	win.mdm_set_current_language = function (language_name, language_code) {
	  if (selectedLanguage !== language_code) {
	    selectedLanguage = language_code;
	    trigger("languageSelected", mdm.getLanguage(language_code));
	  }
	};

	// Called by MDM to show an error
	win.mdm_error = function (message) {
	  if (message) trigger("error", message);
	};
	// Called by MDM to show a message (usually "Please enter your username")
	win.mdm_msg = function (message) {
	  if (message) trigger("message", message);
	};
	// Called by MDM to show a timed login countdown
	win.mdm_timed = function (message) {
	  trigger("timedMessage", message);
	  trigger("loginCountdown", +message.match(/[0-9]+/)[0]);
	};

	// Called by MDM to set the welcome message
	win.set_welcome_message = function (message) {
	  if (message) trigger("welcomeMessage", message);
	};

	// Called by MDM to update the clock
	win.set_clock = function (message) {
	  trigger("clockUpdate", message);
	};

	// Called by MDM if the SHUTDOWN command shouldn't appear in the greeter
	win.mdm_hide_shutdown = function () {
	  trigger("shutdownHidden");
	};
	// Called by MDM if the RESTART command shouldn't appear in the greeter
	win.mdm_hide_restart = function () {
	  trigger("restartHidden");
	};
	// Called by MDM if the SUSPEND command shouldn't appear in the greeter
	win.mdm_hide_suspend = function () {
	  trigger("suspendHidden");
	};
	// Called by MDM if the QUIT command shouldn't appear in the greeter
	win.mdm_hide_quit = function () {
	  trigger("quitHidden");
	};

	// Called by MDM if the XDMCP command shouldn't appear in the greeter
	// apparently not implemented by MDM (mdmwebkit.c @ 2014-07-30)
	win.mdm_hide_xdmcp = function () {
	  trigger("xdmcpHidden");
	};

	var $cover = $("#fade-in-cover");

	$(function () {

	  // set an additional timeout because MDM keeps us covered for a little while
	  win.setTimeout(function () {

	    // using css transition instead of $.fn.fadeOut
	    $cover.addClass('ready');

	    win.setTimeout(function () {
	      $cover.remove();
	    }, 1000);
	  }, 1500);
	});

	["shutdown", "restart", "suspend", "quit"].forEach(function (name) {

	  var $btn = $("#" + name);

	  if ($btn.length) {

	    mdm.on(name + "Hidden", function () {
	      $btn.hide();
	    });

	    $btn.find("a").click(mdm[name]);
	  }
	});

	var $messages = $("#messages");

	/// MDM listeners ///

	// mdm.on("message",  showMessage);
	mdm.on("error", showMessage);

	/// DOM listeners ///

	// // hide errors and messages by clicking
	// $msgBox.click(function() { $(this).fadeOut(); });

	/// FUNCTIONS ///

	/**
	 * Display a regular message to the user
	 * 
	 * @param  {event}     evt  optional mdm event
	 * @param  {string}    msg
	 */
	function showMessage(evt, msg) {
	  if (!msg) return;

	  var $msg = $('<li class="message">'
	  // + timeTag()
	   + msg + '</li>');

	  // if (evt.type === "error") {
	  //   $msg.addClass("error");
	  // }

	  $messages.append($msg.fadeIn()).animate({ scrollTop: $messages.height() }, 500);
	}

	// function timeTag() {
	//   var t = new Date();
	//   return '<time datetime="'
	//        + t.toISOString() + '">'
	//        + t.getHours() + ':' + t.getMinutes() + ':' + t.getSeconds()
	//        + '</time>';
	// }

	var $countdown = $("#countdown");
	var $countdownBar = $("#countdown-bar");
	var countdownMax = -1;

	/// MDM listeners ///

	if ($countdown.length) {
	  mdm.on("loginCountdown", updateCountdown);
	}

	if ($countdownBar.length) {
	  mdm.on("loginCountdown", updateCountdownBar);
	}

	/// FUNCTIONS ///

	/**
	 * Make countdown times visible and set time using text-based element
	 * 
	 * @param  {event} evt   optional
	 * @param  {int}   time  time remaining until automatic login
	 */
	function updateCountdown(evt, time) {
	  $countdown.text(time);
	}

	/**
	 * Make countdown times visible using progress bar
	 * 
	 * @param  {event} evt   optional
	 * @param  {int}   time  time remaining until automatic login
	 */
	function updateCountdownBar(evt, time) {
	  if (time > countdownMax) {
	    countdownMax = time;
	    $countdownBar.addClass('running');
	  }
	  $countdownBar.css({ width: 100 * time / countdownMax + "%" });
	}

	var $body = $(document.body);
	var $loginForm = $("#login");
	var $username = $("#username", $loginForm);
	var $password = $("#password", $loginForm);
	var faceImgElem = $("#face", $loginForm)[0];

	var users$1 = [];
	var $userlistToggle = $("#userlist-toggle", $loginForm);
	var $usersUl = $("#users", $loginForm);
	var userlistExpanded = false;
	var selectedUser$1;

	/// MDM listeners ///

	mdm.on("userAdded", addUser).on("userSelected", selectUser).one("passwordPrompt", function () {
	  $password.select();
	});

	/// DOM listeners ///

	// select user by typing in the input field
	$username.on("propertychange input paste", function (evt) {
	  selectUser(evt, mdm.getUser(this.value));
	});

	$loginForm.submit(login);

	/// FUNCTIONS ///

	/**
	 * Gather data and give it to mdm for login
	 * 
	 * @param  {event} evt  form submit event
	 */
	function login(evt) {
	  evt.preventDefault();
	  mdm.login($username[0].value, $password[0].value);
	  $password.select();
	}

	/**
	 * Adds a user to the user list, including
	 * image load and event listeners
	 * @param  {event} evt   optional mdm event
	 * @param  {user}  user  user object
	 */
	function addUser(evt, user) {
	  var $li = $('<li>'),
	      $a = $('<a>' + user.name + '</a>'),
	      $icon = $('<i class="fa fa-user">'),
	      img = new Image();

	  $usersUl.append($li.append($a.prepend($icon)));

	  if (user.loggedIn) {
	    $li.addClass("loggedIn");
	  }

	  $a.click(function (evt) {
	    selectUser(evt, user);
	  });

	  img.loaded = false;
	  img.src = user.facefile;
	  $(img).one("load", function () {
	    $icon.remove();
	    $a.prepend(img);
	    img.loaded = true;
	  });

	  user.$li = $li;
	  user.img = img;
	  users$1.push(user);
	  if (users$1.length === 1) {
	    $userlistToggle.one("click", toggleUserlist);
	  }

	  if (!selectedUser$1) {
	    selectedUser$1 = user;
	  }
	}

	/**
	 * Set a user as selected for login
	 * by passing a user object
	 * 
	 * @param  {event} evt  mdm or click event
	 * @param  {User}  user
	 */
	function selectUser(evt, user) {
	  selectedUser$1.$li.removeClass("selected");
	  updateFace(user);

	  if (!(user && user.$li)) return;

	  if (!$username.is(evt.target) && user.name !== $username[0].value) {
	    $username.val(user.name);
	  }

	  if (user.$li) {
	    user.$li.addClass("selected");
	  }

	  selectedUser$1 = user;
	}

	/**
	 * Sets the face image next to the loginForm
	 * if the currently selected user has one.
	 * The relevant file is
	 * /home/{username}/.face
	 * 
	 * @param  {User} user   user object
	 */
	function updateFace(user) {
	  $loginForm.removeClass("hasface");

	  if (!(user && user.img)) return;

	  if (user.img.loaded) {
	    faceImgElem.src = user.img.src;
	    $loginForm.addClass("hasface");
	  } else {
	    $(user.img).one("load", function () {
	      if (user == selectedUser$1) faceImgElem.src = user.img.src;
	      $loginForm.addClass("hasface");
	    });
	  }
	}

	/**
	 * Toggle function for the user selection list.
	 * This function recursively listenes to
	 * click events either on the toggle anchor (when closed)
	 * or on the entire body (when expanded).
	 * 
	 * @param  {event} evt  click event
	 */
	function toggleUserlist(evt) {
	  if (userlistExpanded) {
	    $body.off("click", toggleUserlist);
	    $userlistToggle.one("click", toggleUserlist);
	  } else {
	    $body.click(toggleUserlist);
	    evt.stopPropagation();
	  }
	  $usersUl.toggleClass("expanded");
	  userlistExpanded = !userlistExpanded;
	}

	var $sessionElem = $("#session");
	var $sessionsUl = $("#sessions");
	var selectedSession$1;

	// MDM listeners
	mdm.on("sessionAdded", addSession).on("sessionSelected", selectSession);

	/// FUNCTIONS ///

	/**
	 * Add a selectable session to the list
	 * 
	 * @param {event}   evt     optional mdm event
	 * @param {Session} session session object
	 * @return {publicAPI}      chainable
	 */
	function addSession(evt, session) {
	  session.$li = $(document.createElement("li")).append($("<a>" + session.name + "</a>").click(session.select.bind(session)));

	  $sessionsUl.append(session.$li);

	  if (!selectedSession$1) {
	    selectedSession$1 = session;
	  }
	}

	/**
	 * Update GUI for selected session
	 * 
	 * @param  {event}  evt       optional mdm event
	 * @param  {Session} session  session object
	 * @return {publicAPI}        chainable
	 */
	function selectSession(evt, session) {
	  selectedSession$1.$li.removeClass("selected");
	  $sessionElem.html(session.name);
	  session.$li.addClass("selected");
	  selectedSession$1 = session;
	}

	var $languageElem = $("#language");
	var $languagesUl = $("#languages");
	var selectedLanguage$1;

	mdm.on("languageAdded", addLanguage).on("languageSelected", selectLanguage);

	/// FUNCTIONS ///

	/**
	 * Add a selectable language to the list
	 * 
	 * @param {event}      evt      optional mdm event
	 * @param {language}   language language object
	 * @return {publicAPI}          chainable
	 */
	function addLanguage(evt, language) {
	  language.$li = $(document.createElement("li")).append($('<a><span class="code">' + language.countryCode() + '</span><span class="name">' + language.name + '</span></a>').click(language.select.bind(language)));

	  $languagesUl.append(language.li);

	  // show first language by default
	  if (!selectedLanguage$1) {
	    selectedLanguage$1 = language;
	  }
	}

	/**
	 * Update GUI for selected language
	 * 
	 * @param  {event}     evt       optional mdm event
	 * @param  {language}  language  language object
	 * @return {publicAPI}           chainable
	 */
	function selectLanguage(evt, language) {
	  selectedLanguage$1.$li.removeClass("selected");
	  $languageElem.html(language.shortCode());
	  language.$li.addClass("selected");
	  selectedLanguage$1 = language;
	}

	var storage = win.localStorage;
	var cache = Object.create(null);

	/// Functions

	function require(filename, parser, useStorage) {

	  if (filename in cache) {
	    return cache[filename];
	  }

	  if (typeof parser === "boolean") {
	    useStorage = parser;
	    parser = undefined;
	  }
	  useStorage = storage && (useStorage === undefined || useStorage);

	  if (useStorage && storage.hasOwnProperty(filename)) {
	    console.log("Config: Found config file '" + filename + "' in storage");
	    return cache[filename] = Promise.resolve(JSON.parse(storage.getItem(filename)));
	  }

	  var interrupted = false;

	  var errorLogger = function errorLogger(action) {
	    return function (e) {
	      if (!interrupted) {
	        console.log("Config: Error while " + action + " config file '" + filename + "': " + e);
	        interrupted = true;
	      }
	      throw e;
	    };
	  };

	  return cache[filename] = new Promise(function (success, fail) {
	    console.log("Config: Loading config file '" + filename + "'...");
	    var request = new XMLHttpRequest();
	    request.open("GET", filename);
	    request.responseType = "text";
	    request.addEventListener("load", function () {
	      if (request.status < 400) {
	        success(request.responseText);
	      } else {
	        fail(Error(request.statusText));
	      }
	    });
	    request.send();
	  }).catch(errorLogger("loading")).then(getParserFunction(parser)).catch(errorLogger("parsing")).then(function (parsed) {
	    if (useStorage) {
	      storage.setItem(filename, JSON.stringify(parsed));
	    }
	    return parsed;
	  }).catch(errorLogger("storing"));
	}

	/// PARSING

	// regular expressions for parsers
	var reValue = /^(\S+)\s*=\s*(.*)$/;
	var reArray = /^\[(\S+)\]$/;
	var reComment = /^[^#"]*(:?"[^"]*"[^#"]*)*/;

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

	  switch (parser) {
	    case undefined:
	    case null:
	    case "properties":
	      return parseProperties;

	    case "plain":
	      return identity;

	    case "lines":
	      return getLines;

	    case "json":
	      return JSON.parse;
	  }
	  throw Error('Config: Unknown parser "' + parser + "'");
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
	  var props = {};
	  var currentProp;
	  var line;
	  var total;
	  var matches;

	  text.split("\n").map(trimComments).forEach(function (line, lineNum) {

	    // kept empty lines until now for correct line numbers
	    if (line === "") return;

	    // property = value
	    if (matches = reValue.exec(line)) {
	      props[matches[1]] = JSON ? JSON.parse(matches[2]) : matches[2];
	    }

	    // [property] array definition
	    else if (matches = reArray.exec(line)) {
	        currentProp = matches[1];
	        if (!props.hasOwnProperty(currentProp)) {
	          props[currentProp] = [];
	        }
	      }

	      // [property] array entry
	      else if (currentProp) {
	          props[currentProp].push(line);
	        } else throw Error("Config: Syntax error on line " + (lineNum + 1) + " '" + line + "'");
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
	  // var i = string.indexOf("#");
	  // return (0 <= i ? string.slice(0, i) : string).trim();
	  return reComment.exec(string)[0];
	}

	/**
	 * returns first argument unchanged, does nothing
	 * @param  {mixed} x
	 * @return {mixed} x
	 */
	function identity(x) {
	  return x;
	}

	/// Init ///

	var template = '<div class="slideshow-layer"><span class="slideshow-filename"></span></div>' + '<div class="slideshow-layer"><span class="slideshow-filename"></span></div>' + '<span class="slideshow-controls">' + '<a class="slideshow-prev"><i class="fa fa-chevron-left"></i></a>' + '<a class="slideshow-toggle"><i class="fa fa-play"></i></a>'
	// +   '<a class="slideshow-shuffle"><i class="fa fa-random"></i></a>'
	 + '<a class="slideshow-next"><i class="fa fa-chevron-right"></i></a>' + '</span>';

	var defaultSettings = {
	  interval_seconds: 10,
	  fade_seconds: 2,
	  shuffle: true,
	  show_controls: true,
	  show_filename: false,
	  grid: null,
	  fill_style: null,
	  background_style: '#222'
	};

	function init(cfg) {

	  var parents = doc.getElementsByClassName("slideshow");
	  var parent = parents.length ? parents[0] : doc.body;

	  if (!cfg.grid || cfg.grid === "1x1" || !/^\d+x\d+$/.test(cfg.grid)) {
	    console.log("initializing slideshow");

	    win.slideshow = new Slideshow(parent, cfg);
	  } else {
	    console.log("initializing slideshow grid " + cfg.grid);

	    win.slideshow = new Grid(parent, cfg);
	  }
	}

	/// Models ///

	/**
	 * Initialize slideshow with given settings
	 * 
	 * @param  {object} cfg settings
	 */
	function Slideshow(parent, cfg) {
	  this.parent = parent;
	  this.parent.insertAdjacentHTML('afterbegin', template);

	  // initialize layers
	  var elems = this.parent.getElementsByClassName("slideshow-layer"),
	      filenameElems = this.parent.getElementsByClassName("slideshow-filename");
	  this.layers = [];
	  for (var i = 0, len = elems.length; i < len; ++i) {
	    this.layers[i] = new Layer(this, elems[i], filenameElems[i]);
	  }
	  this.currentLayer = 0;

	  // loader
	  this.loader = new Image();
	  this.loader.addEventListener("load", this._showCurrent.bind(this));

	  // controls
	  this.ctrlsElem = this.parent.getElementsByClassName("slideshow-controls")[0];

	  // init config after relevant DOM elements are initialized
	  if (cfg) {
	    this.init(cfg);
	  }

	  // buttons & additional listeners
	  this._btn("next");
	  this._btn("prev");
	  // this._btn("shuffle");
	  this._btn("toggle");
	}

	Slideshow.prototype = {

	  init: function init(cfg) {
	    this.cfg = cfg = $.extend(defaultSettings, cfg);
	    this.sources = cfg.backgrounds.slice(0);
	    this.currentId = 0;

	    // already running, new config
	    if (this.intervalId) {
	      this.stop();
	    }

	    // 1 image shortcut
	    if (this.sources.length === 1) {
	      this.setImage(this.sources[0]);
	      this.ctrlsElem.style.display = "none";
	      return;
	    }

	    if (cfg.shuffle) {
	      this.shuffle();
	    }

	    this.setImage(this.sources[0]).start();

	    if (cfg.show_controls) {
	      this.ctrlsElem.style.display = null;
	    } else {
	      this.ctrlsElem.style.display = "none";
	    }
	    return this;
	  },

	  /**
	   * Adds control button listener
	   * @param  {string} action
	   * @return {this}   chaining
	   */
	  _btn: function _btn(action) {
	    var btn = this.ctrlsElem.getElementsByClassName("slideshow-" + action);
	    if (btn.length) {
	      btn[0].addEventListener("click", this[action].bind(this));
	      return btn[0];
	    }
	  },

	  /**
	   * Start loading specified image
	   * The image will be displayed by _showCurrent()
	   * once it has finished loading
	   * 
	   * @param {string} src
	   */
	  setImage: function setImage(src) {
	    this.loader.src = src;
	    return this;
	  },

	  /**
	   * Makes an image visible on screen.
	   */
	  _showCurrent: function _showCurrent() {
	    this.layers[this.currentLayer].hide();
	    this.currentLayer = (this.currentLayer + 1) % this.layers.length;
	    this.layers[this.currentLayer].show(this.loader);
	    return this;
	  },

	  /**
	   * skip ahead to next image
	   * 
	   * @return {slideshow} chaining
	   */
	  next: function next(evt) {
	    if (!evt || !evt.defaultPrevented && !evt.preventDefault()) {
	      this.currentId = (this.currentId + 1) % this.sources.length;
	      this.setImage(this.sources[this.currentId]);
	    }
	    return this;
	  },

	  /**
	   * previous image
	   * 
	   * @return {slideshow} chaining
	   */
	  prev: function prev(evt) {
	    if (!evt || !evt.defaultPrevented && !evt.preventDefault()) {
	      this.currentId = (this.currentId + this.sources.length - 1) % this.sources.length;
	      this.setImage(this.sources[this.currentId]);
	    }
	    return this;
	  },

	  /**
	   * (re)start interval
	   * 
	   * @return {slideshow} chaining
	   */
	  start: function start(evt) {
	    if (!evt || !evt.defaultPrevented && !evt.preventDefault()) {
	      if (!this.intervalId) {
	        this.intervalId = win.setInterval(this.next.bind(this), this.cfg.interval_seconds * 1000);
	        this.ctrlsElem.classList.add("slideshow-running");
	      }
	    }
	    return this;
	  },

	  /**
	   * halt interval
	   * 
	   * @return {slideshow} chaining
	   */
	  stop: function stop(evt) {
	    if (!evt || !evt.defaultPrevented && !evt.preventDefault()) {
	      if (this.intervalId) {
	        win.clearInterval(this.intervalId);
	        this.intervalId = false;
	        this.ctrlsElem.classList.remove("slideshow-running");
	      }
	    }
	    return this;
	  },

	  /**
	   * toggle slideshow running state (start|stop)
	   * 
	   * @return {slideshow} chaining
	   */
	  toggle: function toggle(evt) {
	    return this.intervalId ? this.stop(evt) : this.start(evt);
	  },

	  /**
	   * shuffle image sources
	   * 
	   * @return {slideshow} chaining
	   */
	  shuffle: function shuffle() {
	    // sources = _.shuffle(sources);
	    var sources = this.sources,
	        i = sources.length,
	        tmp,
	        j;
	    while (i--) {
	      j = Math.floor(Math.random() * i);
	      tmp = sources[i];
	      sources[i] = sources[j];
	      sources[j] = tmp;
	    }
	    return this;
	  },

	  openCurrent: function openCurrent() {
	    win.open(this.sources[this.currentId]);
	  }

	};

	/**
	 * Layers are used by a slideshow to do fading effects.
	 * At least 2 layers are needed per slideshow
	 */
	function Layer(slideshow, elem, filenameElem) {
	  this.ss = slideshow;
	  this.elem = elem;
	  this.elemStyle = elem.style;
	  this.filenameElem = filenameElem;
	}

	Layer.prototype = {

	  show: function show(img) {
	    var fillStyle = this.ss.cfg.fill_style ? this.ss.cfg.fill_style : "50% 50% / " + this._getCssSizing(img) + " no-repeat";

	    this.elemStyle.background =

	    // primary background (loaded image)
	    'url("' + img.src + '") ' + fillStyle

	    // secondary background in case primary does not cover
	     + "," + this.ss.cfg.background_style;

	    // new image: make visible, put on top after fading
	    this.elemStyle.transition = "z-index 0s " + this.ss.cfg.fade_seconds + "s";
	    this.elemStyle.zIndex = 1;
	    this.elemStyle.opacity = 1;
	    this.elemStyle.visibility = "visible";

	    if (this.ss.cfg.show_filename) {
	      this.filenameElem.innerHTML = img.src;
	    }
	    return this;
	  },

	  hide: function hide() {
	    var s = this.ss.cfg.fade_seconds;

	    // old image: put below and hide after fading
	    this.elemStyle.transition = "opacity " + s + "s,z-index 0s " + s + "s,visibility 0s " + s + "s";
	    this.elemStyle.zIndex = 0;
	    this.elemStyle.opacity = 0;
	    this.elemStyle.visibility = "hidden";
	    return this;
	  },

	  /**
	   * Tries to find an appropriate css background-size
	   * 
	   * @param  {Image}  img
	   * @return {string}
	   */
	  _getCssSizing: function _getCssSizing(img) {
	    // return "cover";
	    var rect = this.elem.getBoundingClientRect(),
	        eh = rect.bottom - rect.top,
	        ew = rect.right - rect.left,
	        ih = img.naturalHeight,
	        iw = img.naturalWidth,
	        ratioDelta = Math.abs(eh / ew - ih / iw);

	    // very small
	    if (ih < 0.6 * eh && iw < 0.6 * ew) {
	      return "auto";
	    }

	    // very large, roughly same ratio
	    if (ih >= eh && iw >= ew) {
	      return "cover";
	    }

	    // small-ish or extreme ratio difference
	    if (ih < 0.7 * eh || iw < 0.7 * ew || Math.abs(eh / ew - ih / iw) > 0.5) {
	      return "contain";
	    }

	    // large
	    return "cover";
	  }

	};

	/**
	 * Grid for multiple slideshows at the same time
	 */
	function Grid(parent, cfg) {
	  var rowsAndCols = cfg.grid.split("x"),
	      rows = rowsAndCols[0],
	      cols = rowsAndCols[1],
	      cell;

	  this.slideshows = [];

	  for (var row = 0; row < rows; ++row) {
	    for (var col = 0; col < cols; ++col) {

	      cell = doc.createElement("div");
	      cell.style.position = "absolute";
	      cell.style.left = col / cols * 100 + "%";
	      cell.style.top = row / rows * 100 + "%";
	      cell.style.width = 1 / cols * 100 + "%";
	      cell.style.height = 1 / rows * 100 + "%";

	      parent.appendChild(cell);

	      this.slideshows.push(new Slideshow(cell, $.extend(cfg, {

	        // randomize interval_seconds in interval [ 2.5 , 2*is - 2.5 ]
	        // and round to 4 digits
	        interval_seconds: Math.round((2.5 + Math.random() * (2 * (cfg.interval_seconds || defaultSettings.interval_seconds) - 5)) * 1000) / 1000
	      })));
	    }
	  }
	}

	Grid.prototype = {};

	// add public Slideshow interface to Grid
	Object.getOwnPropertyNames(Slideshow.prototype).forEach(function (prop) {
	  if (prop[0] !== '_') {
	    Grid.prototype[prop] = function () {
	      for (var i = 0, len = this.slideshows.length; i < len; ++i) {
	        this.slideshows[i][prop]();
	      }
	      return this;
	    };
	  }
	});

	require("slideshow.conf", false).then(init).catch(function () {
	  console.log("failed to initialize slideshow");
	});

	exports.name = name;
	exports.version = version;
	exports.license = license;

}((this.MDModern = this.MDModern || {}),window,jQuery,console,document));
//# sourceMappingURL=MDModern.js.map