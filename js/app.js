$(document).ready(function() {
	var editor = CodeMirror.fromTextArea($("#editor")[0], {
		mode: "javascript",
		lineNumbers: true
	});

	var compiled = CodeMirror.fromTextArea($("#compiled")[0], {
		mode: "javascript",
		lineNumbers: true,
		readOnly: true
	});

	$("#btn-examples li").click(function(e) {
		var exampleText = $(this).find("pre").text();
		editor.setValue(exampleText)
	})
})
