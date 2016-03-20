/**
 * Queue that executes callback synchronously.
 * Each callback will be called only once the previous one has been resolved
 * or rejected.
 */
export default function PromiseQueue() {
  this._items = [];
  this._running = false;
}

PromiseQueue.prototype = {
  
  /**
   * Add a function that can be used as an argument to Promise()
   * @param  {Function} callback args: resolve, reject
   * @return {Promise}           Promise that will resolve when 
   */
  push(callback) {
    const p = new Promise((resolve, reject) => this._items.push({ callback, resolve, reject }));
    this._start();
    return p;
  },
  
  _start() {
    // already started
    if (this._running/* || !this._items.length*/) {
      return;
    }
    this._running = true;
    this._next();
  },
  
  /**
   * Run the Queue.
   * This means that items will be executed one by one until the queue is empty.
   */
  _next() {
    if (!this._items.length) {
      this._running = false;
      return;
    }
    
    const call = this._items.shift();
    const queue = this;
    
    // call.callback is the user-provided function (see .push)
    new Promise(call.callback).then(
      function(...args) {
        call.resolve(...args);
        queue._next();
      },
      function(...args) {
        call.reject(...args);
        queue._next();
      }
    );
  },
  
};



