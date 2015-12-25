/**
 * Automatic countdown visualization module for MDModern theme
 * 
 * globals: jQuery mdm
 * 
 * @author  Philipp Miller
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 * 
 */
(function(mdm, $) {
  
  "use strict";
  
  var $countdown    = $("#countdown")
    , $countdownBar = $("#countdown-bar")
    , countdownMax  = -1
    ;
  
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
  
})(mdm, jQuery);
