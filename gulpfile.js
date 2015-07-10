var gulp = require('gulp');
var requireDir = require('require-dir');
var runSequence = require('run-sequence');
var dir = requireDir('./tasks');

gulp.task('build', function(callback) {
  runSequence(
    'clean', [
      'fonts',
      'html',
      'images',
      'locales',
      'scripts',
      'manifest',
      'styles'
    ],
    'package',
    callback);
});

gulp.task('release', function(callback) {
  runSequence(
    'manifest:incBuildNo',
    'build',
    callback);
});

gulp.task('watch', function(callback) {
  runSequence(
    [
      'clean'
    ], [
      'fonts:dev',
      'html:dev',
      'images:dev',
      'locales:dev',
      'scripts:dev',
      'manifest:dev',
      'styles:dev'
    ],
    callback);
});

gulp.task('default', [
  'build'
]);
