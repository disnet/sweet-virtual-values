var expect = require("expect.js");

describe("virtual values", function() {
    var key = {};

    it("should override unary minus", function() {
        var p = new Proxy(4, {
            unary: function(target, op, value) {
                return null;
            }
        }, {});

        expect(- p).to.be(null);
    });

    it("should not clash with normal minus", function() {
        expect(- 10).to.be(-10);
    });

    it("should override binary plus", function() {
        var p = new Proxy(4, {
            left: function(target, op, right) {
                return null;
            },
            right: function(target, op, left) {
                return null;
            }
        }, {});

        expect(p + 10).to.be(null);
        expect(10 + p).to.be(null);
    });

    it("should not clash with normal plus", function() {
        expect(10 + 10).to.be(20);
        expect(null + 10).to.be(10);
        expect(Number.isNaN(undefined + 10)).to.be(true);
    });
})
