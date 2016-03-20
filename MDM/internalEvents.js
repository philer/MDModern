/**
 * Simplified event listeners setup.
 * - only one listener per event
 * - listeners are only executed once
 */

import {trigger as publicTrigger} from './events.js';


const listeners = Object.create(null);


export function once(evt, fn) {
  listeners[evt] = fn;
}


export function off(evt) {
  delete listeners[evt];
}


/**
 * Trigger the listener if it exists. If it doesn't exist or returns true
 * on execution the event is triggered publicly.
 * 
 * @param  {String}    evt  event name
 * @param  {...mixed} args  array of arguments
 */
export function trigger(evt, ...args) {
  if (evt in listeners) {
    const listener = listeners[evt];
    off(evt);
    if (!listener(evt, ...args)) {
      return;
    }
  }
  publicTrigger(evt, ...args);
}
