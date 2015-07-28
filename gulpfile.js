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
		'scss/**/*',
		'gulpfile.js',
		'package.json'
	];

	gulp.task('connect', function() {
		connect.server ({
			port: 3000,
			livereload: true,
		});
	});

	gulp.task('clean', function() {
		return gulp.src('assets/css/**/*', { read: true })
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
			.pipe(connect.reload())
			.pipe(gulp.dest('assets/css/'));
	});
	// Themes
	gulp.task('themes', function () {
		return scss('./scss/themes/app.themes.scss', {
			style: 'compact'
		})
			.pipe(plumber())
			.pipe(autoprefixer({
				browsers: ['last 2 versions', 'ie >= 8'],
				cascade: false
			}))
			.pipe(connect.reload())
			.pipe(gulp.dest('assets/css/'));
	});
	gulp.task('archive', function () {
		return gulp.src(
			staticResources,
			{ base:'.'})
			.pipe(zip('MotivisStaticResources.zip', {compress: true}))
			.pipe(gulp.dest('./'));
	});

	gulp.task('copy', function(){
		return gulp.src(staticResources, { base:'.'})
			.pipe(gulp.dest('C:\\Maven\\Motivis\\resource-bundles\\UITEST.resource\\'));
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