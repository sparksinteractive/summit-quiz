var gulp = require('gulp'),
    livereload = require('gulp-livereload'),
    del = require('del'),
    includeTasks = require('require-dir'),
    // gls = require('gulp-live-server'),
    browserSync = require('browser-sync').create();

includeTasks('./gulp-tasks/active');

gulp.task('default', ['clean'], function() {
    gulp.start('watch')
});

// gulp.task('browserSync', function() {
//     browserSync.init({
//         server: {
//             baseDir: 'dist'
//         },
//         logConnections: true
//     })
// });

////
////// For use with express servers
////
//
// gulp.task('server', function() {
//     var server = gls.new('./server.js');
//     return server.start();
// });
//
// gulp.task('browserSync', function() {
//     browserSync.init({
//         files: "dist/**/*",
//         proxy: "localhost:3000",
// 	    port: 5000,
//         logConnections: true
//     })
// });

gulp.task('clean', function() {
    return del(['dist/css', 'dist/js', 'dist/**/*.html', 'dist/fonts']);
});

gulp.task('watch', ['clean', 'sass', 'vendorstyles', 'scripts', 'vendorscripts', 'copyHtml', 'fonts'], function() {
    gulp.watch('src/**/*.html', ['copyHtml']);
    // gulp.watch('src/**/*.hbs', ['templates']);
    gulp.watch('src/css/**/*.scss', ['sass'], browserSync.reload);
    gulp.watch('src/css/vendor/**', ['vendorstyles']);
    gulp.watch('src/js/**/*.js', ['scripts']);
    gulp.watch('src/js/vendor/**', ['vendorscripts']);
    // gulp.watch('src/img/**/*', ['images']);
    livereload.listen();
    gulp.watch(['src/**']).on('change', livereload.changed);
});
