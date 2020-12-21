'use strict';

var gulp    = require('gulp'),
    gp      = require('gulp-load-plugins')(),
browserSync = require('browser-sync').create();

gulp.task('serve', function(){
    browserSync.init({
        server: {
            baseDir: './build'
        }
    });
});

gulp.task('fonts', function(){
    return gulp.src(['src/css/*/*.*','src/css/ajax-loader.gif'])
        .pipe(gulp.dest('build/css/'))
});

gulp.task('js', function(){
    return gulp.src('src/js/*.js')
        .pipe(gulp.dest('build/js/'))
        .on('end', browserSync.reload);
});

gulp.task('img:dev', function(){
    return gulp.src('src/images/*.{png,jpg,gif}')
        .pipe(gulp.dest('build/images/'))
});

gulp.task('img:build', function(){
    return gulp.src('src/images/*.{png,jpg}')
        .pipe(gp.tinypng('LzplV4cCvFsvyvbHDy99W8GlqmSdfHYr'))
        .pipe(gulp.dest('build/images/'))
});

gulp.task('css:build', function(){
    return gulp.src('src/css/*.css')
        .pipe(gp.sourcemaps.init())
        .pipe(gp.autoprefixer())
        .pipe(gp.csso())
        .pipe(gp.sourcemaps.write())
        .pipe(gulp.dest('build/css/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('css:dev', function(){
    return gulp.src('src/css/*.css')
        .pipe(gulp.dest('build/css/'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('html', function(){
    return gulp.src('src/*.html')
        .pipe(gulp.dest('build/'))
        .on('end', browserSync.reload);
});

gulp.task('watch', function(){
    gulp.watch('src/js/*.js', gulp.series('js'));
    gulp.watch('src/css/*.css',gulp.series('css:dev'));
    gulp.watch('src/**/*.html', gulp.series('html'));
    gulp.watch('src/images/*', gulp.series('img:dev'));
});

gulp.task('default', gulp.series(
    gulp.parallel('fonts', 'js', 'css:dev', 'html', 'img:dev'),
    gulp.parallel('watch', 'serve')
));

gulp.task('build', gulp.series(
    gulp.parallel('fonts', 'js', 'css:build', 'html'),
    gulp.parallel('watch', 'serve')
));