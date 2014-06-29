module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks("grunt-sweet.js");

    grunt.initConfig({
        sweetjs: {
            options: {
                sourceMap: true,
                readableNames: true
            },
            build: {
                options: {
                    modules: ["sparkler/macros"]
                },
                expand: true,
                flatten: true,
                src: "lib/*.js",
                dest: "build/lib"
            },
            tests: {
                options: {
                    modules: ["./macros/index.js"]
                },
                expand: true,
                flatten: true,
                src: "tests/*.js",
                dest: "build/"
            }
        },


        mochaTest: {
            options:{
                colors: !grunt.option('no-color')
            },
            src: ["build/*.js"],
        }
    });

    grunt.registerTask("default", ["sweetjs",
                                   "mochaTest"]);
};
