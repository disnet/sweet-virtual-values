/** begin complex numbers extension code **/

var key = {};

var unaryOps = {
    "-": function(real, img) {
        return makeComplex(-real, -img);
    }
    // ...
};

var binaryOps = {
    "+": function(lReal, lImg, rReal, rImg) {
        return makeComplex(lReal + rReal, lImg + rImg);
    },
    "-": function(lReal, lImg, rReal, rImg) {
        return makeComplex(lReal - rReal, lImg - rImg);
    },
    "*": function(lReal, lImg, rReal, rImg) {
        return makeComplex((lReal * rReal) - (lImg * rImg),
                           (lImg * rReal) + (lReal * rImg));
    },
    "/": function(lReal, lImg, rReal, rImg) {
        return makeComplex(((lReal * rReal) + (lImg * rImg)) / ((rReal * rReal) + (rImg * rImg)),
                           ((lImg * rReal - lReal * rImg) / ((rReal * rReal) + (rImg * rImg))));
    },
    "===": function(lReal, lImg, rReal, rImg) {
        return (lReal === rReal) && (lImg === rImg);
    }
    // ...
};

function C() {}
C.prototype.toString = function() {
    var handler = unproxy(this, key);
    return handler.real + " + " + handler.img + "i";
};

function makeComplex(real, img) {
    var p = new Proxy(new C(), {
        real: real,
        img: img,
        unary: function(target, op) {
            return unaryOps[op](real, img);
        },

        left: function(target, op, right) {
            var rhandler = unproxy(right, key);
            if (rhandler) {
                return binaryOps[op](real, img, rhandler.real, rhandler.img);
            } else {
                return binaryOps[op](real, img, right, 0);
            }
        },
        right: function(target, op, left) {
            return binaryOps[op](left, 0, real, img);
        }
    }, key);
    return p;
}

function isComplex(value) {
    if(unproxy(value, key)) {
        return true;
    }
    return false;
}

var i = makeComplex(0, 1);

/** end complex numbers extension code **/

// user code for the complex numbers extension

var result = 1 + (1 * i) - (100 + (3 * i));

console.log(result.toString());
