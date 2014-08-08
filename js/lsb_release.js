/**
 * Simple module to extract lsb_release info
 * and display it in html.
 * 
 * Reads /etc/lsb-release
 * 
 * Supported lsb_release values are mapped to CSS classes:
 * DISTRIB_ID          => .lsb_distrib_id
 * DISTRIB_RELEASE     => .lsb_distrib_release
 * DISTRIB_CODENAME    => .lsb_distrib_codename
 * DISTRIB_DESCRIPTION => .lsb_distrib_description
 * 
 * @author  Philipp Miller
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 * 
 */
(function($){
  
  "use strict";
  
  var lsbObjects = [
    {key: "DISTRIB_ID"},
    {key: "DISTRIB_RELEASE"},
    {key: "DISTRIB_CODENAME"},
    {key: "DISTRIB_DESCRIPTION"},
  ];
  
  lsbObjects.map(function(lsbObj) {
    lsbObj.elems = $(".lsb_" + lsbObj.key.toLowerCase());
  });
  
  // init only if we need to
  var i,l;
  for (i=0, l=lsbObjects.length ; i<l ; i++) {
    if (lsbObjects[i].elems.length) {
      config.require("file:///etc/lsb-release", parser, init);
      break;
    }
  }
  
  /// Functions
  
  function init(cfg) {
    if (debug) debug.log(debug.formatString(cfg));
    
    lsbObjects.map(function(lsbObj) {
      if (cfg.hasOwnProperty(lsbObj.key)) {
        lsbObj.elems.html(
          lsbObj.val = cfg[lsbObj.key]
        );
      }
    });
  }
  
  function parser(text) {
    var props = {};
    text.split("\n").forEach(
      function(line) {
        if (line) {
          var keyVal = line.split("=");
          props[keyVal[0]] = keyVal[1].replace(/"/g, "");
        }
      }
    );
    return props;
  }
  
})(jQuery);