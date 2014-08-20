/**
 * Simple image slideshow with crossfading.
 * Uses two html div elements with css background-image.
 * See settings below
 * 
 * Public api:
 * next    skip ahead to next image
 * prev    previous image
 * start   restart interval
 * stop    halt interval
 * shuffle re-shuffle images
 * 
 * @author  Philipp Miller
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 * 
 * 
 */
(function($) {
  
  "use strict";
  
  var slideshow = {};
  
  var defaultSettings = {
        interval_seconds: 10,
        fade_seconds:     2,
        shuffle:          true,
        show_controlls:   true,
        show_filename:    true,
      },
      settings,
      elems      = [ $("#bg0"), $("#bg1") ],
      topElem    = 0,
      loader     = new Image(),
      sources,
      currentId,
      intervalId;
  
  // export interface
  window.slideshow = slideshow;
  
  // pass sources from config file to init
  $(loader).on("load", showCurrent);
  config.require("slideshow.conf", init);
  
  
  /// functions ///
  
  function init(cfg) {
    settings = $.extend(defaultSettings, cfg);
    sources  = settings.backgrounds;
    
    if (debug) debug.log("Starting slideshow with " + sources.length + " images");
    
    // 1 image shortcut
    if (sources.length == 1) {
      setImage(0);
      $("#slideshowControls").hide();
      return;
    }
    
    // config
    if (settings.shuffle) {
      slideshow.shuffle();
    }
    if (settings.show_filename) {
      elems[0].filenameElem = $(".filename", elems[0]);
      elems[1].filenameElem = $(".filename", elems[1]);
    }
    
    setImage(0);
    slideshow.start();
    
    // control buttons listeners
    if (settings.show_controlls) {
      $("#cycleBg").click(slideshow.next);
      $("#cycleBgBack").click(slideshow.prev);
      $("#shuffleSlideshow").click(slideshow.shuffle);
      $("#cycleToggle").click(function() {
        if (intervalId === false) {
          slideshow.start();
          $(this).children()
            .removeClass("fa-play")
            .addClass("fa-pause");
        } else {
          slideshow.stop();
          $(this).children()
            .removeClass("fa-pause")
            .addClass("fa-play");
        }
      });
    }
    else {
      $("#slideshowControls").hide();
    }
  }
  
  /**
   * Start loading specified image
   * The image will be displayed by showCurrent()
   * once it has finished loading
   * 
   * @param {int} id
   */
  function setImage(id) {
    currentId  = id;
    loader.src = sources[currentId];
  }
  
  /**
   * Makes an image visible on screen.
   */
  function showCurrent() {
    topElem = +!topElem;
    
    elems[topElem]
      .hide()
      .css({"z-index": 1, "background-image": 'url("' + sources[currentId] + '")'});
    
    elems[+!topElem]
      .css({"z-index": 0});
    
    elems[topElem]
      .fadeIn(settings.fade_seconds * 1000);
    
    if (settings.show_filename)
      elems[topElem].filenameElem.text(sources[currentId]);
    
    if (debug)
      debug.log(sources[currentId]);
  }
  
  /**
   * skip ahead to next image
   * 
   * @return {slideshow} chaining
   */
  slideshow.next = function() {
    setImage((currentId + 1) % sources.length);
    return slideshow;
  };
  
  /**
   * previous image
   * 
   * @return {slideshow} chaining
   */
  slideshow.prev = function() {
    setImage((currentId+sources.length-1) % sources.length);
    return slideshow;
  };
  
  /**
   * restart interval
   * 
   * @return {slideshow} chaining
   */
  slideshow.start = function() {
    intervalId = window.setInterval(
      slideshow.next,
      settings.interval_seconds * 1000
    );
    return slideshow;
  };
  
  /**
   * halt interval
   * 
   * @return {slideshow} chaining
   */
  slideshow.stop = function() {
    window.clearInterval(intervalId);
    intervalId = false;
    return slideshow;
  };
  
  /**
   * re-shuffle images
   * 
   * @return {slideshow} chaining
   */
  slideshow.shuffle = function() {
    sources = _.shuffle(sources);
    return slideshow;
  };
  
})(jQuery);
