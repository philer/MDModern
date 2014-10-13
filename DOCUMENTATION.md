MDModern function reference
==========================
A short summary of all available module functions. Please also refer to comments
in the source code to see what the individual functions do.

Global objects are `mdm`, `config`, `slideshow`, and `debug` (only when grunt is called without the `dist` action).

The `lsb_release` and `slideshow` modules don't have an interface and are therefore not accessible in the global namespace.

### `mdm` Functions:
Use the following functions to send data to MDM:
```JavaScript
mdm.on(...)                           // see jQuery on (example below)
mdm.one(...)                          // see jQuery one (example below)
mdm.login(String|User user, String password[, Session session[, Language language]]) // wrapper function
mdm.getUser(String username)          // returns existing User or null
mdm.selectUser(String|User user)      // send login user
mdm.sendPassword(String password)     // send login password
mdm.getSession(String session_file)   // returns existing Session or null
mdm.selectSession(Session session)    // set login session
mdm.getLanguage(String language_file) // returns existing Language or null
mdm.selectLanguage(Language language) // set login language
mdm.shutdown()                        // shutdown immediately
mdm.restart()                         // reboot immediately
mdm.suspend()                         // suspend immediately
mdm.quit()                            // quit MDM (restarts the greeter)
```
### `mdm` Events:
MDM calls several global functions to add data to the theme's interface.
The `mdm` module provides an event based wrapper for these functions.
Attach event listeners right to the `mdm` object using `on` or `one`
(see jQuery's documentation).

Those events adding or selecting a user, session or language will include an
object of a respective type that offers the relevant data and some useful methods.
```JavaScript
// Event Name       // Event Data (sent by MDM)
"enabled"
"disabled"
"usernamePrompt"
"passwordPrompt"
"userAdded"         User user
"userSelected"      User user
"sessionAdded"      Session session
"sessionSelected"   Session session
"languageAdded"     Language language
"languageSelected"  Language language
"error"             String message
"message"           String message
"timedMessage"      String message
"welcomeMessage"    String message
"clockUpdate"       String time
"quitHidden"
"restartHidden"
"shutdownHidden"
"suspendHidden"
"xdmcpHidden"

// "loginCountdown" event will try to provide the remaining seconds
// as an integer based on "timedMessage" content.
"loginCountdown"    Integer seconds


// Examples
mdm.on("clockUpdate", function(message) {
  $("#clock").text(time);
});
mdm.on("languageAdded", function(language) {
  $("ul#languages").append("<li>" + language.name + "</li>");
  language.select(); // activate this language for the upcoming session
});
```
### `config` Functions:
The config module allows loading any file that is AJAX accessible, parsing it
and calling a function with the aquired data. Uses caching to speed up repeated calls.
```JavaScript
config.require(String filename[, String|Function parser][, Function callback])

// Example
config.require("example.conf", "lines", function(lines) {
  for (line in lines) $("#example").append(line + "</ br>");
});
```
### `slideshow` Functions:
Pretty obvious.
```JavaScript
slideshow.next()
slideshow.prev()
slideshow.start()
slideshow.stop()
slideshow.shuffle()
```

### `debug` Functions:
Only available if the `debug` module is loaded (see Gruntfile.js).
```JavaScript
debug.log([mixed message])                                    // add log entry
debug.logElem([jQuery $elem[, Boolean replace]])              // append log $elem
debug.addLogFunction([Function callback[, Boolean replace]])  // add custom log function
debug.formatString(String string)                             // converts arrays and objects to strings
```
