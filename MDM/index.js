/**
 * MDM backend abstraction layer
 * 
 * This library provides a consistent API based on events and Promises
 * to communicate with MDM's backend.
 * It tries to ensure synchronous execution of API calls.
 * 
 * @author  Philipp Miller
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
import {on, off, trigger} from './events.js';

function triggerReady() {
  off("usernamePrompt", triggerReady);
  off("passwordPrompt", triggerReady);
  trigger("ready");
}

on("usernamePrompt", triggerReady);
on("passwordPrompt", triggerReady);
