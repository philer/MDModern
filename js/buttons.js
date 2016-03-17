/**
 * System power state buttons for MDModern theme.
 * All buttons use the backend's confirmation free commands.
 * 
 * @author  Philipp Miller
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 * 
 */

import mdm from './mdm.js';
import $ from 'jQuery';

["shutdown", "restart", "suspend", "quit"].forEach(function(name) {
  
  const $btn = $("#" + name);
  
  if ($btn.length) {
    
    mdm.on(name + "Hidden", function() { $btn.hide(); });
    
    $btn.find("a").click(mdm[name]);
    
  }
  
});
