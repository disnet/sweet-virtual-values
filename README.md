# Sweet Virtual Values

Sweet Virtual Values is an extension to JavaScript [Proxies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) that uses [sweet.js](http://sweetjs.org) to allow you to trap operations on primitive values. This means that you can make some pretty wild extensions in just a few lines of code.

For example, in 50 lines of code you can implement complex numbers with native syntax.

```js
1.0 + (1.0 * i)
```

Or dynamic taint tracking.

```js
// taint the string
var username = taint("Robert`); DROP TABLE Students;");
// The `queryUser` function will check for tainted values and
// throw an error if they are tainted. Note that the
// taint propagates through string concatenation.
queryUser("select * from Students where username = '" + username + "'");
```

# Install

Install via npm:

```
npm install -g sweet-virtual-values
```

Compile and run in node:

```
vjs file.js | node --harmony
```

Or just compile to a file:

```
vjs -o out.js file.js
```

Running in node requires the `--harmony` flag and the `harmony-reflect` package (get it with `npm install harmony-reflect` if you are going to run it in your own project).

# Using

Sweet virtual values works by extending the Proxy handler API. Proxies can now wrap primitive values and can now understand three new traps: `unary` for unary operations, `left` for binary operations where the proxy is on the left, and `right` for binary operations where the proxy is on the right.


```js
var p = new Proxy(4, {

    // `target` is the wrapped value (`4` in this case)
    // `op` is a string representing the operation ("-", "!", etc.)
    unary: function(target, op) {
        // ...
    },

    // `target` is the wrapped value
    // `op` is a string representing the operation ("*", "+", etc.)
    // `right` is the value on the right-hand side of the operation
    left: function (target, op, right) {
        // ...
    },

    // right is only called if the value on the left is not a proxy
    // `target` is the wrapped value
    // `op` is a string representing the operation ("*", "+", etc.)
    // `left` is the value on the left-hand side of the operation
    right: function(target, op, left) {
        // ...
    }
}, {});
```

A trap can be omitted in which case the default behavior for each operation is performed.

In addition, there is a third argument to the `Proxy` constructor which is the `key` for that virtual value. This key is an object that can be used to retrieve the handler via the `unproxy` function.

```js
var handler = { /* ... */ };
var key = {};
var p = new Proxy(4, handler, key);

// ...

unproxy(p, key) === handler;
```

`unproxy` returns `null` if the key does not match.

This allow you to create multiple virtual value extensions and to detect if a value is a particular kind of extension based on its key.

