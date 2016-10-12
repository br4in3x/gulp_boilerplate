/* global require, console, window*/
/*TODO: refactor*/
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
        images: ['source/sass/blocks/**/*.+(png|jpg|JPG|PNG|svg)'],
        html: ['*.html']
    },
    development = params.dev ? true : false,
    browserSync = require("browser-sync"),
    reload = browserSync.reload;

function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}

var config = {
    server: {
        baseDir: "./"
    },
    tunnel: true,
    host: 'localhost',
    port: 8000,
    logPrefix: "br4in3x"
};

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('scripts', function () {
    return gulp.src(sources.scripts)
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.concat('main.js'))
        .pipe(plugins.if(
            !development, plugins.uglify()
            .on('error', handleError))
        )    
        .pipe(plugins.sourcemaps.write('./'))
        .pipe(gulp.dest('build/js'))
        .pipe(reload({stream: true}));
});

gulp.task('sass', function () {
    var sassOpts = { outputStyle: 'compressed' }
    
    if (development) {
        var sassOpts = { outputStyle: 'expanded' }
    }

    return gulp
        .src(sources.sass)
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.sassGlob())
        .pipe(plugins.sass(sassOpts).on('error', plugins.sass.logError))
        .pipe(plugins.autoprefixer())
        .pipe(plugins.sourcemaps.write('./'))
        .pipe(gulp.dest('build/css'))
        .pipe(reload({stream: true}));
});

gulp.task('images', function () {
    return gulp.src(sources.images)
        .pipe(plugins.cache(plugins.imagemin({ 
            optimizationLevel: 5, 
            progressive: true, 
            interlaced: true 
        })))
        .pipe(gulp.dest('build/images'))
        .pipe(reload({stream: true}));
});

// watching for changes
gulp.task('watch', function () {

    plugins.watch(sources.html, function () {
        gulp.src(sources.html)
            .pipe(reload({stream: true}));
    });

    plugins.watch(sources.scripts, function () {
        gulp.start('scripts');
    });
    
    plugins.watch(sources.images, function () {
        gulp.start('images');
    });
    
    plugins.watch('source/sass/**/*.scss', function () {
        gulp.start('sass');
    });
});

gulp.task('build', [
    'scripts',
    'sass',
    'images'
]);

// Default task
gulp.task('default', ['build', 'webserver', 'watch']);