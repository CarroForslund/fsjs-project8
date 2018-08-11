"use strict";

var gulp        = require("gulp"),
    concat      = require("gulp-concat"),
    uglify      = require("gulp-uglify"),
    uglifycss   = require("gulp-uglifycss"),
    rename      = require("gulp-rename"),
    sass        = require("gulp-sass"),
    maps        = require("gulp-sourcemaps"),
    del         = require("del"),
    image       = require("gulp-imagemin"),
    webserver   = require("gulp-webserver"),
    runSequence = require('run-sequence');;

// Concatinate and map the script files
gulp.task("concatScripts", function(){
  return gulp.src([
      "js/circle/autogrow.js",
      "js/circle/circle.js",
      "js/global.js"])
    .pipe(maps.init())
    .pipe(concat("all.js"))   //Concat to file
    .pipe(maps.write("./"))
    .pipe(gulp.dest("js"));   //Add concat file to folder
});

// Minify all of the project’s JavaScript files into an all.min.js file
// then copies to the dist/scripts folder.
gulp.task("minifyScripts", ["concatScripts"], function(){
  return gulp.src("js/all.js")
    .pipe(uglify())
    .pipe(rename("all.min.js"))
    .pipe(gulp.dest("dist/scripts"));
});

// Run all the script tasks
gulp.task("scripts", ["minifyScripts"]);

// Compile and map the project’s SCSS files into CSS
gulp.task("compileSass", function(){
  return gulp.src("sass/global.scss")
    .pipe(maps.init())
    .pipe(sass())
    .pipe(maps.write("./"))
    .pipe(gulp.dest("css"));
});

// Concatinate the project’s CSS file, then concatenate and minify
// into an all.min.css file that is then copied to the dist/styles folder.
// The gulp styles command generates CSS source maps
gulp.task("concatStyles", ["compileSass"], function(){
  return gulp.src("css/global.css")
    .pipe(maps.init())
    .pipe(concat("all.css"))  //Concat to file
    .pipe(maps.write("./"))
    .pipe(gulp.dest("css")); //Add concat file to folder
});

gulp.task("minifyStyles", ["concatStyles"], function(){
  return gulp.src("css/all.css")
    .pipe(uglifycss())
    .pipe(rename("all.min.css"))
    .pipe(gulp.dest("dist/styles"));
});

gulp.task("styles", ["minifyStyles"]);

// As a developer, when I run the default gulp command, it should continuously
// watch for changes to any .scss file in my project. When there is a change to
// one of the .scss files, the gulp styles command is run and the files are
// compiled, concatenated, and minified to the dist folder. My project should then
// reload in the browser, displaying the changes.
gulp.task("watchSass", function(){
  gulp.watch("scss/**/*.scss", ["styles"]); //Watch all .scss files in all subfolders of the scss folder
});

// Optimize the size of the project’s JPEG and PNG files,
// and then copy those optimized images to the dist/content folder
gulp.task("images", function(){
  gulp.src(["images/*.jpg", "images/*.png"])
    .pipe(image())
    .pipe(gulp.dest("dist/content"));
});

// Delete all of the files and folders in the dist folder
gulp.task("clean", function(){
  del(["dist/**/*", "css/**/*", "js/all*.js*"]);
});

// Run the clean, scripts, styles, and images tasks,
// The clean task completes before the other commands
gulp.task("build", function(){
  runSequence("clean", ["scripts", "styles", "images"]);
});

gulp.task("webserver", function(){
  gulp.src('index')
    .pipe(webserver({
      localhost: true,
      livereload: true,
      directoryListing: true,
      open: true,
      port: 3000
    }));
})

// gulp.task("serve", ["watchSass"]);

// DEFAULT SCRIPT RUNS ON THE "GULP" COMMAND IN THE CONSOLE
gulp.task("default", function(){
  runSequence("build", "webserver");
});
