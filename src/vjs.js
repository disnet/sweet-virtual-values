var yargs = require("yargs")
             .usage("Usage: $0 [path]")
             .alias("o", "output")
             .boolean("h")
             .alias("h", "help")
             .demand(1);

var argv = yargs.argv;

var vvalues = require('./vvalues');
var fs = require("fs");

exports.run = function() {
    var infile = argv._[0];
    var outfile = argv.output;

    var code = fs.readFileSync(infile, "utf8");
    var compiled = vvalues.compile(code);

    if (outfile) {
        fs.writeFileSync(outfile, compiled);
    } else {
        console.log(compiled);
    }
}
