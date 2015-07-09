'use strict';

var util = require('./util.js');
var api = require('./api.js');

angular.module('bitShip', []);

angular
  .module('bitShip')
    .controller('bitShipOptionsController', bitShipOptionsController);

function bitShipOptionsController($scope) {
  console.log('util', util);
  console.log('settings', util.storage.get());
  $scope.settings = util.storage.get();
}
