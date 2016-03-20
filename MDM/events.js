export {
  addEventListener,
  addEventListener as on,
  removeEventListener,
  removeEventListener as off,
  once,
  once as one,
  trigger,
};

const listeners = Object.create(null);

function addEventListener(evt, listener) {
  if (evt in listeners) {
    listeners[evt].push(listener);
  } else {
    listeners[evt] = [listener];
  }
}

function removeEventListener(evt, listener) {
  if (evt in listeners) {
    if (listener) {
      const fns = listeners[evt];
      
      // remove first occurence
      for (let i = 0, len = fns.length ; i < len ; ++i) {
        let fn = fns[i];
        
        // fn._fn identifies wrapped .once listeners
        if (fn === listener || fn._fn === listener) {
          if (fns.length === 1) {
            
            // don't keep an empty array
            delete listeners[evt];
            
          } else {
            fns.splice(i, 1);
          }
          break;
        }
      }
      
    } else {
      delete listeners[evt];
    }
  }
}

function once(evt, listener) {
  function wrapper(evt) {
    removeEventListener(evt, wrapper);
    listener.call(this, evt);
  }
  wrapper._fn = listener; // identifiable for .off
  addEventListener(evt, wrapper);
}

function trigger(evt, ...args) {
  console.log(evt, ...args);
  if (evt in listeners) {
    const fns = listeners[evt].slice();
    for (let i = 0, len = fns.length ; i < len ; ++i) {
      fns[i](evt, ...args);
    }
  }
}
