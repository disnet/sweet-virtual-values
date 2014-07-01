module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks("grunt-sweet.js");
    var path = require("path");

    grunt.initConfig({
        build: {
            tests: {
                src: "tests/*.js",
                dest: "build/"
            }
        },
        sweetjs: {
            options: {
                sourceMap: false,
                readableNames: true
            },
            build: {
                options: {
                    modules: ["sparkler/macros", "./macros/umd.js"]
                },
                expand: true,
                flatten: true,
                src: "src/*.js",
                dest: "lib"
            }
        },


        mochaTest: {
            options:{
                colors: !grunt.option('no-color')
            },
            src: ["build/*.js"],
        }
    });
    
    grunt.registerMultiTask("build", function() {
        var vvalues = require("./lib/vvalues");
        this.files.forEach(function(f) {
            var dest = Array.isArray(f.dest) ? f.dest : [f.dest];
            f.src.forEach(function(file) {
                grunt.log.writeln("compiling " + file);
                var code = grunt.file.read(file);
                var compiled = vvalues.compile(code);
                
                dest.forEach(function(dest) {
                    grunt.log.writeln("writing to " + dest + path.basename(file));
                    grunt.file.write(dest + path.basename(file),
                                     compiled);
                });
            });
        });
    });

    grunt.registerTask("default", ["sweetjs",
                                   "build",
                                   "mochaTest"]);
};
