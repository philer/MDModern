/**
 * Backend for a HTML5 MDM theme. This file only contains key elements
 * that are not handled by other modules.
 * Currently: Error feedback, login count down, quit buttons
 * 
 * globals: jQuery mdm
 * 
 * @author  Philipp Miller
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 * 
 */
(function(mdm, $) {
  
  "use strict";
  
  var $countdown = $("#countdown")
    , $msgBox    = $("#msg")
    ;
  
  /// MDM listeners ///
  
  mdm.on("error",          showMsg)
     .on("loginCountdown", updateCountdown)
     .on("shutdownHidden", function() { $("#shutdown").hide(); })
     .on("restartHidden",  function() { $("#restart").hide(); })
     .on("suspendHidden",  function() { $("#suspend").hide(); })
     .on("quitHidden",     function() { $("#quit").hide(); })
     ;
  
  /// DOM listeners ///
  
  // hide errors and messages by clicking
  $msgBox.click(function() { $(this).fadeOut(); });
  
  $("#shutdown a").click(mdm.shutdown);
  $("#restart a").click(mdm.restart);
  $("#suspend a").click(mdm.suspend);
  $("#quit a").click(mdm.quit);
  
  
  /// FUNCTIONS ///
  
  /**
   * Make countdown times visible and set time
   * @param  {event} evt   optional
   * @param  {int}   time  time remaining until automatic login
   */
  function updateCountdown(evt, time) {
    $countdown.text(time);
  }
  
  /**
   * Display a regular message to the user
   * @param  {event}     evt  optional mdm event
   * @param  {string}    msg
   */
  function showMsg(evt, msg) {
    if (!msg) return;
    
    if (evt.namespace == "error") {
      $msgBox.addClass("error");
    } else {
      $msgBox.removeClass("error");
    }
    
    $msgBox
      .html(msg)
      .fadeIn()
      ;
  }
  
})(mdm, jQuery);
