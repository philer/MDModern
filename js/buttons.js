/**
 * System power state buttons for MDModern theme.
 * All buttons use the backend's confirmation free commands.
 * 
 * @author  Philipp Miller
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 * 
 */

import './mdm.js';
import $ from 'jQuery';

["shutdown", "restart", "suspend", "quit"].forEach(function(name) {
  
  var $btn = $("#" + name);
  
  if ($btn.length) {
    
    mdm.on(name + "Hidden", function() { $btn.hide(); });
    
    $btn.find("a").click(mdm[name]);
    
  }
  
});
