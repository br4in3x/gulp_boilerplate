/* global require, console, window*/
'use strict';

// Include gulp
var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')(),
    params = require('yargs').argv,
    sources = {
        scripts: [
            'source/javascript/!(script).js',
            'source/sass/blocks/**/*.js',
            'source/javascript/script.js'
        ],
        sass: ['source/sass/main.scss'],
        images: ['source/sass/blocks/**/*.+(png|jpg|JPG|PNG)']
    }

gulp.task('webserver', function() {
  return plugins.connect.server({
    livereload: true,
    root: '.'
  });
});
 
gulp.task('livereload', function() {
    var files = sources.sass.concat(sources.scripts, sources.images);
    return plugins.watch(files)
        .pipe(plugins.connect.reload());
});

gulp.task('scripts', function () {
    var uglifyOpts = params.dev ? {mangle: false, compress: false, preserveComments: 'all'} : {}
    return gulp.src(sources.scripts)
        .pipe(plugins.concat('main.js'))
        .pipe(plugins.uglify(uglifyOpts))
        .on('error', plugins.util.log)
        .pipe(gulp.dest('build/js'));
});

gulp.task('sass', function () {
    var sassOpts = params.dev ? {outputStyle: 'expanded'} : {outputStyle: 'compressed'}
    return gulp
        .src(sources.sass)
        .pipe(plugins.sassGlob())
        .pipe(plugins.sass(sassOpts).on('error', plugins.sass.logError))
        .pipe(gulp.dest('build/css'));
});

gulp.task('images', function () {
    return gulp.src(sources.images)
        .pipe(plugins.cache(plugins.imagemin({ 
            optimizationLevel: 5, 
            progressive: true, 
            interlaced: true 
        })))
        .pipe(gulp.dest('build/images'));
});

// watching for changes
gulp.task('watch', ['default'], function () {
    gulp.watch(sources.scripts, ['scripts']);
    gulp.watch('source/sass/**/*.scss', ['sass']);
    gulp.watch(sources.images, ['images']);
});

// Default task
gulp.task('default', ['scripts', 'sass', 'images', 'webserver', 'livereload']);