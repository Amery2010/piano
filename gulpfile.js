/**
 * project Piano
 * author Amery2010(https://www.xiangfa.org)
 * create 2017-12-06
 */

const gulp = require('gulp')
const clean = require('gulp-clean');
const rollup = require('gulp-rollup')
const babel = require('gulp-babel')
const eslint = require('gulp-eslint')
const uglify = require('gulp-uglify')
const sourcemaps = require('gulp-sourcemaps')

gulp.task('clean', () => {
  return gulp.src('./dist', { read: false })
    .pipe(clean());
});

gulp.task('move', ['javascript'], () => {
  // 复制除了 js 以外的所有资源文件
  return gulp.src(['./src/**/*', '!./src/javascripts/**/*'])
    .pipe(gulp.dest('./dist'))
})

gulp.task('javascript', () => {
  return gulp.src('./src/javascripts/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .pipe(sourcemaps.init())
    .pipe(rollup({
      input: './src/javascripts/main.js',
      format: 'iife'
    }))
    .pipe(babel({
      presets: ['es2015', 'stage-2']
    }))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/javascripts'))
})

gulp.task('build', ['clean'], () => {
  gulp.start('move')
})

gulp.task('start', ['clean'], () => {
  gulp.start('build', () => {
    gulp.watch('./src/**/*', ['build'])
  })
})
