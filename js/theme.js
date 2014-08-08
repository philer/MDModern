/**
 * Backend for a HTML5 MDM theme.
 * 
 * @author  Philipp Miller
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 * 
 */
(function($) {
  
  "use strict";
  
  var body           = $(document.body),
      loginbox       = $("#loginbox"),
      userlistToggle = $("#userlist-toggle", loginbox),
      usernameInput  = $("#username", loginbox),
      passwordInput  = $("#password", loginbox),
      faceElem       = $("#face", loginbox),
      usersUl        = $("#users", loginbox),
      users          = [],
      selectedUser,
      sessionElem    = $("#session"),
      sessionsUl     = $("#sessions"),
      sessions       = [],
      selectedSession,
      msgBox         = $("#msg");
  
  // custom debug logging
  if (debug) {
    debug.logElem($("#log"), true)
         .log('Theme init on "' + navigator.userAgent + '"');
  }
  
  // MDM listeners
  mdm.on("userAdded",       addUser)
     .on("userSelected",    selectUserByName)
     .on("sessionAdded",    addSession)
     .on("sessionSelected", selectSession)
     .on("usernamePrompt",  function() { usernameInput.select(); })
     .on("passwordPrompt",  function() { passwordInput.select(); })
     .on("shutdownHidden",  function() { $("#shutdown").hide(); })
     .on("restartHidden",   function() { $("#restart").hide(); })
     .on("suspendHidden",   function() { $("#suspend").hide(); })
     .on("quitHidden",      function() { $("#quit").hide(); })
     .on("error",           showMsg);
     // .on("error mdm.message mdm.timedMessage", showMsg);
  
  
  // DOM listeners
  
  // select user by typing in the input field
  usernameInput.on("propertychange input paste", function(evt) {
    selectUserByName(evt, $(this).val());
  });
  
  $("form", loginbox).submit(login);
  
  $("#shutdown a").click(mdm.shutdown);
  $("#restart a").click(mdm.restart);
  $("#suspend a").click(mdm.suspend);
  $("#quit a").click(mdm.quit);
  
  // hide errors and messages by clicking
  msgBox.click(function() { $(this).fadeOut(); });
  
  
  /// FUNCTIONS ///
  
  /**
   * Gather data and give it to mdm for login
   * 
   * @param  {event} evt  form submit event
   */
  function login(evt) {
    evt.preventDefault();
    mdm.login(usernameInput.val(), passwordInput.val(), selectedSession);
  }
  
  /**
   * Adds a user to the user list, including
   * image load and event listeners
   * @param  {event} evt   optional mdm event
   * @param  {user}  user  user object
   */
  function addUser(evt, user) {
    var li   = $(document.createElement("li")),
        a    = $(document.createElement("a")),
        icon = $(document.createElement("i")),
        img  = new Image();
    
    usersUl.append(
      li.append(
        a.append(icon.addClass("fa fa-user"))
         .append(user.name)
      )
    );
    
    if (user.loggedIn) {
      li.addClass("loggedIn");
    }
    
    a.click(function(evt) {
      selectUser(evt, user);
    });
    
    img.loaded = false;
    img.src = user.home + "/.face";
    $(img).one("load", function() {
      icon.remove();
      a.prepend(img);
      img.loaded = true;
    });
    
    user.li = li;
    user.img = img;
    users.push(user);
    if (users.length === 1) {
      userlistToggle.one("click", toggleUserlist);
    }
  }
  
  /**
   * Retrieve user object by username
   * @param  {string} username
   * @return {user}             user object
   */
  function getUser(username) {
    for (var i=0, l=users.length ; i<l ; ++i)
      if (users[i].name === username)
        return users[i];
    return {name: username};
    
  }
  
  /**
   * Set a user as selected for login
   * by passing a username
   * 
   * @param  {event} evt        optional mdm event
   * @param  {string} username
   */
  function selectUserByName(evt, username) {
    selectUser(evt, getUser(username));
  }
  
  /**
   * Set a user as selected for login
   * by passing a user object
   * 
   * @param  {event} evt        optional mdm or click event
   * @param  {string} username  user object
   */
  function selectUser(evt, user) {
    selectedUser = user;
    if (!$(evt.target).is(usernameInput)) usernameInput.val(user.name);
    users.forEach(function(usr) {
      if (usr.name == user.name)
        usr.li.addClass("selected");
      else usr.li.removeClass("selected");
    });
    updateFace(user);
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
    if (!usersUl.expanded) {
      body.click(toggleUserlist);
      evt.stopPropagation();
    }
    else {
      body.off("click", toggleUserlist);
      userlistToggle.one("click", toggleUserlist);
    }
    usersUl.toggleClass("expanded");
    usersUl.expanded = !usersUl.expanded;
  }
  
  /**
   * Sets the face image next to the loginbox
   * if the currently selected user has one.
   * The relevant file is
   * /home/{username}/.face
   * 
   * @param  {user} user   user object
   */
  function updateFace(user) {
    loginbox.removeClass("hasface");
    if (mdm.userExists(user.name)) {
      if (user.img.loaded) {
        faceElem.attr("src", user.img.src);
        loginbox.addClass("hasface");
      } else
        $(user.img).one("load", function() {
          if (user == selectedUser)
          faceElem.attr("src", user.img.src);
          loginbox.addClass("hasface");
        });
    }
  }
  
  /**
   * Add a selectable session to the list
   * @param {event}   evt     optional mdm event
   * @param {session} session session object
   * @return {publicAPI}   chainable
   */
  function addSession(evt, session) {
    var a = $(document.createElement("a"))
      .html(session.name);
    
    session.li = $(document.createElement("li"))
      .append(a);
    
    sessionsUl.append(session.li);
    sessions.push(session);
    
    a.click(function() {
      selectSession(null, session);
    });
  }
  

  /**
   * Set a session as selected for login
   * @param  {event}  evt       optional mdm event
   * @param  {session} session  session object
   * @return {publicAPI}        chainable
   */
  function selectSession(evt, session) {
    selectedSession = session;
    
    sessionElem.html(session.name);
    sessions.forEach(function(sess) {
      if (sess.name === session.name)
        sess.li.addClass("selected");
      else sess.li.removeClass("selected");
    });
  }
  
  /**
   * Display a regular message to the user
   * @param  {event}     evt  optional mdm event
   * @param  {string}    msg
   */
  function showMsg(evt, msg) {
    if (!msg) return;
    if (evt.namespace == "error") msgBox.addClass("error");
    else msgBox.removeClass("error");
    
    msgBox
      .html(msg)
      .fadeIn();
  }
  
})(jQuery);
