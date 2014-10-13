/**
 * Session selection module
 * 
 * @author  Philipp Miller
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 * 
 */
(function($) {
  
  "use strict";
  
  var sessionElem    = $("#session"),
      sessionsUl     = $("#sessions"),
      selectedSession;
  
  // MDM listeners
  mdm.on("sessionAdded",    addSession)
     .on("sessionSelected", selectSession);
  
  /// FUNCTIONS ///
  
  /**
   * Add a selectable session to the list
   * 
   * @param {event}   evt     optional mdm event
   * @param {Session} session session object
   * @return {publicAPI}      chainable
   */
  function addSession(evt, session) {
    session.li = $(document.createElement("li"))
      .append(
        $("<a>" + session.name + "</a>")
          .click(session.select.bind(session))
      );
    
    sessionsUl.append(session.li);
    
    if (!selectedSession) {
      selectedSession = session;
    }
  }
  
  /**
   * Update GUI for selected session
   * 
   * @param  {event}  evt       optional mdm event
   * @param  {Session} session  session object
   * @return {publicAPI}        chainable
   */
  function selectSession(evt, session) {
    selectedSession.li.removeClass("selected");
    sessionElem.html(session.name);
    session.li.addClass("selected");
    selectedSession = session;
  }
  
})(jQuery);
