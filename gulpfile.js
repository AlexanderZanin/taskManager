'use strict';

var gulp        = require('gulp'),
	browserSync = require('browser-sync').create(),
	sass        = require('gulp-sass'),
	prefix      = require('gulp-autoprefixer');

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {

	browserSync.init({
		server: "./app"
	});

	gulp.watch("./scss/**/*.scss", ['sass']);
	gulp.watch("app/*.html").on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
	return gulp.src("./scss/*.scss")
		.pipe(sass.sync().on('error', sass.logError))
		.pipe(prefix('last 2 versions'))
		.pipe(gulp.dest("app/css"))
		.pipe(browserSync.stream());
});

gulp.task('default', ['serve']);