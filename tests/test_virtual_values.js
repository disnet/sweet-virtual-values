var expect = require("expect.js");
virtualValues require("./lib/virtual-values.js")

describe("virtual values", function() {
    it("should override unary minus", function() {
        var p = new VProxy(4, {
            unary: function(op, value) {
                return null;
            }
        });

        expect(- p).to.be(null);
    });

    it("should not clash with normal minus", function() {
        expect(- 10).to.be(-10);
    })
})
