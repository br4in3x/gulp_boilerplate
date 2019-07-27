var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglifyjs'),
    browserSync = require('browser-sync'),
    autoprefix = require('gulp-autoprefixer'),
    globbing = require('gulp-sass-glob'),
    browserSync = require('browser-sync'),
    sm = require('gulp-sourcemaps'),
    acss = require('gulp-atomizer'),
    reload = browserSync.reload,
    nunjucksRender = require('gulp-nunjucks-render'),
    short = require('short-uuid'),
    clean = require('gulp-clean');

var version = short().generate()

var paths = {
    input: {
        css: 'source/sass/main.scss',
        js: ['source/js/**/*', 'source/sass/blocks/**/*.js'],
        images: 'source/images/**/*',
        html: ['*.html', 'source/nj/**/*.nj']
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
        server: {
            baseDir: "./"
        },
        host: 'localhost',
        port: 3000,
        logPrefix: "br4in3x"
    });
});

gulp.task('sass', () => {
    gulp.src(paths.input.css)
        .pipe(plumber())
        .pipe(sm.init())
        .pipe(globbing())
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .pipe(autoprefix())
        .pipe(rename({suffix: `.${version}`}))
        .pipe(sm.write('.'))
        .pipe(gulp.dest(paths.output.css))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('js', () => {
    gulp.src(paths.input.js)
        .pipe(plumber())
        .pipe(sm.init())
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(rename({suffix: `.${version}`}))
        .pipe(sm.write('.'))
        .pipe(gulp.dest(paths.output.js))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('images', () => {
    gulp.src(paths.input.images)
        .pipe(plumber())
        .pipe(imagemin())
        .pipe(rename({
            dirname: ''
        }))
        .pipe(gulp.dest(paths.output.images))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('html', () => {
    gulp.src('source/nj/**/*.nj')
        .pipe(plumber())
        .pipe(nunjucksRender({
            path: ['source/nj'],
            data: {
                version,
            }
        }))
        .pipe(gulp.dest('./'))
});

gulp.task('atomic', () => {
    gulp.src('index.html')
        .pipe(acss({
            acssConfig: require('./.atomicrc.js'),
        }))
        .pipe(gulp.dest(paths.output.css))
})

gulp.task('clean', () => {
    gulp.src('./build', { read: false })
        .pipe(clean())
})

gulp.task('build', ['sass', 'js', 'images', 'html']);
gulp.task('server', ['watch', 'webserver']);
gulp.task('default', ['watch']);

gulp.task('watch', ['build'], () => {
    gulp.watch(paths.watch.css, ['sass']);
    gulp.watch(paths.input.js, ['js']);
    gulp.watch(paths.input.images, ['images']);
    gulp.watch([paths.input.html], ['html', 'atomic'])
});