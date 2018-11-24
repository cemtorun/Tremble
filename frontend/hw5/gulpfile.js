var gulp = require('gulp'),
    browserify = require('gulp-browserify'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    jshint = require('gulp-jshint');

gulp.task('javascript', function () {
    return gulp.src('./src/app/scripts/*.js')
        .pipe(browserify({
            transform: ['debowerify']
        }))
        .pipe(jshint())
        .pipe(uglify())
        .pipe(rename({extname: '.min.js'}))
        .pipe(gulp.dest('./scripts.js'));
});

gulp.task('styles-outer', function () {
    return gulp.src('./src/app/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./styles.css'));
});

gulp.task('styles-inner', function () {
    return gulp.src('./src/app/**/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./styles.css'));
});

gulp.task('build', ['javascript', 'styles-outer', 'styles-inner']);

gulp.task('watch', ['build'], function () {
    gulp.watch('./src/app/scripts/*.js', ['javascript']);
    gulp.watch('./src/app/**/*.scss', ['styles-outer']);
	gulp.watch('./src/app/**/**/*.scss', ['styles-inner']);
});