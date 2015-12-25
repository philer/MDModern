/**
 * Display MDM's messages and errors
 * 
 * globals: jQuery mdm
 * 
 * @author  Philipp Miller
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 * 
 */
(function(mdm, $) {
  
  "use strict";
  
  var $messages     = $("#messages");
  
  /// MDM listeners ///
  
  mdm.on("message error",  showMessage);
  
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
    
    var t = new Date();
    
    var $msg = $(
        '<li class="message"><time datetime="'
      + t.toISOString() + '">'
      + t.getHours() + ':' + t.getMinutes() + ':' + t.getSeconds()
      + '</time>' + msg + '</li>'
      );
    
    if (evt.namespace === "error") {
      $msg.addClass("error");
    }
    
    $messages
      .append($msg)
      .animate({ scrollTop: $messages.height() }, 500)
      ;
  }
  
})(mdm, jQuery);
