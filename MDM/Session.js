import {selectSession} from './loginManager.js';

/**
 * Represents a session.
 * 
 * @param {string} name
 * @param {string} file
 */
export default function Session(name, file) {
  
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
  select: function() {
    selectSession(this);
    return this;
  },
  
};
