var key = {};

function UnitError(msg) {
    this.message = msg;
}
UnitError.prototype = new Error();

var unaryOps = {
    "-": function(unitName, index, value) {
        return makeQuantity(unitName, index, -value);
    }
};

var leftOps = {
    "+": function(unit, index, value, right) {
        // drop unit makes sure that we are adding the same units
        return makeQuantity(unit, index, (value + dropUnit(unit, index, right)));
    },
    "*": function(unit, index, value, right) {
        return makeQuantity(unit, index, (value * right));
    },
    "/": function(unit, index, value, right) {
        return makeQuantity(unit, index, (value / right));
    },
    "===": function(unit, index, value, right) {
        return value === dropUnit(unit, index, right);
    }
};

var rightOps = {
    "+": function(unit, index, value, left) {
        throw new UnitError("Incompatible types");
    },
    "*": function(unit, index, value, left) {
        return makeQuantity(unit, index, (left * value));
    },
    "/": function(unit, index, value, left) {
        return makeQuantity(unit, -index, (left / value));
    }
};

function U() {}
U.prototype.toString = function() {
    var handler = unproxy(this, key);
    return handler.value.toString() + " " + handler.unit + "^" + handler.index;
};

function makeQuantity(unitName, index, value) {
    var handler = unproxy(value, key);
    if (index === 0) {          // drop zero-ary units
        return n;
    } else if (handler) {
        if (handler.unit === unitName) { // same unit avoid duplicates
            return makeQuantity(unitName, handler.index + index, handler.value);
        } else if (handler.unit > unitName) { // keep the proxies ordered
            return makeQuantity(handler.unit, handler.index, makeQuantity(unitName, index, handler.value));
        }
    }
    return new Proxy(new U(), {
        unit: unitName,
        index: index,
        value: value,
        unary: function(target, op) {
            return unaryOps[op](unitName, index, value);
        },
        left: function(target, op, right) {
            return leftOps[op](unitName, index, value, right);
        },
        right: function(target, op, left) {
            return rightOps[op](unitName, index, value, left);
        }
    }, key);
}

function dropUnit(unit, index, value) {
    var handler = unproxy(value, key);
    var valueUnit = "<no unit>";
    if(handler) {
        if (handler.unit === unit && handler.index === index) {
            return handler.value;
        }
        valueUnit = handler.unit;
    }
    throw new UnitError("Incompatible units: " + unit + " is not compatible with " + valueUnit);
}

function makeUnit(unit) {
    return makeQuantity(unit, 1, 1);
}

// begin user code

var meter = makeUnit("meter");
var second = makeUnit("second");
var g = 9.81 * meter / second / second;

console.log(g + 1);
