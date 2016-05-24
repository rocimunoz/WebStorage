    /*
     * Dependencias
     */
    var gulp = require('gulp'),
        concat = require('gulp-concat'),
        uglify = require('gulp-uglify');

    var handlebars = require('gulp-handlebars');
    var wrap = require('gulp-wrap');
    var declare = require('gulp-declare');
    /*
     * Configuración de las tareas 'demo'
     */

    var tinylr;
    gulp.task('livereload', function() {
        tinylr = require('tiny-lr')();
        tinylr.listen(35729);
    });


    gulp.task('watch', function() {
        gulp.watch('*.html', notifyLiveReload);
        gulp.watch('css/*.css', notifyLiveReload);
    });


    gulp.task('express', function() {
        var express = require('express');
        var app = express();
        app.use(require('connect-livereload')({ port: 4002 }));
        app.use(express.static(__dirname));
        app.listen(4000, '0.0.0.0');
    });


    gulp.task('templates', function() {
        gulp.src('src/templates/*.hbs')
            .pipe(handlebars())
            .pipe(wrap('Handlebars.template(<%= contents %>)'))
            .pipe(declare({
                namespace: 'MyApp.templates',
                noRedeclare: true, // Avoid duplicate declarations 
            }))
            .pipe(concat('templates.js'))
            .pipe(gulp.dest('build/js/'));
    });

    gulp.task('default', ['express', 'livereload', 'watch', 'templates'], function() {

    });


    function notifyLiveReload(event) {
        var fileName = require('path').relative(__dirname, event.path);

        tinylr.changed({
            body: {
                files: [fileName]
            }
        });
    }
