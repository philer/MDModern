import {selectLanguage} from './loginManager.js';
/**
 * Represents a language.
 * 
 * @param {string} name
 * @param {string} code
 */
export default class Language {
  
  constructor(name, code) {
    
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
  
  /**
   * Tell MDM to use this language for upcoming login
   * @return {User} chainable
   */
  select() {
    selectLanguage(this);
    return this;
  }
  
  /**
   * country specific language code
   * 
   * @return {String} e.g. en_US
   */
  countryCode() {
    return this.code.split('.')[0];
  }
  
  /**
   * short language code
   * 
   * @return {String} e.g. en
   */
  shortCode() {
    return this.code.split('_')[0];
  }
  
  /**
   * Language encoding as specified by language code
   * 
   * @return {String} e.g. UTF-8
   */
  charset() {
    return this.code.split('.')[1];
  }
  
}
