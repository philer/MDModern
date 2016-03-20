/**
 * This file will fade out a screen-covering element to create a smooth
 * start-up effect.
 * 
 * @author Philipp Miller
 * 
 */

import win from 'window';
import $ from 'jQuery';
import {on, off} from '../MDM/index.js';


function uncover() {
  
  // there is a little delay before MDM's backend uncovers the screen.
  win.setTimeout(function() {
    
    const $cover = $("#fade-in-cover");
    
    // using css transition instead of $.fn.fadeOut
    $cover.addClass("ready");

    // delay for animation duration
    win.setTimeout(function() {
      $cover.remove();
    }, 1000);

    win.clearTimeout(id);
    off("ready", uncover);
    
  }, 1500);
  
}

on("ready", uncover);

// fallback timeout in case something breaks
const id = win.setTimeout(function() {
  console.log("MDM ready timeout");
  uncover();
}, 3000);
