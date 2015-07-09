'use strict';

var util = require('./util.js');
var api = require('./api.js');

angular.module('bitShip', []);

angular
  .module('bitShip')
    .controller('bitShipOptionsController', bitShipOptionsController);

function bitShipOptionsController($scope) {

  util.storage.get(function(settings) {
    console.log(settings);
    $scope.settings = settings;
    $scope.formData = angular.copy(settings);
    $scope.$apply();
  });

  $scope.submit = function() {
    angular.extend($scope.settings, $scope.formData);
    $scope.loading = true;
    util.storage.save($scope.settings, function() {
      $scope.loading = false;
      $scope.formData = angular.copy($scope.settings);
      $scope.$apply();
    });
  }
}
