// load modules
const gulp = require('gulp');
const del = require('del');
const livereload = require('gulp-livereload');
const htmlmin = require('gulp-htmlmin');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const sourcemaps = require('gulp-sourcemaps');

// declare functions
// delete all the assets in public
function assetsClean(done) {
    return del(
        ['public/**/*', '!public/**/*.css'], 
        { force: true }
    );
}
 
// Copy all assets from src/assets into public
function assetsPublish(done) {
    return gulp.src('src/assets/**/*')
      .pipe(gulp.dest('public'));
}

// publish HTML files
function htmlPublish(done) {
    return gulp.src('src/assets/**/*.html')
      .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(gulp.dest('public'))
      .pipe(livereload());
}

// compile SCSS files
function scssCompile(done) {
    return gulp.src('src/scss/**/*.scss')
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
      }))
    //   .pipe(csso())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('public/css'))
      .pipe(livereload());
}
 
// watch files
function watchFiles(done) {
    gulp.watch("src/assets/**/*.html", htmlPublish);
    gulp.watch("src/scss/**/*.scss", scssCompile);
}

// start livereload
function livereloadStart(done) {
    livereload.listen();
}

// export tasks
exports.publish = gulp.series(assetsClean, assetsPublish, scssCompile);
exports.watch = gulp.parallel(livereloadStart, watchFiles);