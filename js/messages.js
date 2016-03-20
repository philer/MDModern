/**
 * Display MDM's messages and errors
 * 
 * @author  Philipp Miller
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 * 
 */

import {on} from '../MDM/index.js';
import $ from 'jQuery';

const $messages = $("#messages");

const logLevelIcons = {
  error:   "fa-exclamation", // "fa-warning",
  pending: "fa-spinner fa-spin",
};

let prepared = [];


/**
 * Initialize an upcoming message's element with a temporary message
 * and a loading animation
 * @param  {string} msg
 */
export function prepare(msg) {
  const $msg = showMessage(msg, "pending");
  prepared.push($msg);
}


// mdm.on("message",  showMessage);
on("error",  function(evt, msg) {
  if (!msg) return;
  
  const logLevel = evt.type || evt;
  
  if (prepared.length) {
    const icon = logLevel in logLevelIcons ? `<i class="fa fa-fw ${logLevelIcons[logLevel]}"></i>` : "";
    prepared.shift().html(icon + msg);
  } else {
    showMessage(msg, logLevel);
  }
  
});


/**
 * Display a regular message to the user
 * 
 * @param  {event}     evt  optional mdm event
 * @param  {string}    msg
 */
function showMessage(msg, logLevel) {
  const icon = logLevel in logLevelIcons ? `<i class="fa fa-fw ${logLevelIcons[logLevel]}"></i>` : "";
  const $msg = $(`<li class="message">${icon + msg}</li>`);
  
  $messages
    .append($msg.fadeIn())
    .animate({ scrollTop: $messages.height() }, 500)
    ;
  
  return $msg;
}


// function timeTag() {
//   var t = new Date();
//   return '<time datetime="'
//        + t.toISOString() + '">'
//        + t.getHours() + ':' + t.getMinutes() + ':' + t.getSeconds()
//        + '</time>';
// }
