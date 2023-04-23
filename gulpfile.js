const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const cssnano = require("cssnano");
const terser = require("gulp-terser");
const browsersync = require("browser-sync").create();
const purgecss = require("gulp-purgecss");

const scssSrc = "dev/scss/**/*.scss";
const cssDist = "dist/css/";
const jsSrc = "dev/js/**/*.js";
const jsDist = "dist/js/";

// Sass Task
function scssTask() {
  return src(scssSrc)
    .pipe(sass())
    .pipe(purgecss({ content: ["*.html", "dev/js/**/*.js"] }))
    .pipe(postcss([cssnano()]))
    .pipe(dest(cssDist));
}

// JavaScript Task
function jsTask() {
  return src(jsSrc).pipe(terser()).pipe(dest(jsDist));
}

// HTML Task
// function htmlTask(){
//   return src('dev/index.html')
//   .pipe(dest('./dist/'))
// }

// Browsersync Tasks
function browsersyncServe(cb) {
  browsersync.init({
    server: {
      baseDir: ".",
    },
  });
  cb();
}

function browsersyncReload(cb) {
  browsersync.reload();
  cb();
}

// Watch Task
function watchTask() {
  watch(
    ["*.html", "dev/scss/**/*.scss", "dev/js/**/*.js"],
    series(scssTask, jsTask, browsersyncReload)
  );
}

// Default Gulp task
exports.default = series(
  scssTask,
  jsTask,
  // htmlTask,
  browsersyncServe,
  watchTask
);
