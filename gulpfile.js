var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var replace = require('replace');
var template = require('gulp-template');
var templateCache = require('gulp-angular-templatecache');
var ngAnnotate = require('gulp-ng-annotate');
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var fs = require('fs');
var path = require('path');
var merge = require('merge-stream');

var paths = {
    sass: ['./scss/**/*.scss'],
    templatecache: ['./www/templates/*.html'],
    useref: ['./www/*.html'],
    src_js: './www/js/**/*.js',
    ng_annotate: ['./www/js/**/*.js'],
    dest_js: './www/dist/dist_js/app',
    scripts: './www/js'
};

function getFolders(dir) {
    return fs.readdirSync(dir)
        .filter(function(file) {
            return fs.statSync(path.join(dir, file)).isDirectory();
        });
}


gulp.task('scripts', function(done) {
    var folders = getFolders(paths.scripts);

    var tasks = folders.map(function(folder) {
        return gulp.src(path.join(paths.scripts, folder, '/**/*.js'))
            .pipe(ngAnnotate({
                single_quotes: true
            }))
            .pipe(template({
                // serverhost: 'http://192.168.1.104:3000'
                serverhost: 'http://172.16.28.80:3000'
            }))
            .pipe(concat(folder + '.js', {
                newLine: ';'
            }))
            .pipe(gulp.dest(paths.dest_js));
    });
    // process all remaining files in scriptsPath root into main.js and main.min.js files
    var root = gulp.src(path.join(paths.scripts, '/*.js'))
        .pipe(ngAnnotate({
            single_quotes: true
        }))
        .pipe(template({
            // serverhost: 'http://192.168.1.104:3000'
            serverhost: 'http://172.16.28.80:3000'
        }))
        .pipe(concat('app.js'))
        .pipe(gulp.dest(paths.dest_js));

    return merge(tasks, root);
});
gulp.task('templatecache', function(done) {
    gulp.src(paths.templatecache)
        .pipe(templateCache({
            standalone: true
        }))
        .pipe(gulp.dest('./www/js'))
        .on('end', done);
});

gulp.task('useref', function(done) {
    var assets = useref.assets();
    gulp.src('./www/*.html')
        .pipe(assets)
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest('./www/dist'))
        .on('end', done);
});

gulp.task('default', ['sass', 'templatecache', 'ng_annotate', 'useref']);

gulp.task('sass', function(done) {
    gulp.src('./scss/ionic.app.scss')
        .pipe(sass({
            errLogToConsole: true
        }))
        .pipe(gulp.dest('./www/css/'))
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(gulp.dest('./www/css/'))
        .on('end', done);
});

gulp.task('watch', function() {
    console.log('watch run');
    gulp.watch(paths.sass, ['sass']);
    gulp.watch(paths.templatecache, ['templatecache']);
    gulp.watch(paths.ng_annotate, ['ng_annotate']);
    gulp.watch(paths.useref, ['useref']);
});

gulp.task('install', ['git-check'], function() {
    return bower.commands.install()
        .on('log', function(data) {
            gutil.log('bower', gutil.colors.cyan(data.id), data.message);
        });
});

gulp.task('git-check', function(done) {
    if (!sh.which('git')) {
        console.log(
            '  ' + gutil.colors.red('Git is not installed.'),
            '\n  Git, the version control system, is required to download Ionic.',
            '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
            '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
        );
        process.exit(1);
    }
    done();
});
