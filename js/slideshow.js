/**
 * Simple image slideshow with crossfading.
 * Uses two html div elements with css background-image.
 * See settings below
 * 
 * Public api: slideshow
 *   .init(cfg)     (re-)initialize slideshow with given configuration
 *   .next()        skip ahead to next image
 *   .prev()        previous image
 *   .start()       restart interval
 *   .stop()        halt interval
 *   .shuffle()     re-shuffle images
 *   .setImage(src) show the image specified by src (a URL string)
 *   .openCurrent() open tab/window with the currently showing image
 * 
 * globals: slideshow AnySearch config
 * 
 * @author  Philipp Miller
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 * 
 * 
 */

import $ from 'jQuery';
import win from 'window';
import doc from 'document';
import console from 'console';

import * as config from './config.js';

/// Init ///

const template =
        '<div class="slideshow-layer"><span class="slideshow-filename"></span></div>'
      + '<div class="slideshow-layer"><span class="slideshow-filename"></span></div>'
      + '<span class="slideshow-controls">'
      +   '<a class="slideshow-prev"><i class="fa fa-chevron-left"></i></a>'
      +   '<a class="slideshow-toggle"><i class="fa fa-play"></i></a>'
      // +   '<a class="slideshow-shuffle"><i class="fa fa-random"></i></a>'
      +   '<a class="slideshow-next"><i class="fa fa-chevron-right"></i></a>'
      + '</span>'
      ;
  
const defaultSettings = {
      interval_seconds: 10,
      fade_seconds:     2,
      shuffle:          true,
      show_controls:    true,
      show_filename:    false,
      grid:             null,
      fill_style:       null,
      background_style: '#222',
    };

function init(cfg) {
  
  var parents = doc.getElementsByClassName("slideshow");
  var parent = parents.length ? parents[0] : doc.body;
  
  if (!cfg.grid || cfg.grid === "1x1" || !/^\d+x\d+$/.test(cfg.grid)) {
    console.log("initializing slideshow");
    
    win.slideshow = new Slideshow(parent, cfg);
    
  }
  
  else {
    console.log("initializing slideshow grid " + cfg.grid);
    
    win.slideshow = new Grid(parent, cfg);
    
  }
}



/// Models ///

/**
 * Initialize slideshow with given settings
 * 
 * @param  {object} cfg settings
 */
function Slideshow(parent, cfg) {
  this.parent = parent;
  this.parent.insertAdjacentHTML('afterbegin', template);
  
  // initialize layers
  var elems         = this.parent.getElementsByClassName("slideshow-layer")
    , filenameElems = this.parent.getElementsByClassName("slideshow-filename")
    ;
  this.layers = [];
  for (var i = 0, len = elems.length ; i < len ; ++i) {
    this.layers[i] = new Layer(this, elems[i], filenameElems[i]);
  }
  this.currentLayer = 0;
  
  // loader
  this.loader = new Image();
  this.loader.addEventListener("load", this._showCurrent.bind(this));
  
  // controls
  this.ctrlsElem = this.parent.getElementsByClassName("slideshow-controls")[0];
  
  // init config after relevant DOM elements are initialized
  if (cfg) {
    this.init(cfg);
  }
  
  // buttons & additional listeners
  this._btn("next");
  this._btn("prev");
  // this._btn("shuffle");
  this._btn("toggle");
}

Slideshow.prototype = {
  
  init: function(cfg) {
    this.cfg = cfg = $.extend(defaultSettings, cfg);
    this.sources = cfg.backgrounds.slice(0);
    this.currentId = 0;
    
    // already running, new config
    if (this.intervalId) {
      this.stop();
    }
    
    // 1 image shortcut
    if (this.sources.length === 1) {
      this.setImage(this.sources[0]);
      this.ctrlsElem.style.display = "none";
      return;
    }
    
    if (cfg.shuffle) {
      this.shuffle();
    }
    
    this
      .setImage(this.sources[0])
      .start()
      ;
    
    if (cfg.show_controls) {
      this.ctrlsElem.style.display = null;
    }
    else {
      this.ctrlsElem.style.display = "none";
    }
    return this;
  },
  
  /**
   * Adds control button listener
   * @param  {string} action
   * @return {this}   chaining
   */
  _btn: function(action) {
    var btn = this.ctrlsElem.getElementsByClassName("slideshow-" + action);
    if (btn.length) {
      btn[0].addEventListener("click", this[action].bind(this));
      return btn[0];
    }
  },
  
  /**
   * Start loading specified image
   * The image will be displayed by _showCurrent()
   * once it has finished loading
   * 
   * @param {string} src
   */
  setImage: function(src) {
    this.loader.src = src;
    return this;
  },
  
  /**
   * Makes an image visible on screen.
   */
  _showCurrent: function() {
    this.layers[this.currentLayer].hide();
    this.currentLayer = (this.currentLayer + 1) % this.layers.length;
    this.layers[this.currentLayer].show(this.loader);
    return this;
  },
  
  /**
   * skip ahead to next image
   * 
   * @return {slideshow} chaining
   */
  next: function(evt) {
    if (!evt || !evt.defaultPrevented && !evt.preventDefault()) {
      this.currentId = (this.currentId + 1) % this.sources.length;
      this.setImage(this.sources[this.currentId]);
    }
    return this;
  },
  
  /**
   * previous image
   * 
   * @return {slideshow} chaining
   */
  prev: function(evt) {
    if (!evt || !evt.defaultPrevented && !evt.preventDefault()) {
      this.currentId = (this.currentId + this.sources.length - 1) % this.sources.length;
      this.setImage(this.sources[this.currentId]);
    }
    return this;
  },
  
  /**
   * (re)start interval
   * 
   * @return {slideshow} chaining
   */
  start: function(evt) {
    if (!evt || !evt.defaultPrevented && !evt.preventDefault()) {
      if (!this.intervalId) {
        this.intervalId = win.setInterval(
          this.next.bind(this),
          this.cfg.interval_seconds * 1000
        );
        this.ctrlsElem.classList.add("slideshow-running");
      }
    }
    return this;
  },
  
  /**
   * halt interval
   * 
   * @return {slideshow} chaining
   */
  stop: function(evt) {
    if (!evt || !evt.defaultPrevented && !evt.preventDefault()) {
      if (this.intervalId) {
        win.clearInterval(this.intervalId);
        this.intervalId = false;
        this.ctrlsElem.classList.remove("slideshow-running");
      }
    }
    return this;
  },
  
  /**
   * toggle slideshow running state (start|stop)
   * 
   * @return {slideshow} chaining
   */
  toggle: function(evt) {
    return this.intervalId ? this.stop(evt) : this.start(evt);
  },
  
  /**
   * shuffle image sources
   * 
   * @return {slideshow} chaining
   */
  shuffle: function() {
    // sources = _.shuffle(sources);
    var sources = this.sources
      , i = sources.length
      , tmp
      , j
      ;
    while(i--) {
      j = Math.floor(Math.random() * i);
      tmp = sources[i];
      sources[i] = sources[j];
      sources[j] = tmp;
    }
    return this;
  },
  
  openCurrent: function() {
    win.open(this.sources[this.currentId]);
  },
  
};


/**
 * Layers are used by a slideshow to do fading effects.
 * At least 2 layers are needed per slideshow
 */
function Layer(slideshow, elem, filenameElem) {
  this.ss           = slideshow;
  this.elem         = elem;
  this.elemStyle    = elem.style;
  this.filenameElem = filenameElem;
}

Layer.prototype = {
  
  show: function(img) {
    var fillStyle = this.ss.cfg.fill_style
      ? this.ss.cfg.fill_style
      : "50% 50% / " + this._getCssSizing(img) + " no-repeat";
    
    this.elemStyle.background =
          
          // primary background (loaded image)
          'url("' + img.src + '") ' + fillStyle
          
          // secondary background in case primary does not cover
          + "," + this.ss.cfg.background_style;
    
    // new image: make visible, put on top after fading
    this.elemStyle.transition = "z-index 0s " + this.ss.cfg.fade_seconds + "s";
    this.elemStyle.zIndex     = 1;
    this.elemStyle.opacity    = 1;
    this.elemStyle.visibility = "visible";
    
    if (this.ss.cfg.show_filename) {
      this.filenameElem.innerHTML = img.src;
    }
    return this;
  },
  
  hide: function() {
    var s = this.ss.cfg.fade_seconds;
    
    // old image: put below and hide after fading
    this.elemStyle.transition = "opacity "+s+"s,z-index 0s "+s+"s,visibility 0s "+s+"s";
    this.elemStyle.zIndex     = 0;
    this.elemStyle.opacity    = 0;
    this.elemStyle.visibility = "hidden";
    return this;
  },
  
  /**
   * Tries to find an appropriate css background-size
   * 
   * @param  {Image}  img
   * @return {string}
   */
  _getCssSizing: function(img) {
    // return "cover";
    var rect = this.elem.getBoundingClientRect()
      , eh = rect.bottom - rect.top
      , ew = rect.right  - rect.left
      , ih = img.naturalHeight
      , iw = img.naturalWidth
      , ratioDelta = Math.abs(eh/ew - ih/iw)
      ;
    
    // very small
    if (ih < 0.6*eh && iw < 0.6*ew) {
      return "auto";
    }
    
    // very large, roughly same ratio
    if (ih >= eh && iw >= ew) {
      return "cover";
    }
    
    // small-ish or extreme ratio difference
    if ( ih < 0.7* eh || iw < 0.7*ew
      || Math.abs(eh/ew - ih/iw) > 0.5
    ) {
      return "contain";
    }
    
    // large
    return "cover";
  },
  
};

/**
 * Grid for multiple slideshows at the same time
 */
function Grid(parent, cfg) {
  var rowsAndCols = cfg.grid.split("x")
    , rows = rowsAndCols[0]
    , cols = rowsAndCols[1]
    , cell
    ;
  
  this.slideshows = [];
  
  for (var row = 0 ; row < rows ; ++row) {
    for (var col = 0 ; col < cols ; ++col) {
      
      cell = doc.createElement("div");
      cell.style.position = "absolute";
      cell.style.left   = col/cols*100 + "%";
      cell.style.top    = row/rows*100 + "%";
      cell.style.width  = 1/cols*100 + "%";
      cell.style.height = 1/rows*100 + "%";
      
      parent.appendChild(cell);
      
      this.slideshows.push(
        new Slideshow(cell, $.extend(cfg, {
          
          // randomize interval_seconds in interval [ 2.5 , 2*is - 2.5 ]
          // and round to 4 digits
          interval_seconds: Math.round(
            (
              2.5 + Math.random()
              * (2 * (cfg.interval_seconds || defaultSettings.interval_seconds) - 5)
            )
            * 1000) / 1000,
        }))
      );
    }
  }
}

Grid.prototype = {};

// add public Slideshow interface to Grid
Object.getOwnPropertyNames(Slideshow.prototype).forEach(function(prop) {
  if (prop[0] !== '_') {
    Grid.prototype[prop] = function() {
      for (var i = 0, len = this.slideshows.length ; i < len ; ++i) {
        this.slideshows[i][prop]();
      }
      return this;
    };
  }
});

config.require("slideshow.conf", false).then(init)
  .catch(function(){
    console.log("failed to initialize slideshow");
  });
