var vvalues = function () {
        if (typeof require === 'function') {
            // importing patches Proxy
            require('harmony-reflect');
        }
        var unproxy = new WeakMap();
        var oldProxy = Proxy;
        // @ (Any, {}) -> VProxy
        function VProxy(value, handler) {
            var valueShell = {
                    valueOf: function () {
                        return value;
                    }
                };
            var val = function (a0) {
                    if (a0 === void 0) {
                        return valueShell;
                    }
                    if (a0 === null) {
                        return valueShell;
                    }
                    if (typeof a0 !== 'object') {
                        var x = a0;
                        return valueShell;
                    }
                    return value;
                }.call(this, value);
            var p = new oldProxy(val, handler);
            unproxy.set(p, handler);
            return p;
        }
        this.Proxy = VProxy;
        // @ (Any) -> Bool
        function isVProxy(value) {
            return value && typeof value === 'object' && unproxy.has(value);
        }
        // @ (Str, Any) -> Any
        function unary(a0, a1) {
            if (isVProxy(a1)) {
                var operator = a0;
                var op = a1;
                return unproxy.get(op).unary(operator, op);
            }
            if (a0 === '-') {
                var op = a1;
                return -op;
            }
            if (a0 === '+') {
                var op = a1;
                return +op;
            }
            if (a0 === '++') {
                var op = a1;
                return ++op;
            }
            if (a0 === '--') {
                var op = a1;
                return --op;
            }
            if (a0 === '!') {
                var op = a1;
                return !op;
            }
            if (a0 === '~') {
                var op = a1;
                return ~op;
            }
            if (a0 === 'typeof') {
                var op = a1;
                return typeof op;
            }
            if (a0 === 'void') {
                var op = a1;
                return void op;
            }
            throw new TypeError('No match');
        }
        // @ (Str, Any, Any) -> Any
        function binary(a0, a1, a2) {
            if (isVProxy(a1)) {
                var operator = a0;
                var left = a1;
                var right = a2;
                return unproxy.get(left).left(operator, right);
            }
            if (isVProxy(a2)) {
                var operator = a0;
                var left = a1;
                var right = a2;
                return unproxy.get(right).right(operator, left);
            }
            if (a0 === '*') {
                var left = a1;
                var right = a2;
                return left * right;
            }
            if (a0 === '/') {
                var left = a1;
                var right = a2;
                return left / right;
            }
            if (a0 === '%') {
                var left = a1;
                var right = a2;
                return left % right;
            }
            if (a0 === '+') {
                var left = a1;
                var right = a2;
                return left + right;
            }
            if (a0 === '-') {
                var left = a1;
                var right = a2;
                return left - right;
            }
            if (a0 === '>>') {
                var left = a1;
                var right = a2;
                return left >> right;
            }
            if (a0 === '<<') {
                var left = a1;
                var right = a2;
                return left << right;
            }
            if (a0 === '>>>') {
                var left = a1;
                var right = a2;
                return left >>> right;
            }
            if (a0 === '<') {
                var left = a1;
                var right = a2;
                return left < right;
            }
            if (a0 === '<=') {
                var left = a1;
                var right = a2;
                return left <= right;
            }
            if (a0 === '>') {
                var left = a1;
                var right = a2;
                return left > right;
            }
            if (a0 === '>=') {
                var left = a1;
                var right = a2;
                return left >= right;
            }
            if (a0 === 'in') {
                var left = a1;
                var right = a2;
                return left in right;
            }
            if (a0 === 'instanceof') {
                var left = a1;
                var right = a2;
                return left instanceof right;
            }
            if (a0 === '==') {
                var left = a1;
                var right = a2;
                return left == right;
            }
            if (a0 === '!=') {
                var left = a1;
                var right = a2;
                return left != right;
            }
            if (a0 === '===') {
                var left = a1;
                var right = a2;
                return left === right;
            }
            if (a0 === '!==') {
                var left = a1;
                var right = a2;
                return left !== right;
            }
            if (a0 === '&') {
                var left = a1;
                var right = a2;
                return left & right;
            }
            if (a0 === '^') {
                var left = a1;
                var right = a2;
                return left ^ right;
            }
            if (a0 === '|') {
                var left = a1;
                var right = a2;
                return left | right;
            }
            if (a0 === '&&') {
                var left = a1;
                var right = a2;
                return left && right;
            }
            if (a0 === '||') {
                var left = a1;
                var right = a2;
                return left || right;
            }
            throw new TypeError('No match');
        }
        // @ (Any) -> {} or null
        var vunproxy = function (value) {
            if (value && unproxy.has(value)) {
                return unproxy.get(value);
            }
            return null;
        };
        this.unproxy = vunproxy;
        return {
            unary: unary,
            binary: binary
        };
    }();