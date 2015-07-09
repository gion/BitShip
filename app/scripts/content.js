'use strict';

var util = require('./util.js');
var api = require('./api.js');

// this shuold be removed on "production"
util.storage.save(require('./settings.json'), function() {
  api.run();
});
