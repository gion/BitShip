var util = require('./util.js');
var $ = require('./jquery-2.1.4.min.js');

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

    getCodeshipProjects: function(codeshipAPiKey, success, fail) {
      codeshipAPiKey = codeshipAPiKey || api.settings.codeship.apiKey;

      var url = 'https://codeship.com/api/v1/projects.json?api_key=' + codeshipAPiKey;
      return $.get(url).done(success).fail(fail);
    },

    _getCodeshipStatus: function(codeshipAPiKey, codeshipProjectId, success, fail) {
      var url = 'https://codeship.com/api/v1/projects/'+ codeshipProjectId +'.jsonp?api_key=' + codeshipAPiKey;
      return $.get(url).done(success).fail(fail);
    },

    _getCodeshipStatusForBranch: function(branchName, codeshipAPiKey, codeshipProjectId, success, fail) {
      var defer = $.Deferred();

      api._getCodeshipStatus(codeshipAPiKey, codeshipProjectId)
        .done(function(response) {
          var build = response.builds.filter(function(build) {
            return build.branch === branchName;
          })[0];

          defer.resolve(build.status, build);

          if(success) {
            success(build.status, build);
          }
        })
        .fail(fail);

        return defer.promise();
    },

    getBuildStatus: function(project) {
      var branchName = api.getBranchName(),
          codeshipProjectId = project.id,
          codeshipAPiKey = api.settings.codeship.apiKey;

      return api._getCodeshipStatusForBranch(branchName, codeshipAPiKey, codeshipProjectId);
    },

    updateUI: function(status, buildData) {
      $('html')
        .removeClass('bitship-status-error bitship-status-success bitship-status-testing bitship-mergeDuringBuild')
        .toggleClass('bitship-mergeDuringBuild', api.settings.mergeDuringBuild)
        .addClass('bitship-status-' + status);

      $('#bitship-container').remove();
      api._addNotificationDom(buildData);
    },

    _addNotificationDom: function(buildData) {
      var //domEl = document.createDocumentFragment(),
          container = document.createElement('a'),
          message = document.createElement('span'),
          statusImg = document.createElement('img'),
          codeshipUUID = api.selectedProject.uuid,
          branchName = api.getBranchName(),
          imgUrl = 'https://codeship.com/projects/'+ codeshipUUID +'/status?branch=' + branchName;

      statusImg.classList.add('bitship-status');
      statusImg.setAttribute('src', imgUrl);

      message.classList.add('bitship-message');
      message.appendChild(statusImg);

      container.setAttribute('id', 'bitship-container');
      container.setAttribute('href', 'https://codeship.com/projects/'+ buildData.project_id +'/builds/' + buildData.id);
      container.setAttribute('target', '_blank');
      container.setAttribute('title', 'Open the codeship build page');
      container.appendChild(message);

      // domEl.appendChild(container)
      var target = $('#pull-request-diff-header');
      $(container).insertAfter(target);
    },

    getBitbucketProjectFromUrl: function(url) {
      return (url || location.toString()).replace(/^.*bitbucket\.org\/(.*?)\/pull-request.*$/, '$1').toLowerCase();
    },

    isEnabledForProject: function(projectData) {
      if(!projectData.repository_name) {
        return false;
      }

      var isSameName = projectData.repository_name.toLowerCase() === api.getBitbucketProjectFromUrl(),
          isBitbucketProject = projectData.repository_provider.toLowerCase() === 'bitbucket';

      return isBitbucketProject && isSameName;
    },

    run: function() {

      // do not run on the multiple pull requests page
      if(util.isPullRequestsListingPage()) {
        return;
      }

      $('html').addClass('bitship-enabled');

      api.settings = util.storage.get(function(settings) {
        api.settings = settings;

        console.log(api.settings);

        api.getCodeshipProjects()
          .done(function(response) {
            api.projects = response.projects;

            api.projects
            .filter(api.isEnabledForProject)
            .forEach(function(project, i) {
              // execute only for the first project if there are many that have passed the filter
              // :-? (may prevent some bugs on forked repos?)
              if(i > 0) {
                return;
              }

              api.selectedProject = project;

              api.getBuildStatus(project)
                .done(api.updateUI);
            });
          })
          .fail(function() {
            $('html').removeClass('bitship-enabled');
          });
      });
    }
  };

  return api;
})();

module.exports = api;
