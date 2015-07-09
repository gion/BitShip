var util = (function() {
  var util = {
    ajax: function(type, url, success, fail) {
      var req = new XMLHttpRequest();
      req.onreadystatechange = function() {
        if(req.status >= 200 && req.status < 400) {
          success(JSON.parse(req.responseText), req.status, req);
        } else {
      //    fail(req.responseText, req.status, req);
        }
      };
      req.open(type.toUpperCase(), url, true);
      req.send();
    },

    addClass: function(query, classString) {
      var classes = classString.split(/(\s|\t|\n)+/g);

      Array.prototype.forEach.call(document.querySelectorAll(query), function(el) {
        el.classList.add.apply(el.classList, classes);
      });
    },

    removeClass: function(query, classString) {
      var classes = classString.split(/\s+/g);

      Array.prototype.forEach.call(document.querySelectorAll(query), function(el) {
        el.classList.remove.apply(el.classList, classes);
      });
    },

    hasClass: function(query, className) {
      return document.querySelector(query).classlist.contains(className);
    },

    insertAfter: function(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    },

    removeElement: function(query) {
      var el = document.querySelector(query);
      if(el) {
        el.parentNode.removeChild(el);
      }
    },

    storage: {
      data: null,
      get: function(callback) {
        // if(!this.data) {
        //   this.data = JSON.parse(localStorage.getItem('bitShip'));
        // }
        //
        // return this.data;

        chrome.storage.sync.get('bitShip', function(result) {
          console.log('chrome.storage.sync.get', arguments);
          util.storage.data = JSON.parse(result['bitShip']);

          if(callback) {
            callback(util.storage.data);
          }
        });
      },
      save: function(data, callback) {
        this.data = this.data || data || {};

        // if(this.data) {
        //   localStorage.setItem('bitShip', JSON.stringify(this.data));
        // }

        chrome.storage.sync.set({bitShip: JSON.stringify(this.data)}, callback);
      }
    }
  };

  return util;
})();

module.exports = util;
