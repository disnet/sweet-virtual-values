// Tainting works by providing a function `taint`
// that adds a dynamic taint to a value. Any operations
// on that tainted value propagate the taint.


/** begin tainting extension code **/

// standard unary and binary operations
var unaryOps = {
    "-":      function(x) { return -x; },
    "+":      function(x) { return +x; },
    "++":     function(x) { return ++x; },
    "--":     function(x) { return --x; },
    "!":      function(x) { return !x; },
    "~":      function(x) { return ~x; },
    "typeof": function(x) { return typeof x; },
    "void":   function(x) { return void x; }
};

var binaryOps = {
    "*":          function(l, r) { return l * r; },
    "/":          function(l, r) { return l / r; },
    "%":          function(l, r) { return l % r; },
    "+":          function(l, r) { return l + r; },
    "-":          function(l, r) { return l - r; },
    ">>":         function(l, r) { return l >> r; },
    "<<":         function(l, r) { return l << r; },
    ">>>":        function(l, r) { return l >>> r; },
    "<":          function(l, r) { return l < r; },
    "<=":         function(l, r) { return l <= r; },
    ">":          function(l, r) { return l > r; },
    ">=":         function(l, r) { return l >= r; },
    "in":         function(l, r) { return l in r; },
    "instanceof": function(l, r) { return l instanceof r; },
    "==":         function(l, r) { return l == r; },
    "!=":         function(l, r) { return l != r; },
    "===":        function(l, r) { return l === r; },
    "!==":        function(l, r) { return l !== r; },
    "&":          function(l, r) { return l & r; },
    "^":          function(l, r) { return l ^ r; },
    "|":          function(l, r) { return l | r; },
    "&&":         function(l, r) { return l && r; },
    "||":         function(l, r) { return l || r; }
};

// this object is used to identify proxies created
// by the `taint` function
var taintingKey = {};

function taint(originalValue) {
    // don't need to taint and already tainted value
    if (isTainted(originalValue)) {
        return originalValue;
    }

    var p = new Proxy(originalValue, {
        // store the original untainted value for later
        originalValue: originalValue,

        unary: function(target, op, operand) {
            // taint the result of a unary operation on a tainted value
            return taint(unaryOps[op](target));
        },

        left: function(target, op, right) {
            // taint the result of a binary operation on a tainted value
            return taint(binaryOps[op](target, right));
        },

        right: function(target, op, left) {
            // taint the result of a binary operation on a tainted value
            return taint(binaryOps[op](left, target));
        }
    }, taintingKey);
    return p;
}

function isTainted(x) {
    // a value is tainted if it's a proxy created
    // with the `taintingKey`
    if (unproxy(x, taintingKey)) {
        return true;
    }
    return false;
}

function untaint(value) {
    if (isTainted(value)) {
        // pulls the value out of its tainting proxy
        return unproxy(value, taintingKey).originalValue;
    }
    return value;
}

/** end tainting extension code **/


// User code for the tainting extension

// function to do some DB query related to users.
// The `user` string *must* be not be tainted.
function queryUser(user) {
    if (isTainted(user)) {
        throw new Error("Tainted value!");
    }
    // do the query
    // ...
    console.log("Success");
}

// Some sanitization routine that can strip the taint
// of the value.
function sanitize(str) {
    // do sanitization
    // ...
    return untaint(str);
} 

var username = taint("Robert`); DROP TABLE Students;");
try {
    queryUser("select * from Students where username = '" +
              username + "'");
} catch (e) {
    console.log("Cannot write a tainted value to the DB");
}
queryUser("select * from Students where username = '" +
          sanitize(username));
