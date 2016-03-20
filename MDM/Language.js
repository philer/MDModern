import {selectLanguage} from './loginManager.js';
/**
 * Represents a language.
 * 
 * @param {string} name
 * @param {string} code
 */
export default function Language(name, code) {
  
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
  select: function() {
    selectLanguage(this);
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
