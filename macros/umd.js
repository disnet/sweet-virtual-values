macro import {
    rule {$moduleName from {$nodePath in node, 
                            $browserPath in browser, 
                            $amdPath in amd} 
          $body ...} => {
        (function (root, factory) {
            if (typeof define === 'function' && define.amd) {
                define([$amdPath], factory);
            } else if (typeof exports === 'object') {
                module.exports = factory(require($nodePath));
            } else {
                root.returnExports = factory(root[$browserPath])
            }
        }(this, function($moduleName) {
            $body ...
        }));
    }
}
export import;

macro insert {
    case {_ file $fname } => {
        var path = require("path");
        var fs = require("fs");
        var file  = path.join(path.dirname(fs.realpathSync(__filename)), 
                              unwrapSyntax(#{$fname}));
        var harnessStr = fs.readFileSync(unwrapSyntax(#{$fname}), 'utf8');
        letstx $content = [makeValue(harnessStr, #{here})];
        return #{ '$content' }
    }
}
export insert;
