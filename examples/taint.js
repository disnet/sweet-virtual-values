// using object identity as a key for the tainting proxy
var taintingKey = {};

function isTainted(x) {
    if (unproxy(x, taintingKey)) {
        return true;
    }
    return false;
}

var unaryOps = {
    "-": function(x) { return -x; }
};

function taint(originalValue) {
    if (isTainted(originalValue)) {
        return originalValue;
    }
    var p = new Proxy(originalValue, {
        originalValue: originalValue,
        unary: function(target, op, operand) {
            return taint(unaryOps[op](target));
        }
    }, taintingKey);
    return p;
}

function untaint(value) {
    if (isTainted(value)) {
        return unproxy(value, taintingKey).originalValue;
    }
    return value;
}


function queryUser(user) {
    if (isTainted(user)) {
        throw new Error("Tainted value!");
    }
    // do the query
    // ...
    console.log("Success");
}

function sanitize(str) {
    // do sanitization
    // ...
    return untaint(str);
} 

var username = taint("Robert`); DROP TABLE Students;");
try {
    queryUser("select * from Students where username = '" + username + "'");
} catch (e) {
    console.log("Cannot write a tainted value to the DB");
}
queryUser("select * from Students where username = '" + sanitize(username));
