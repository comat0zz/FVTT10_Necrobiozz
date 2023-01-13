const gulp = require("gulp");
const cb = require("cb");
const fs = require("fs");

const through2 = require("through2");
const Datastore = require("nedb");
const path = require("path");
const mergeStream = require('merge-stream');
var less = require('gulp-less');


const PATH_SRC = "src"
const PACK_SRC = path.join(PATH_SRC, "packs");
const PACK_DIST = "packs";

const CSS_SRC = path.join(PATH_SRC, "less");
const CSS_DIST = "styles";

/* ----------------------------------------- */
/*  Compile Compendium
/* ----------------------------------------- */


function compilePacks() {
  // determine the source folders to process
  const folders = fs.readdirSync(PACK_SRC).filter((file) => {
    return fs.statSync(path.join(PACK_SRC, file)).isDirectory();
  });

  // process each folder into a compendium db
  const packs = folders.map((folder) => {
    const dbpath = path.resolve(__dirname, "packs", `${folder}.db`);
    const db = new Datastore({ filename: dbpath, autoload: true });
    return gulp.src(path.join(PACK_SRC, folder, "*.json")).pipe(
      through2.obj((file, enc, cb) => {
        
        let json = JSON.parse(file.contents.toString());

        json.forEach(function callback(value) {
          db.insert(value);
        });

        cb(null, file);
      })
    );
  });

  return mergeStream.call(null, packs);
};

/* ----------------------------------------- */
/*  Compile Less to CSS
/* ----------------------------------------- */
function compileLess(cb) {
  gulp
    .src(path.join(CSS_SRC, "necrobiozz.less"))
    .pipe(less())
    .pipe(gulp.dest(CSS_DIST));
  cb();
};

gulp.task('watch', function(){
    gulp.watch(CSS_SRC + '/**/*.less', gulp.series(compileLess));
});

/* ----------------------------------------- */
/*  Export Tasks
/* ----------------------------------------- */
exports.compileLess = gulp.series(compileLess);
exports.compilePacks = gulp.series(compilePacks);
