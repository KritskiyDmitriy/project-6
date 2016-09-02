'use strict'

var gulp = require('gulp'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	autoprefixer = require('gulp-autoprefixer'),
	plumber = require('gulp-plumber'),
	concat = require('gulp-concat'),
	del = require('del'),
	imagemin = require('gulp-imagemin'),
	base64 = require('gulp-base64'),
	browserSync = require('browser-sync').create(),
	jade = require('gulp-jade'),
	uglify = require('gulp-uglifyjs'),
	notify = require('gulp-notify');

gulp.task('mincss', function() {
	return gulp.src('./dev/sass/*.scss')
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(sass({
			outputStyle:'compressed'
		}).on('error', notify.onError({
			message: '<%= error.message %>',
			title: 'Sass Error!'
		})))
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./site/css/'))
		.pipe(notify('Sass - OK!'))
		.pipe(browserSync.stream())
});

gulp.task('compress', function(){
	return gulp.src('./dev/js/*.js')
		.pipe(plumber())
		.pipe(uglify().on('error', notify.onError({
			message: '<%= error.message %>',
			title: 'JS Error!'
		})))
		.pipe(concat('script.js'))
		.pipe(gulp.dest('./site/'))
		.pipe(notify('JavaScript - OK!'))
		.pipe(browserSync.stream())
});

gulp.task('imgmin', function(){
    return gulp.src('./dev/image/*.*')
        .pipe(imagemin())
        .pipe(gulp.dest('./site/image'))
});

gulp.task('jade', function(){
	return gulp.src('./dev/jade/*.jade')
		.pipe(plumber())
		.pipe(jade().on('error', notify.onError({
			message: '<%= error.message %>',
			title: 'Jade Error!'
		})))
		.pipe(gulp.dest('./site/'))
		.pipe(notify('Jade - OK!'))
		.pipe(browserSync.stream())
})

gulp.task('del', function() {
	return del('./site/*');
});


gulp.task('base', function(){
	return gulp.src('./site/style.css')
		.pipe(base64({
			baseDir: 'E:\\frontend\\pro\\dz14\\site\\image',
            extensions: ['svg', 'png', /\.jpg#datauri$/i],
            maxImageSize: 8*1024, // bytes,
            deleteAfterEncoding: true,
            debug: true
        }))
		.pipe(gulp.dest('./site'));
})

gulp.task('watch', ['mincss', 'jade', 'compress'] ,function(done){
	browserSync.reload();
	done()
});

gulp.task('serve', ['mincss', 'jade'], function(){
	browserSync.init({
		server: 'site'
	});
	gulp.watch('./dev/sass/**/*.scss', ['mincss']);
	gulp.watch('./dev/jade/**/*.jade', ['jade']);
	gulp.watch('./dev/js/*.js', ['compress']);
	gulp.watch('./dev/image/*.*', ['imgmin']);
});


gulp.task('build', ['imgmin', 'mincss', 'jade', 'compress']);
gulp.task('default', ['build', 'watch', 'serve']);


