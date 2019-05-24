var gulp = require('gulp'),
    del = require('del'),
    browserSync = require('browser-sync').create();

gulp.task('cleanhtml', function() {
    return del('dist/**/*.html')
});

gulp.task('copyHtml', function() {
    gulp.src('src/**/*.html').pipe(gulp.dest('dist')).pipe(browserSync.reload({
        stream: true
    }));
});

gulp.task('fonts', function() {
    return gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));
});
