var sweet = require("sweet.js");
var reflect = require("harmony-reflect");

var unproxy = new WeakMap();

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

function unary {
    // boring: null, undefined and non-objects
    ("-", op) if op == null                  => -op,
    ("-", op) if typeof op !== 'object'      => -op,
    ("+", op) if op == null                  => +op,
    ("+", op) if typeof op !== 'object'      => +op,
    ("new", op) if op == null                => new op,
    ("new", op) if typeof op !== 'object'    => new op,
    ("++", op) if op == null                 => ++op,
    ("++", op) if typeof op !== 'object'     => ++op,
    ("--", op) if op == null                 => --op,
    ("--", op) if typeof op !== 'object'     => --op,
    ("!", op) if op == null                  => !op,
    ("!", op) if typeof op !== 'object'      => !op,
    ("~", op) if op == null                  => ~op,
    ("~", op) if typeof op !== 'object'      => ~op,
    ("typeof", op) if op == null             => typeof op,
    ("typeof", op) if typeof op !== 'object' => typeof op,
    ("void", op)  if op == null              => void op,
    ("void", op) if typeof op !== 'object'   => void op,
    ("delete", op) if op == null             => delete op,
    ("delete", op) if typeof op !== 'object' => delete op,
    // might be in the unproxy map
    ("-", op) if unproxy.has(op)             => unproxy.get(op).unary("-", op),
    ("-", op)                                => -op,
    ("+", op) if unproxy.has(op)             => unproxy.get(op).unary("+", op),
    ("+", op)                                => +op,
    ("new", op) if unproxy.has(op)           => unproxy.get(op).unary("new", op),
    ("new", op)                              => new op,
    ("++", op) if unproxy.has(op)            => unproxy.get(op).unary("++", op),
    ("++", op)                               => ++op,
    ("--", op) if unproxy.has(op)            => unproxy.get(op).unary("--", op),
    ("--", op)                               => --op,
    ("!", op) if unproxy.has(op)             => unproxy.get(op).unary("!", op),
    ("!", op)                                => !op,
    ("~", op) if unproxy.has(op)             => unproxy.get(op).unary("~", op),
    ("~", op)                                => ~op,
    ("typeof", op) if unproxy.has(op)        => unproxy.get(op).unary("typeof", op),
    ("typeof", op)                           => typeof op,
    ("void", op) if unproxy.has(op)          => unproxy.get(op).unary("void", op),
    ("void", op)                             => void op,
    ("delete", op) if unproxy.has(op)        => unproxy.get(op).unary("delete", op),
    ("delete", op)                           => delete op
}

exports.unproxy = function(value) {
    if (value && unproxy.has(value)) {
        return unproxy.get(value);
    }
}


exports.VProxy = VProxy;
exports.unary = unary;