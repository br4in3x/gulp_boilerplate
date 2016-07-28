/* global require, console, window*/
'use strict';

// Include gulp
var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')(),

    scripts = [
        'source/javascript/!(script).js',
        'source/sass/blocks/**/*.js',
        'source/javascript/script.js'
    ],

    sass = ['source/sass/main.scss'],
    images = ['source/sass/blocks/**/*.(png|jpg)'];

gulp.task('scripts', function () {
    return gulp.src(scripts)
        .pipe(plugins.concat('main.js'))
        .pipe(plugins.rename({suffix: '.min'}))
        .pipe(plugins.uglify())
        .on('error', plugins.util.log)
        .pipe(gulp.dest('build/js'));
});

gulp.task('sass', function () {
    return gulp
        .src(sass)
        .pipe(plugins.sassGlob())
        .pipe(plugins.sass().on('error', plugins.sass.logError))
        .pipe(plugins.groupCssMediaQueries({log: true}))
        .pipe(plugins.rename({suffix: '.min'}))
        .pipe(gulp.dest('build/css'));
});

gulp.task('images', function () {
    return gulp.src(images)
        .pipe(plugins.cache(plugins.imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
        .pipe(gulp.dest('build/images'));
});

// watching for changes
gulp.task('watch', ['default'], function () {
    gulp.watch(scripts, ['scripts']);
    gulp.watch('source/sass/**/*.scss', ['sass']);
    gulp.watch(images, ['images']);
});

// Default task
gulp.task('default', ['scripts', 'sass', 'images']);