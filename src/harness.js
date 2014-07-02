var vvalues = (function() {
    if (typeof require === "function") {
        // importing patches Proxy
        require("harmony-reflect");
    }
    var unproxy = new WeakMap();
    var oldProxy = Proxy;

    // @ (Any, {}) -> VProxy
    function VProxy(value, handler) {
        function ValueShell(value) {this.value = value;}
        ValueShell.prototype.valueOf = function() {
            return this.value;
        }
        var valueShell = new ValueShell(value);
        var val = match value {
            undefined                   => valueShell,
            null                        => valueShell,
            x if typeof x !== 'object'  => valueShell,
            default                     => value
        }
        var p = new oldProxy(val, handler)
        unproxy.set(p, handler);
	    return p;
    }
    this.Proxy = VProxy;

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
        ("void", op)                   => void op
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
    var vunproxy = function(value) {
        if (isVProxy(value)) {
            return unproxy.get(value);
        }
        return null;
    }
    this.unproxy = vunproxy;
        
    return {
        unary: unary,
        binary: binary
    };
})();
