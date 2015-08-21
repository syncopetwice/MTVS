var
	gulp = require('gulp'),
	gulpsync = require('gulp-sync')(gulp),
	connect = require('gulp-connect'),
	reload = connect.reload(),
	autoprefixer = require('gulp-autoprefixer'),
	scss = require('gulp-ruby-sass'),
	rimraf = require('gulp-rimraf'),
	rename = require('gulp-rename'),
	plumber = require('gulp-plumber'),
	zip = require('gulp-zip'),
	watch = require('gulp-watch');

	var staticResources = [
		'assets/**/*',
	];

	gulp.task('connect', function() {
		connect.server ({
			port: 3000,
			livereload: true,
		});
	});

	gulp.task('clean', function() {
		return gulp.src('assets/css/app/**/*', { read: true })
			.pipe(rimraf());
	});
	gulp.task('scss', function () {
		return scss('./scss/app/app.styles.scss', {
			style: 'compact'
		})
			.pipe(plumber())
			.pipe(autoprefixer({
				browsers: ['last 2 versions', 'ie >= 8'],
				cascade: false
			}))
			.pipe(gulp.dest('assets/css/app/'));
	});

	// Themes
	gulp.task('themes', function () {
		return scss('scss/themes/schemes/', {
			style: 'compressed'
		})
			.pipe(plumber())
			.pipe(autoprefixer({
				browsers: ['last 2 versions', 'ie >= 8'],
				cascade: false
			}))
			.pipe(gulp.dest('assets/css/theme-colors/'));
	});

	gulp.task('archive', function () {
		return gulp.src(
			staticResources,
			{ base:'assets/'})
			.pipe(zip('MotivisStaticResources.zip', {compress: true}))
			.pipe(gulp.dest('./'));
	});

	gulp.task('copy', function(){
		return gulp.src(staticResources, { base:'assets/'})
			.pipe(gulp.dest('C:\\Maven\\Motivis Core\\resource-bundles\\assets.resource\\'));
	});

	gulp.task('watch', function() {
		gulp.watch('scss/app/**/*', gulpsync.sync(['scss', 'copy']));
		gulp.watch('scss/themes/**/*', gulpsync.sync(['themes', 'copy']));
	});

	gulp.task('default', gulpsync.sync([
		// async
		'clean',
		'scss',
		'themes',
		'archive',
		'copy',
		'watch'
	]));