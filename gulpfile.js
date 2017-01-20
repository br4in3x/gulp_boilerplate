var gulp        = require('gulp'),
    plumber     = require('gulp-plumber'),
    sass        = require('gulp-sass'),
    concat      = require('gulp-concat'),
    imagemin    = require('gulp-imagemin'),
    rename      = require('gulp-rename'),
    uglify      = require('gulp-uglifyjs'),
    browserSync = require('browser-sync'),
    autoprefix  = require('gulp-autoprefixer'),
    globbing    = require('gulp-sass-glob'),
    browserSync = require('browser-sync'),
    sm          = require('gulp-sourcemaps'),
    reload      = browserSync.reload;

var paths = {
    input: {
        css: 'source/sass/main.scss',
        js: ['source/js/**/*', 'source/sass/**/*.js'],
        images: 'source/images/**/*',
    },
    watch: {
        css: 'source/sass/**/*'
    },
    output: {
        css: 'build',
        js: 'build',
        images: 'build/images',
    }
}

gulp.task('webserver', () => {
    browserSync({
        server: { baseDir: "./" },
        tunnel: true,
        host: 'localhost',
        port: 8000,
        logPrefix: "br4in3x"
    });
});

gulp.task('sass', () => {
    gulp.src(paths.input.css)
        .pipe(plumber())
        .pipe(sm.init())      
        .pipe(globbing())
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(autoprefix())
        .pipe(sm.write('.'))              
        .pipe(gulp.dest(paths.output.css))
        .pipe(reload({stream: true}));
});

gulp.task('js', () => {
    gulp.src(paths.input.js)
        .pipe(plumber())
        .pipe(sm.init())
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(sm.write('.'))        
        .pipe(gulp.dest(paths.output.js))
        .pipe(reload({stream: true}));
});

gulp.task('images', () => {
    gulp.src(paths.input.images)
        .pipe(plumber())
        .pipe(imagemin())
        .pipe(rename({ dirname: '' }))
        .pipe(gulp.dest(paths.output.images))
        .pipe(reload({stream: true}));
});

gulp.task('build', ['sass', 'js', 'images']);
gulp.task('default', ['watch', 'webserver']);

gulp.task('watch', ['build'], () => {
    gulp.watch(paths.watch.css, ['sass']);
    gulp.watch(paths.input.js, ['js']);
    gulp.watch(paths.input.images, ['images']);
});
