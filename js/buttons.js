/**
 * System power state buttons for MDModern theme.
 * All buttons use the backend's confirmation free commands.
 * 
 * globals: jQuery mdm
 * 
 * @author  Philipp Miller
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 * 
 */
(function(mdm, $) {
  
  "use strict";
  
  ["shutdown", "restart", "suspend", "quit"].forEach(function(name) {
    
    var $btn = $("#" + name);
    
    if ($btn.length) {
      
      mdm.on(name + "Hidden", function() { $btn.hide(); });
      
      $btn.find("a").click(mdm[name]);
      
    }
    
  });
  
})(mdm, jQuery);
