// returns the log array
function cleanerEval(str, oldConsole) {
	var logArr = [];
    var console = {
        log: function(msg) {
		    logArr.push(msg);
            oldConsole.log(msg);
        }
    };
	eval(str);
	return logArr;
}


var examples = [
    {
        id: 1,
        file: "complex.js",
        title: "Complex Numbers"
    },
    {
        id: 2,
        file: "taint.js",
        title: "Tainting"
    },
    {
        id: 3,
        file: "units.js",
        title: "Units of measure"
    }
];

var editor, compiled;
var vvalues = returnExports;
App = Ember.Application.create({});

App.Router.map(function() {
    this.route("about");
    this.resource("examples", { path: "/"}, function() {
        this.resource("example", {path: ":example_id"});
    });
});


App.ExamplesController = Ember.ObjectController.extend({
    errors: "",
    logs: [],
    run: false,
    currentTitle: "Examples",

    actions: {
        select: function(example) {
            Ember.$.ajax("examples/" + example.file, {
                dataType: "text"
            }).then(function(code) {
                editor.setValue(code);
            });
            this.set("currentTitle", example.title);
        },
        run: function() {
            this.set("errors", "");
		    try {
			    var out = vvalues.compile(editor.getValue(), {
				    readableNames: true
			    });
			    compiled.setValue(out);
			    var logArr = cleanerEval(out, console);
                this.set("run", true);
                this.set("logs", logArr.map(function(l) {
                    return { l: l };
                }));

		    } catch (e) {
                this.set("errors", e);
		    }
        }
    }
});

App.ExamplesRoute = Ember.Route.extend({
    model: function() {
        return examples;
    }

});

App.ExamplesView = Ember.View.extend({
    didInsertElement: function() {
        editor = CodeMirror.fromTextArea($("#editor")[0], {
	        mode: "javascript",
	        lineNumbers: true
        });

        compiled = CodeMirror.fromTextArea($("#compiled")[0], {
	        mode: "javascript",
	        lineNumbers: true,
	        readOnly: true
        });
    }
});

App.ExampleRoute = Ember.Route.extend({
    model: function(params) {
        return examples.findBy("id", params.example_id);
    }
});
