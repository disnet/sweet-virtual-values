var vvalues = (function() {
    if (typeof require === "function") {
        // importing patches Proxy to be in line with the new direct proxies
        require("harmony-reflect");
    }

    // hold on to all the proxies we create so that we can retrieve the handlers later
    var unproxyMap = new WeakMap();

    var oldProxy = Proxy;

    // primitive values cannot be used a keys inside of a map so we
    // need to wrap them up in a shell object that returns the original
    // value when needed
    function ValueShell(value) {this.value = value;}
    ValueShell.prototype.valueOf = function() {
        return this.value;
    }

    // @ (Any, {}, {}) -> VProxy
    function VProxy(value, handler, key) {

        var valueShell = new ValueShell(value);
        var val = match value {
            undefined                   => valueShell,
            null                        => valueShell,
            x if typeof x !== 'object'  => valueShell,
            default                     => value
        }

        var p = new oldProxy(val, handler)
        unproxyMap.set(p, {
            handler: handler,
            key: key,
            target: val
        });
	    return p;
    }
    this.Proxy = VProxy;

    // @ (Any) -> Bool
    function isVProxy(value) {
        return value && typeof value === 'object' && unproxyMap.has(value);
    }

    // @ (Str, Any) -> Any
    function unary {
        (operator, op) if isVProxy(op) => {
            var target = unproxyMap.get(op).target;
            return unproxyMap.get(op).handler.unary(target, operator, op);
        },
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
        (operator, left, right) if isVProxy(left)  => {
            var target = unproxyMap.get(left).target;
            return unproxyMap.get(left).handler.left(target, operator, right);
        },
                            
        (operator, left, right) if isVProxy(right) => {
            var target = unproxyMap.get(right).target;
            return unproxyMap.get(right).handler.right(target, operator, left);
        },
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
    this.unproxy = function(value, key) {
        if (isVProxy(value) && unproxyMap.get(value).key === key) {
            return unproxyMap.get(value).handler;
        }
        return null;
    };
        
    return {
        unary: unary,
        binary: binary
    };
})()
