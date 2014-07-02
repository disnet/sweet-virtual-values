function isTainted(x) {
    if (unproxy(x)) {
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
        unary: function(op, operand) {
            return taint(unaryOps[op](originalValue));
        }
    });
    return p;
}

function untaint(value) {
    if (isTainted(value)) {
        return unproxy(value).originalValue;
    }
    return value;
}

var t = taint("helo, world");

console.log(isTainted(t));
console.log(unproxy(t));
console.log(untaint(t));

console.log(isTainted(-t));
console.log(-t);
