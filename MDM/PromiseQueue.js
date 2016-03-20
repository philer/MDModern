/**
 * Queue that executes callback synchronously.
 * Each callback will be called only once the previous one has been resolved
 * or rejected.
 */
export default function PromiseQueue() {
  this._items = [];
}

PromiseQueue.prototype = {
  
  /**
   * Add a function that can be used as an argument to Promise()
   * @param  {Function} callback args: resolve, reject
   * @return {Promise}           Promise that will resolve when 
   */
  push(callback) {
    const p = Promise((resolve, reject) => this._items.push({ callback, resolve, reject }));
    this._run();
    return p;
  },
  
  /**
   * Run the Queue.
   * This means that items will be executed one by one until the queue is empty.
   */
  _run() {
    if (!this._items.length) {
      return;
    }
    
    const p = this._items.shift();
    const queue = this;
    
    // p.callback is the user-provided function (see .push)
    Promise(p.callback).then(
      function(...args) {
        p.resolve.apply(null, args);
        queue._run();
      },
      function(...args) {
        p.reject.apply(null, args);
        queue._run();
      }
    );
  },
  
};



