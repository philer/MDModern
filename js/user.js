/**
 * Represents a user.
 * 
 * @param {string} username
 * @param {string} gecos     full name etc.
 * @param {string} status    online?
 * 
 * @author  Philipp Miller
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 * 
 */
function User(username, gecos, loggedIn) {
  
  "use strict";
  
  var _this = this;
  
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
   * @type {string}
   */
  this.loggedIn = loggedIn;
  
  /**
   * User's home directory
   * Set to /home/{username} by default
   * and then updated using passwd if available
   * 
   * @type {String}
   */
  this.home = "file:///home/" + username;
  
  
  /**
   * Fetch user's actual home directory from /etc/passwd.
   * Currently not used since it requires theme.js to reset
   * the $home/.face sources on load, which is a pain.
   * Might improve this later by having the User instance take care
   * of .face by itself.
   */
  // this.home = "";
  // config.require("theme.conf", function(cfg) {
  //   if (cfg.use_passwd) {
  //     config.require("file:///etc/passwd", "lines", function(passwd) {
  //       var userInfo = _.find(passwd, function(line) {
  //           return -1 != line.search(new RegExp("^" + username));
  //         });
        
  //       if (userInfo) {
  //         if (debug) debug.log('Got "' + userInfo + '" from /etc/passwd');
  //         // passwd line fields:
  //         // username:password:uid:gid:gecos:home_dir:shell
  //         userInfo = userInfo.split(":");
          
  //         _this.home = "file://" + userInfo[5];
  //       }
  //     });
  //   }
  // });
}

/**
 * Simple string representation: username
 * @return {string}
 */
User.prototype.toString = function() {
  return this.name;
};

