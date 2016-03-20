import {selectUser} from './loginManager.js';

/**
* Represents a user.
* 
* @param {string} username
* @param {string} gecos     full name etc.
* @param {string} status    online?
*/
export default class User {
  
  constructor(username, gecos, loggedIn, facefile) {
    
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
  
  /**
   * Tell MDM to use this user for upcoming login
   * @return {User} chainable
   */
  select() {
    selectUser(this);
    return this;
  }
  
}
