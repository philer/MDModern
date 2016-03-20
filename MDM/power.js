/**
 * Shutdown immediately
 */
export function shutdown() {
  // console.log("MDM: sending force-shutdown request");
  alert("FORCE-SHUTDOWN###");
  return this;
}

/**
 * Reboot immediately
 */
export function restart() {
  // console.log("MDM: sending force-restart request");
  alert("FORCE-RESTART###");
  return this;
}

/**
 * Suspend immediately
 */
export function suspend() {
  // console.log("MDM: sending force-suspend request");
  alert("FORCE-SUSPEND###");
  return this;
}

/**
 * quit MDM (restarts the greeter)
 */
export function quit() {
  // console.log("MDM: sending quit request");
  alert("QUIT###");
  return this;
}


/// BACKEND API ///
import global from 'window';
import {trigger} from './events.js';

/**
 * The MDM API.
 * These functions are called by MDM from the outside,
 * so they need to be declared in global scope.
 * They should ONLY be called by MDM itself.
 */

// Called by MDM if the SHUTDOWN command shouldn't appear in the greeter
global.mdm_hide_shutdown = function() {
  trigger("shutdownHidden");
};
// Called by MDM if the RESTART command shouldn't appear in the greeter
global.mdm_hide_restart = function() {
  trigger("restartHidden");
};
// Called by MDM if the SUSPEND command shouldn't appear in the greeter
global.mdm_hide_suspend = function() {
  trigger("suspendHidden");
};
// Called by MDM if the QUIT command shouldn't appear in the greeter
global.mdm_hide_quit = function() {
  trigger("quitHidden");
};

// Called by MDM if the XDMCP command shouldn't appear in the greeter
// apparently not implemented by MDM (mdmwebkit.c @ 2014-07-30)
global.mdm_hide_xdmcp = function() {
  trigger("xdmcpHidden");
};

