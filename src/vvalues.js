// 
import sweet from {"sweet.js" in node, "sweet" in browser, "./sweet" in amd}
"use strict";

function compile(code) {
    var macroStr = insert file "./macros/index.js"; 
    var harnessStr = insert file "./lib/harness.js";

    var expanded = sweet.compile(macroStr + "\n" + code);
    return harnessStr + "\n" + expanded.code;
}

return {
    compile: compile
};

