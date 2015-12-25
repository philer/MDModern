MDModern function reference
==========================
A short summary of all available module functions. Please also refer to comments
in the source code to see what the individual functions do.

Global objects are `mdm`, `config` and `slideshow`.

The other modules don't have an interface and are therefore not accessible in the global namespace.

### `mdm` Functions:
Use the following functions to send data to MDM:
```JavaScript
mdm.on(...)                           // see jQuery on (example below)
mdm.one(...)                          // see jQuery one (example below)
mdm.login(string|User user, string password) // shortcut function (single-step login)
mdm.selectUser(string|User user)      // send login user
mdm.sendPassword(string password)     // send login password
mdm.getUser(string username)          // returns existing User or null
mdm.getSession(string session_file)   // returns existing Session or null
mdm.selectSession(Session session)    // set login session
mdm.getLanguage(string language_file) // returns existing Language or null
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
// Event Name         // Event Data (sent by MDM)
"enabled"
"disabled"
"usernamePrompt"
"passwordPrompt"
"prompt"              // on usernamePrompt or passwordPrompt
"locked"              // no login attempts will be made after mdm is locked
"unlocked"            // login attempt will be accepted
"userAdded"        User user
"userSelected"     User user
"sessionAdded"     Session session
"sessionSelected"  Session session
"languageAdded"    Language language
"languageSelected" Language language
"error"            string message
"message"          string message
"timedMessage"     string message
"welcomeMessage"   string message
"clockUpdate"      string time
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
and calling a function with the aquired data. It uses [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise). It can use localStorage for caching, although MDM's webkit backend doesn't seem to retain the data.
```JavaScript
config.require(string filename[, string|Function parser][, boolean useStorage])

// Example
config.require("example.conf", "lines").then(function(lines) {
  for (line in lines) $("#example").append(line + "</ br>");
}).catch(function() {
  console.log("Something went wrong.");
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

### Debugging:
MDModern uses [MDMConsole](https://github.com/philer/MDMConsole) for debugging purposes. It is only available when MDModern's `min/` files are built using `grunt dev` (or `grunt watch`).
