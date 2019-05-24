var gulp = require('gulp'),
    rename = require('gulp-rename'),
    handlebars = require('gulp-compile-handlebars'),
    hbs = require('handlebars'),
    fs = require('fs'),
    gulpFlatBlog = require('gulp-flat-blog'),
    moment = require('moment'),
    browserSync = require('browser-sync').create();

gulp.task('templates', function() {
    options = {
        batch: ['./src/partials']
    }

    return gulp.src('src/*.hbs')
        .pipe(handlebars(null, options))
        // .pipe(rename('boomer.html'))
        .pipe(rename(function(path) {
            path.extname = '.html';
            // console.log(path);
        }))
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.reload({
            stream: true
        }));
});
