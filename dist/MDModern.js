(function (exports,global,$,console$1,doc) {
	'use strict';

	global = 'default' in global ? global['default'] : global;
	$ = 'default' in $ ? $['default'] : $;
	console$1 = 'default' in console$1 ? console$1['default'] : console$1;
	doc = 'default' in doc ? doc['default'] : doc;

	var undefined;

	var babelHelpers = {};

	babelHelpers.asyncToGenerator = function (fn) {
	  return function () {
	    var gen = fn.apply(this, arguments);
	    return new Promise(function (resolve, reject) {
	      function step(key, arg) {
	        try {
	          var info = gen[key](arg);
	          var value = info.value;
	        } catch (error) {
	          reject(error);
	          return;
	        }

	        if (info.done) {
	          resolve(value);
	        } else {
	          return Promise.resolve(value).then(function (value) {
	            return step("next", value);
	          }, function (err) {
	            return step("throw", err);
	          });
	        }
	      }

	      return step("next");
	    });
	  };
	};

	babelHelpers;

	var name = "MDModern";
	var version = "0.2.0";
	var license = "GPL-3.0+";

	var listeners = Object.create(null);

	function on(evt, listener) {
	  if (evt in listeners) {
	    listeners[evt].push(listener);
	  } else {
	    listeners[evt] = [listener];
	  }
	}

	function off(evt, listener) {
	  if (evt in listeners) {
	    if (listener) {
	      var fns = listeners[evt];

	      // remove first occurence
	      for (var i = 0, len = fns.length; i < len; ++i) {
	        var fn = fns[i];

	        // fn._fn identifies wrapped .once listeners
	        if (fn === listener || fn._fn === listener) {
	          if (fns.length === 1) {

	            // don't keep an empty array
	            delete listeners[evt];
	          } else {
	            fns.splice(i, 1);
	          }
	          break;
	        }
	      }
	    } else {
	      delete listeners[evt];
	    }
	  }
	}

	function once(evt, listener) {
	  function wrapper(evt) {
	    off(evt, wrapper);
	    listener.call(this, evt);
	  }
	  wrapper._fn = listener; // identifiable for .off
	  on(evt, wrapper);
	}

	function trigger(evt) {
	  var _console;

	  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	    args[_key - 1] = arguments[_key];
	  }

	  (_console = console).log.apply(_console, [evt].concat(args));
	  if (evt in listeners) {
	    var fns = listeners[evt].slice();
	    for (var i = 0, len = fns.length; i < len; ++i) {
	      fns[i].apply(fns, [evt].concat(args));
	    }
	  }
	}

	var listeners$1 = Object.create(null);

	function once$1(evt, fn) {
	  listeners$1[evt] = fn;
	}

	function off$1(evt) {
	  delete listeners$1[evt];
	}

	/**
	 * Trigger the listener if it exists. If it doesn't exist or returns true
	 * on execution the event is triggered publicly.
	 * 
	 * @param  {String}    evt  event name
	 * @param  {...mixed} args  array of arguments
	 */
	function trigger$1(evt) {
	  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	    args[_key - 1] = arguments[_key];
	  }

	  if (evt in listeners$1) {
	    var listener = listeners$1[evt];
	    off$1(evt);
	    if (!listener.apply(undefined, [evt].concat(args))) {
	      return;
	    }
	  }
	  trigger.apply(undefined, [evt].concat(args));
	}

	/**
	* Represents a user.
	* 
	* @param {string} username
	* @param {string} gecos     full name etc.
	* @param {string} status    online?
	*/
	function User(username, gecos, loggedIn, facefile) {

	  /**
	   * unique identifier
	   * 
	   * @type {String}
	   */
	  this.id = username;

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
	   * Tell MDM to use this user for upcoming login
	   * @return {User} chainable
	   */
	  select: function select() {
	    selectUser(this);
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
	   * unique identifier
	   * 
	   * @type {String}
	   */
	  this.id = file;

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
	    selectSession(this);
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
	   * unique identifier
	   * 
	   * @type {String}
	   */
	  this.id = code;

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
	    selectLanguage(this);
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
	 * Queue that executes callback synchronously.
	 * Each callback will be called only once the previous one has been resolved
	 * or rejected.
	 */
	function PromiseQueue() {
	  this._items = [];
	  this._running = false;
	}

	PromiseQueue.prototype = {

	  /**
	   * Add a function that can be used as an argument to Promise()
	   * @param  {Function} callback args: resolve, reject
	   * @return {Promise}           Promise that will resolve when 
	   */

	  push: function push(callback) {
	    var _this = this;

	    var p = new Promise(function (resolve, reject) {
	      return _this._items.push({ callback: callback, resolve: resolve, reject: reject });
	    });
	    this._start();
	    return p;
	  },
	  _start: function _start() {
	    // already started
	    if (this._running /* || !this._items.length*/) {
	        return;
	      }
	    this._running = true;
	    this._next();
	  },


	  /**
	   * Run the Queue.
	   * This means that items will be executed one by one until the queue is empty.
	   */
	  _next: function _next() {
	    if (!this._items.length) {
	      this._running = false;
	      return;
	    }

	    var call = this._items.shift();
	    var queue = this;

	    // call.callback is the user-provided function (see .push)
	    new Promise(call.callback).then(function () {
	      call.resolve.apply(call, arguments);
	      queue._next();
	    }, function () {
	      call.reject.apply(call, arguments);
	      queue._next();
	    });
	  }
	};

	var users = [];
	var sessions = [];
	var languages = [];

	// user.id, session.id and language.id that were selected through user input
	var selectedSettings = Object.create(null);

	// user.id, session.id and language.id that were chosen by MDM
	var currentSettings = Object.create(null);

	var apiCallQueue = new PromiseQueue();

	var passwordExpected = false;

	// utility: create a shallow copy of an object including prototype
	var copy = function copy(obj) {
	  return Object.assign(Object.create(Object.getPrototypeOf(obj)), obj);
	};

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
	function login(user, password, session, language) {
	  if (session) {
	    selectSession(session);
	    if (language) {
	      selectLanguage(language);
	    }
	  }
	  selectUser(user);
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
	function sendPassword(password) {

	  if (!password) {
	    return Promise.reject("Password required!");
	  }
	  if (!("user" in selectedSettings)) {
	    return Promise.reject("Please chose a login name!");
	  }

	  var settings = copy(selectedSettings);

	  return apiCallQueue.push(function () {
	    var ref = babelHelpers.asyncToGenerator(regeneratorRuntime.mark(function _callee(resolve, reject) {
	      var session, language;
	      return regeneratorRuntime.wrap(function _callee$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              if (!(settings.user !== currentSettings.user || !passwordExpected)) {
	                _context.next = 3;
	                break;
	              }

	              _context.next = 3;
	              return selectUser(settings.user);

	            case 3:

	              if ("session" in settings && settings.session !== currentSettings.session) {
	                session = getSession(settings.session);

	                // no reply expected

	                alert("SESSION###" + session.name + "###" + session.file);
	              }

	              if ("language" in settings && settings.language !== currentSettings.language) {
	                language = getLanguage(settings.language);

	                // no reply expected

	                alert("LANGUAGE###" + language.code);
	              }

	              once$1("error", function (evt, msg) {
	                reject(msg);
	                return true;
	              });
	              // once("success", resolve); // Not supported by MDM in any meaningful way

	              passwordExpected = false;
	              alert("LOGIN###" + password);

	            case 8:
	            case 'end':
	              return _context.stop();
	          }
	        }
	      }, _callee, this);
	    }));
	    return function (_x, _x2) {
	      return ref.apply(this, arguments);
	    };
	  }());
	}

	/// SIMPLE SETTERS ///

	/**
	 * Set the session to log in into.
	 * 
	 * @param  {Session} session
	 * @return {mdm}             chainable
	 */
	function selectUser(user) {
	  user = getUser(user);
	  selectedSettings.user = user.id;
	  return apiCallQueue.push(function (resolve /*, reject*/) {

	    // For some reason MDM calls mdm_set_current_user twice.
	    // We hide the first event and let the second slip through.
	    // We use the noecho call to resolve.
	    once$1("userSelected", function () {
	      once$1("passwordPrompt", function () {
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
	function selectSession(session) {
	  session = getSession(session);
	  selectedSettings.session = session.id;
	  trigger("sessionSelected", session);
	  return Promise.resolve(session); // consistent API
	}

	/**
	 * Set the language for this session
	 * 
	 * @param  {Language} language
	 * @return {mdm}               chainable
	 */
	function selectLanguage(language) {
	  language = getLanguage(language);
	  selectedSettings.language = language.id;
	  trigger("languageSelected", language);
	  return Promise.resolve(language); // consistent API
	}

	/// GETTERS ///

	/**
	 * Find an existing User
	 * 
	 * @param  {mixed} user User object or username
	 * @return {User}
	 */
	function getUser(user) {
	  user = typeof user.id === "undefined" ? user : user.id;
	  return users.find(function (usr) {
	    return usr.id === user;
	  });
	  // for (let usr of users) {
	  //   if (usr.id === user) {
	  //     return usr;
	  //   }
	  // }
	}

	/**
	 * Find an existing Session
	 * 
	 * @param  {mixed}   session Session object or session_file name
	 * @return {Session}
	 */
	function getSession(session) {
	  session = typeof session.id === "undefined" ? session : session.id;
	  return sessions.find(function (sess) {
	    return sess.id === session;
	  });
	  // for (let sess of sessions) {
	  //   if (sess.id === session) {
	  //     return sess;
	  //   }
	  // }
	}

	/**
	 * Find an existing Language
	 * 
	 * @param  {mixed}    language Language object or code, e.g. "en_us.UTF-8"
	 * @return {Language}
	 */
	function getLanguage(language) {
	  language = typeof language.id === "undefined" ? language : language.id;
	  return languages.find(function (lang) {
	    return lang.id === language;
	  });
	  // for (let lang of languages) {
	  //   if (lang.id === language) {
	  //     return lang;
	  //   }
	  // }
	}

	/// BACKEND API ///

	/**
	 * The MDM API.
	 * These functions are called by MDM from the outside,
	 * so they need to be declared in global scope.
	 * They should ONLY be called by MDM itself.
	 */

	// Called by MDM to add a user to the list of users
	global.mdm_add_user = function (username, gecos, status, facefile) {
	  var user = new User(username, gecos, status, facefile);
	  users.push(user);
	  trigger$1("userAdded", user);
	};

	// Called by MDM to add a session to the list of sessions
	global.mdm_add_session = function (session_name, session_file) {
	  var session = new Session(session_name, session_file);
	  sessions.push(session);
	  trigger$1("sessionAdded", session);
	};

	// Called by MDM to add a language to the list of languages
	global.mdm_add_language = function (language_name, language_code) {
	  var language = new Language(language_name, language_code);
	  languages.push(language);
	  trigger$1("languageAdded", language);
	};

	// Called by MDM to inform about the currently selected user
	global.mdm_set_current_user = function (username) {
	  var user = getUser(username) || new User(username);
	  currentSettings.user = user.id;
	  trigger$1("userSelected", user);
	};

	// Called by MDM to inform about the currently selected session
	global.mdm_set_current_session = function (session_name, session_file) {
	  var session = getSession(session_file) || new Session(session_name, session_file);
	  currentSettings.session = session.id;
	  trigger$1("sessionSelected", session);
	};

	// Called by MDM to inform about the currently selected language
	global.mdm_set_current_language = function (language_name, language_code) {
	  var language = getLanguage(language_code) || new Language(language_name, language_code);
	  currentSettings.language = language.id;
	  trigger$1("languageSelected", language);
	};

	// Called by MDM when expecting a username via alert("LOGIN###...")
	global.mdm_prompt = function () /*message*/{
	  passwordExpected = false;
	  trigger$1("usernamePrompt");
	  // trigger("prompt");
	};

	// Called by MDM when expecting a password via alert("LOGIN###...")
	global.mdm_noecho = function () /*message*/{
	  passwordExpected = true;
	  trigger$1("passwordPrompt");
	  // trigger("prompt");
	};

	// Called by MDM to disable user input
	global.mdm_enable = function () {
	  trigger$1("enabled");
	};

	// Called by MDM to enable user input
	global.mdm_disable = function () {
	  trigger$1("disabled");
	};

	// Called by MDM to show an error
	global.mdm_error = function (message) {
	  if (message) trigger$1("error", message);
	};

	/**
	 * Shutdown immediately
	 */
	function shutdown() {
	  // console.log("MDM: sending force-shutdown request");
	  alert("FORCE-SHUTDOWN###");
	  return this;
	}

	/**
	 * Reboot immediately
	 */
	function restart() {
	  // console.log("MDM: sending force-restart request");
	  alert("FORCE-RESTART###");
	  return this;
	}

	/**
	 * Suspend immediately
	 */
	function suspend() {
	  // console.log("MDM: sending force-suspend request");
	  alert("FORCE-SUSPEND###");
	  return this;
	}

	/**
	 * quit MDM (restarts the greeter)
	 */
	function quit() {
	  // console.log("MDM: sending quit request");
	  alert("QUIT###");
	  return this;
	}

	/**
	 * The MDM API.
	 * These functions are called by MDM from the outside,
	 * so they need to be declared in global scope.
	 * They should ONLY be called by MDM itself.
	 */

	// Called by MDM if the SHUTDOWN command shouldn't appear in the greeter
	global.mdm_hide_shutdown = function () {
	  trigger("shutdownHidden");
	};
	// Called by MDM if the RESTART command shouldn't appear in the greeter
	global.mdm_hide_restart = function () {
	  trigger("restartHidden");
	};
	// Called by MDM if the SUSPEND command shouldn't appear in the greeter
	global.mdm_hide_suspend = function () {
	  trigger("suspendHidden");
	};
	// Called by MDM if the QUIT command shouldn't appear in the greeter
	global.mdm_hide_quit = function () {
	  trigger("quitHidden");
	};

	// Called by MDM if the XDMCP command shouldn't appear in the greeter
	// apparently not implemented by MDM (mdmwebkit.c @ 2014-07-30)
	global.mdm_hide_xdmcp = function () {
	  trigger("xdmcpHidden");
	};

	/**
	 * The MDM API.
	 * These functions are called by MDM from the outside,
	 * so they need to be declared in global scope.
	 * They should ONLY be called by MDM itself.
	 */

	// Called by MDM to show a message (usually "Please enter your username")
	global.mdm_msg = function (message) {
	  if (message) trigger("message", message);
	};

	// Called by MDM to show a timed login countdown
	global.mdm_timed = function (message) {
	  trigger("timedMessage", message);
	  trigger("loginCountdown", +message.match(/[0-9]+/)[0]);
	};

	// Called by MDM to set the welcome message
	global.set_welcome_message = function (message) {
	  if (message) trigger("welcomeMessage", message);
	};

	// Called by MDM to update the clock
	global.set_clock = function (message) {
	  trigger("clockUpdate", message);
	};

	function triggerReady() {
	  off("usernamePrompt", triggerReady);
	  off("passwordPrompt", triggerReady);
	  trigger("ready");
	}

	on("usernamePrompt", triggerReady);
	on("passwordPrompt", triggerReady);

var mdm = Object.freeze({
	  addEventListener: on,
	  on: on,
	  removeEventListener: off,
	  off: off,
	  once: once,
	  one: once,
	  login: login,
	  sendPassword: sendPassword,
	  selectUser: selectUser,
	  selectSession: selectSession,
	  selectLanguage: selectLanguage,
	  getUser: getUser,
	  getSession: getSession,
	  getLanguage: getLanguage,
	  shutdown: shutdown,
	  restart: restart,
	  suspend: suspend,
	  quit: quit
	});

	function uncover() {
	  var $cover = $("#fade-in-cover");

	  // using css transition instead of $.fn.fadeOut
	  $cover.addClass('ready');

	  // delay for animation duration
	  global.setTimeout(function () {
	    $cover.remove();
	  }, 1000);

	  global.clearTimeout(id);
	  off("ready", uncover);
	}

	on("ready", uncover);

	// fallback timeout in case something breaks
	var id = global.setTimeout(function () {
	  console.log("MDM ready timeout");
	  uncover();
	}, 5000);

	["shutdown", "restart", "suspend", "quit"].forEach(function (name) {

	  var $btn = $("#" + name);

	  if ($btn.length) {

	    on(name + "Hidden", function () {
	      $btn.hide();
	    });

	    $btn.find("a").click(mdm[name]);
	  }
	});

	var $messages = $("#messages");

	/// MDM listeners ///

	// mdm.on("message",  showMessage);
	on("error", showMessage);

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
	  on("loginCountdown", updateCountdown);
	}

	if ($countdownBar.length) {
	  on("loginCountdown", updateCountdownBar);
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
	var selectedUser = void 0;

	/// MDM listeners ///

	on("userAdded", addUser);
	on("userSelected", selectUser$1);
	once("passwordPrompt", function () {
	  $password.select();
	});

	/// DOM listeners ///

	// select user by typing in the input field
	$username.on("propertychange input paste", function (evt) {
	  selectUser$1(evt, getUser(this.value));
	});

	$loginForm.submit(login$1);

	/// FUNCTIONS ///

	/**
	 * Gather data and give it to mdm for login
	 * 
	 * @param  {event} evt  form submit event
	 */
	function login$1(evt) {
	  evt.preventDefault();
	  login($username[0].value, $password[0].value);
	  $password.select();
	}

	/**
	 * Adds a user to the user list, including
	 * image load and event listeners
	 * @param  {event} evt   optional mdm event
	 * @param  {user}  user  user object
	 */
	function addUser(evt, user) {
	  var $li = $('<li>');
	  var $a = $('<a>' + user.name + '</a>');
	  var $icon = $('<i class="fa fa-user">');
	  var img = new Image();

	  $usersUl.append($li.append($a.prepend($icon)));

	  if (user.loggedIn) {
	    $li.addClass("loggedIn");
	  }

	  $a.click(function (evt) {
	    selectUser$1(evt, user);
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

	  if (!selectedUser) {
	    selectedUser = user;
	  }
	}

	/**
	 * Set a user as selected for login
	 * by passing a user object
	 * 
	 * @param  {event} evt  mdm or click event
	 * @param  {User}  user
	 */
	function selectUser$1(evt, user) {
	  selectedUser.$li.removeClass("selected");
	  updateFace(user);

	  if (!(user && user.$li)) return;

	  if (!$username.is(evt.target) && user.name !== $username[0].value) {
	    $username.val(user.name);
	  }

	  if (user.$li) {
	    user.$li.addClass("selected");
	  }

	  selectedUser = user;
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
	      if (user === selectedUser) {
	        // still relevant?
	        faceImgElem.src = user.img.src;
	        $loginForm.addClass("hasface");
	      }
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
	var selectedSession = void 0;

	// MDM listeners
	on("sessionAdded", addSession);
	on("sessionSelected", selectSession$1);

	/// FUNCTIONS ///

	/**
	 * Add a selectable session to the list
	 * 
	 * @param {event}   evt     optional mdm event
	 * @param {Session} session session object
	 * @return {publicAPI}      chainable
	 */
	function addSession(evt, session) {
	  session.$li = $("<li>").append($("<a>" + session.name + "</a>").click(session.select.bind(session)));

	  $sessionsUl.append(session.$li);

	  if (!selectedSession) {
	    selectedSession = session;
	  }
	}

	/**
	 * Update GUI for selected session
	 * 
	 * @param  {event}  evt       optional mdm event
	 * @param  {Session} session  session object
	 * @return {publicAPI}        chainable
	 */
	function selectSession$1(evt, session) {
	  selectedSession.$li.removeClass("selected");
	  $sessionElem.html(session.name);
	  session.$li.addClass("selected");
	  selectedSession = session;
	}

	var $languageElem = $("#language");
	var $languagesUl = $("#languages");
	var selectedLanguage = void 0;

	// MDM listeners
	on("languageAdded", addLanguage);
	on("languageSelected", selectLanguage$1);

	/// FUNCTIONS ///

	/**
	 * Add a selectable language to the list
	 * 
	 * @param {event}      evt      optional mdm event
	 * @param {language}   language language object
	 * @return {publicAPI}          chainable
	 */
	function addLanguage(evt, language) {
	  language.$li = $("<li>").append($('<a>\n          <span class="code">' + language.countryCode() + '</span>\n          <span class="name">' + language.name + '</span>\n        </a>').click(language.select.bind(language)));

	  $languagesUl.append(language.$li);

	  // show first language by default
	  if (!selectedLanguage) {
	    selectedLanguage = language;
	  }
	}

	/**
	 * Update GUI for selected language
	 * 
	 * @param  {event}     evt       optional mdm event
	 * @param  {language}  language  language object
	 * @return {publicAPI}           chainable
	 */
	function selectLanguage$1(evt, language) {
	  selectedLanguage.$li.removeClass("selected");
	  $languageElem.html(language.shortCode());
	  language.$li.addClass("selected");
	  selectedLanguage = language;
	}

	var storage = global.localStorage;
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
	    console$1.log("Config: Found config file '" + filename + "' in storage");
	    return cache[filename] = Promise.resolve(JSON.parse(storage.getItem(filename)));
	  }

	  var interrupted = false;

	  var errorLogger = function errorLogger(action) {
	    return function (e) {
	      if (!interrupted) {
	        console$1.log("Config: Error while " + action + " config file '" + filename + "': " + e);
	        interrupted = true;
	      }
	      throw e;
	    };
	  };

	  return cache[filename] = new Promise(function (success, fail) {
	    console$1.log("Config: Loading config file '" + filename + "'...");
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

	// regular expressions for parsers
	var reValue = /^(\S+)\s*=\s*(.*)$/;
	var reArray = /^\[(\S+)\]$/;
	var reComment = /^[^#"]*(:?"[^"]*"[^#"]*)*/;

	/**
	 * split filecontents into an array of lines,
	 * removing empty lines and comments after '#'
	 * 
	 * @param  {string} text
	 * @return {array}           array of strings
	 */
	var getLines = function getLines(text) {
	  return text.split("\n").map(trimComments).filter(identity);
	};

	/**
	 * Remove comments preceded by "#" and trims whitespace.
	 * Comments do not have to start at the beginning of the line.
	 * 
	 * @param  {string} string
	 * @return {string}
	 */
	var trimComments = function trimComments(string) {
	  return reComment.exec(string)[0];
	};

	/**
	 * returns first argument unchanged, does nothing
	 * @param  {mixed} x
	 * @return {mixed} x
	 */
	var identity = function identity(x) {
	  return x;
	};

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
	  var currentProp = void 0;
	  var matches = void 0;

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
	    console$1.log("initializing slideshow");

	    global.slideshow = new Slideshow(parent, cfg);
	  } else {
	    console$1.log("initializing slideshow grid " + cfg.grid);

	    global.slideshow = new Grid(parent, cfg);
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
	  var elems = this.parent.getElementsByClassName("slideshow-layer");
	  var filenameElems = this.parent.getElementsByClassName("slideshow-filename");

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
	        this.intervalId = global.setInterval(this.next.bind(this), this.cfg.interval_seconds * 1000);
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
	        global.clearInterval(this.intervalId);
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
	    var sources = this.sources;
	    var i = sources.length;
	    var tmp = void 0;
	    var j = void 0;

	    while (i--) {
	      j = Math.floor(Math.random() * i);
	      tmp = sources[i];
	      sources[i] = sources[j];
	      sources[j] = tmp;
	    }
	    return this;
	  },

	  openCurrent: function openCurrent() {
	    global.open(this.sources[this.currentId]);
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
	    this.elemStyle.transition = 'opacity ' + s + 's,z-index 0s ' + s + 's,visibility 0s ' + s + 's';
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
	    var rect = this.elem.getBoundingClientRect();
	    var eh = rect.bottom - rect.top;
	    var ew = rect.right - rect.left;
	    var ih = img.naturalHeight;
	    var iw = img.naturalWidth;
	    // const ratioDelta = Math.abs(eh/ew - ih/iw);

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
	  var rowsAndCols = cfg.grid.split("x");
	  var rows = rowsAndCols[0];
	  var cols = rowsAndCols[1];
	  var cell = void 0;

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
	  console$1.log("failed to initialize slideshow");
	});

	exports.name = name;
	exports.version = version;
	exports.license = license;

}((this.MDModern = this.MDModern || {}),window,jQuery,console,document));
//# sourceMappingURL=MDModern.js.map