/**
 * Automatic countdown visualization module for MDModern theme
 * 
 * @author  Philipp Miller
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 * 
 */

import * as mdm from '../MDM/index.js';
import $ from 'jQuery';

const $countdown    = $("#countdown");
const $countdownBar = $("#countdown-bar");
let countdownMax  = -1;

/// MDM listeners ///

if ($countdown.length) {
  mdm.on("loginCountdown", updateCountdown);
}

if ($countdownBar.length) {
  mdm.on("loginCountdown", updateCountdownBar);
}

/// FUNCTIONS ///

/**
 * Make countdown times visible and set time using text-based element
 * 
 * @param  {event} evt   optional
 * @param  {int}   time  time remaining until automatic login
 */
function updateCountdown(evt, time) {
  $countdown.text(time);
}

/**
 * Make countdown times visible using progress bar
 * 
 * @param  {event} evt   optional
 * @param  {int}   time  time remaining until automatic login
 */
function updateCountdownBar(evt, time) {
  if (time > countdownMax) {
    countdownMax = time;
    $countdownBar.addClass('running');
  }
  $countdownBar.css({ width: (100 * time/countdownMax) + "%" });
}
