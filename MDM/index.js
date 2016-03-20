/*! MDM.js by Philipp Miller */

/**
 * MDM backend abstraction layer
 * 
 * This library provides a consistent API based on events and Promises
 * to communicate with MDM's backend.
 * It tries to ensure synchronous execution of API calls.
 * 
 * @author  Philipp Miller
 * @url     https://github.com/philer/MDModern
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 * 
 */

// publish events API
export {addEventListener, on, removeEventListener, off, once, one} from './events.js';

// publish login manager API
export * from './loginManager.js';

// publish power API
export * from './power.js';

// publish non-error messages API
export * from './messages.js';


/**
 * Setup of "ready" event
 * 
 * We fire an event once we're sure MDM is (mostly) done with its setup.
 * Use this event to start for things like start-up animations.
 */
import {once, trigger} from './events.js';
once("prompt", () => trigger("ready"));
