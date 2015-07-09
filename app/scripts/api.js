var util = require('./util.js');

var api = (function() {
  var api = {
    // scrapes the dom to find the "from" branch of the pull request
    getBranchName: function() {
      var anchor = document.querySelector('#pull-from a'),
          branch;

      if(!anchor) {
        throw new Error('no "pull from" element :(');
      }

      branch = anchor.title || anchor.textContent;

      if(!branch) {
        throw new Error('no valid branch name');
      }

      return branch;
    },

    _getCodeshipStatus: function(codeshipAPiKey, codeshipProjectId, success, fail) {
      var url = 'https://codeship.com/api/v1/projects/'+ codeshipProjectId +'.jsonp?api_key=' + codeshipAPiKey;
      // console.log('_getCodeshipStatus url', url);

      util.ajax('get', url, success, fail);
    },

    _getCodeshipStatusForBranch: function(branchName, codeshipAPiKey, codeshipProjectId, success, fail) {
      api._getCodeshipStatus(codeshipAPiKey, codeshipProjectId, function(response) {
        // console.log('_getCodeshipStatus', response);
        var build = response.builds.filter(function(build) {
          return build.branch === branchName;
        })[0];

        success(build.status, build);
      }, fail);
    },

    getBuildStatus: function(success, fail) {
      var branchName = api.getBranchName(),
          codeshipProjectId = '89807',
          codeshipAPiKey = '3c3334406595e60ebe377306ce202bf91c9db509ab0a928e2858f1f706d1';
          codeshipAPiKey = api.settings.codeship.apiKey;

      api._getCodeshipStatusForBranch(branchName, codeshipAPiKey, codeshipProjectId, success, fail);
    },

    updateUI: function(status) {
      util.removeClass('html', 'bitship-status-error bitship-status-success bitship-status-testing');
      util.addClass('html', 'bitship-status-' + status);
      util.removeElement('#bitship-container');
      api._addNotificationDom();
    },

    _addNotificationDom: function() {
      var domEl = document.createDocumentFragment(),
          container = document.createElement('section'),
          message = document.createElement('span'),
          statusImg = document.createElement('img'),
          codeshipUUID = 'c8787840-06ba-0133-1ccd-2aa9a23a545f',
          branchName = api.getBranchName(),
          imgUrl = 'https://codeship.com/projects/'+ codeshipUUID +'/status?branch=' + branchName;

      statusImg.classList.add('bitship-status');
      statusImg.setAttribute('src', imgUrl);

      message.classList.add('bitship-message');
      message.appendChild(statusImg);

      container.setAttribute('id', 'bitship-container');
      container.appendChild(message);

      domEl.appendChild(container)
      util.insertAfter(domEl, document.querySelector('#pull-request-diff-header'));
    },

    run: function() {

      api.settings = util.storage.get(function(settings) {
        api.settings = settings;

        console.log(api.settings);

        util.addClass('html', 'bitship-enabled');
        api.getBuildStatus(function success(status, buildData) {
          api.updateUI(status);
        }, function error() {console.warn('nasol', arguments);});
      });

    }
  };

  return api;
})();

module.exports = api;
