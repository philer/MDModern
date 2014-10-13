/**
 * Language selection module
 * 
 * @author  Philipp Miller
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 * 
 */
(function($){
  
  "use strict";
  
  var languageElem = $("#language"),
      languagesUl  = $("#languages"),
      selectedLanguage;
  
  mdm.on("languageAdded", addLanguage)
     .on("languageSelected", selectLanguage);
  
  /// FUNCTIONS ///
  
  /**
   * Add a selectable language to the list
   * 
   * @param {event}      evt      optional mdm event
   * @param {language}   language language object
   * @return {publicAPI}          chainable
   */
  function addLanguage(evt, language) {
    language.li = $(document.createElement("li"))
      .append(
        $(
          '<a><span class="code">'
        + language.countryCode()
        + '</span><span class="name">'
        + language.name
        + '</span></a>'
        )
        .click(language.select.bind(language))
      );
    
    languagesUl.append(language.li);
    
    // show first language by default
    if (!selectedLanguage) {
      selectedLanguage = language;
    }
  }
  
  /**
   * Update GUI for selected language
   * 
   * @param  {event}     evt       optional mdm event
   * @param  {language}  language  language object
   * @return {publicAPI}           chainable
   */
  function selectLanguage(evt, language) {
    selectedLanguage.li.removeClass("selected");
    languageElem.html(language.shortCode());
    language.li.addClass("selected");
    selectedLanguage = language;
    
  }
  
})(jQuery);
