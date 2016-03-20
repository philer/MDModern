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

/// MDM listeners ///

// mdm.on("message",  showMessage);
on("error",  showMessage);

/// DOM listeners ///

// // hide errors and messages by clicking
// $msgBox.click(function() { $(this).fadeOut(); });

/// FUNCTIONS ///

/**
 * Display a regular message to the user
 * 
 * @param  {event}     evt  optional mdm event
 * @param  {string}    msg
 */
function showMessage(evt, msg) {
  if (!msg) return;
  
  const $msg = $(
      '<li class="message">'
    // + timeTag()
    + msg
    + '</li>'
    );
  
  // if (evt.type === "error") {
  //   $msg.addClass("error");
  // }
  
  $messages
    .append($msg.fadeIn())
    .animate({ scrollTop: $messages.height() }, 500)
    ;
}

// function timeTag() {
//   var t = new Date();
//   return '<time datetime="'
//        + t.toISOString() + '">'
//        + t.getHours() + ':' + t.getMinutes() + ':' + t.getSeconds()
//        + '</time>';
// }
