var util = (function() {
  var util = {
    storage: {
      data: null,
      get: function(callback) {
        chrome.storage.sync.get('bitShip', function(result) {
          var data = result ? result['bitShip'] : null;
          util.storage.data = data ? JSON.parse(data) : {};
          console.log('chrome.storage.sync.get', util.storage.data);
          // window.A = util;
          if(callback) {
            callback(util.storage.data);
          }
        });
      },
      save: function(data, callback) {
        this.data = this.data || data || {};
        chrome.storage.sync.set({bitShip: JSON.stringify(this.data)}, callback);
      }
    }
  };
  return util;
})();

module.exports = util;
