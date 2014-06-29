var sweet = require("sweet.js");
var reflect = require("harmony-reflect");

var unproxy = new WeakMap();

// @ (Any, {}) -> VProxy
function VProxy(value, handler) {
    var valueShell = {
        valueOf: function() {
            return value;
        }
    };
    var val = match value {
        undefined                   => valueShell,
        null                        => valueShell,
        x if typeof x !== 'object'  => valueShell,
        default                     => value
    }
    var p = new Proxy(val, handler)
    unproxy.set(p, handler);
	return p;
}

// @ (Any) -> Bool
function isVProxy(value) {
    return value && typeof value === 'object' && unproxy.has(value);
}

// @ (Str, Any) -> Any
function unary {
    (operator, op) if isVProxy(op) => unproxy.get(op).unary(operator, op),
    ("-", op)                      => -op,
    ("+", op)                      => +op,
    ("++", op)                     => ++op,
    ("--", op)                     => --op,
    ("!", op)                      => !op,
    ("~", op)                      => ~op,
    ("typeof", op)                 => typeof op,
    ("void", op)                   => void op,
    ("delete", op)                 => delete op
}

// @ (Str, Any, Any) -> Any
function binary {
    (operator, left, right) if isVProxy(left)  => unproxy.get(left).left(operator, right),
    (operator, left, right) if isVProxy(right) => unproxy.get(right).right(operator, left),
    ("*", left, right)                         => left * right,
    ("/", left, right)                         => left / right,
    ("%", left, right)                         => left % right,
    ("+", left, right)                         => left + right,
    ("-", left, right)                         => left - right,
    (">>", left, right)                        => left >> right,
    ("<<", left, right)                        => left << right,
    (">>>", left, right)                       => left >>> right,
    ("<", left, right)                         => left < right,
    ("<=", left, right)                        => left <= right,
    (">", left, right)                         => left > right,
    (">=", left, right)                        => left >= right,
    ("in", left, right)                        => left in right,
    ("instanceof", left, right)                => left instanceof right,
    ("==", left, right)                        => left == right,
    ("!=", left, right)                        => left != right,
    ("===", left, right)                       => left === right,
    ("!==", left, right)                       => left !== right,
    ("&", left, right)                         => left & right,
    ("^", left, right)                         => left ^ right,
    ("|", left, right)                         => left | right,
    ("&&", left, right)                        => left && right,
    ("||", left, right)                        => left || right,
}

// @ (Any) -> {} or null
exports.unproxy = function(value) {
    if (value && unproxy.has(value)) {
        return unproxy.get(value);
    }
    return null;
}

exports.VProxy = VProxy;
exports.unary = unary;
exports.binary = binary;
exports.isVProxy = isVProxy;
