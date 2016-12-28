/**
 * Created by ningfujun on 16/12/28.
 */

let gulp = require('gulp');
let test = require('./test/postcss');

gulp.task('test',function (done) {
  gulp.src('test/main.css')
    .pipe(test())
    .pipe(gulp.dest('test/dist'))
});
