/**
 * (Re-)defines MDM's expected global functions
 * so they will add a log entry.
 * If the functions already exist they will be wrapped and still function as before.
 * 
 * globals:
 *   HtmlConsole
 *   mdm_enable
 *   mdm_disable
 *   mdm_prompt
 *   mdm_noecho
 *   mdm_add_user
 *   mdm_add_session
 *   mdm_add_language
 *   mdm_set_current_user
 *   mdm_set_current_session
 *   mdm_set_current_language
 *   mdm_error
 *   mdm_msg
 *   mdm_timed
 *   set_welcome_message
 *   set_clock
 *   mdm_hide_shutdown
 *   mdm_hide_restart
 *   mdm_hide_suspend
 *   mdm_hide_quit
 *   mdm_hide_xdmcp
 * 
 * @author  Philipp Miller
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 */
(function(win, cnsl) {
  
  "use strict";
  
  [
    
    "mdm_enable",
    "mdm_disable",
    "mdm_prompt",
    "mdm_noecho",
    "mdm_add_user",
    "mdm_add_session",
    "mdm_add_language",
    "mdm_set_current_user",
    "mdm_set_current_session",
    "mdm_set_current_language",
    "mdm_error",
    "mdm_msg",
    "mdm_timed",
    "set_welcome_message",
    "set_clock",
    "mdm_hide_shutdown",
    "mdm_hide_restart",
    "mdm_hide_suspend",
    "mdm_hide_quit",
    "mdm_hide_xdmcp",
  
  ].map(function(name) {
  
    var original = win[name];
    
    win[name] = function() {
    
      var args = [].slice.apply(arguments);
      cnsl.log("MDM called '" + name + "(" + args.join(',') + ")'", "input");
    
      if (typeof original === "function") {
        try {
          original.apply(win, args);
        } catch (e) {
          cnsl.error(e);
        }
        
      }
    };
  
  });
  
  // var real_alert = win.alert;
  // win.alert = function(msg) {
  //   cnsl.log("» 'alert(" + msg + ")'");
  //   real_alert(msg);
  // }
  
})(window, HtmlConsole);