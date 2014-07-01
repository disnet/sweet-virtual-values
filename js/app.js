// returns the log array
function cleanerEval(str, oldConsole) {
	var logArr = [];
    var console = {
        log: function(msg) {
		    logArr.push(msg);
            oldConsole.log(msg);
        }
    }
	eval(str);
	return logArr;
}

$(document).ready(function() {
    var vvalues = returnExports;
	var editor, compiled;

	function updateExamples() {
		var exampleText = $(this).find("pre").text();
		editor.setValue(exampleText)
	}

	function updateCompiled() {
		$("#error-box").hide();
		$("#run-box").hide();
		try {
			var out = vvalues.compile(editor.getValue(), {
				readableNames: true
			});
			compiled.setValue(out);
			var logArr = cleanerEval(out, console);
			var logHtml = logArr.map(function(l) {
				return "<p>Log: " + l + "</p>";
			})
			$("#run-box").show().html("<h4 class='success-label'>Success</h4>"+ 
									  logHtml.join("\n"));

		} catch (e) {
			$("#error-box").show();
			$("#error-box").html("<pre>" + e + "</pre>");
		}
	}

	function init() {
		editor = CodeMirror.fromTextArea($("#editor")[0], {
			mode: "javascript",
			lineNumbers: true
		});

		compiled = CodeMirror.fromTextArea($("#compiled")[0], {
			mode: "javascript",
			lineNumbers: true,
			readOnly: true
		});

		$("#btn-examples li").click(updateExamples);
		$("#btn-run").click(updateCompiled)

		$("#btn-examples li:first").trigger("click");
	}

    init();
});
