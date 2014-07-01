var unproxy = new WeakMap();

Str = function(x, blame) {
	var extraBlame = [];
	if (typeof x === 'object' && x && unproxy.has(x)) {
		extraBlame = "\nExtra blame labels: " + unproxy.get(x).labels;
	}
	if (typeof x !== 'string') {
		throw Error("The value " + x + " is not a String\n" +
					"Blaming " + blame + extraBlame);
	}
	if (typeof x === "object" && unproxy.has(x)) {
		if (unproxy.get(x).labels.indexOf(blame) === -1) {
			unproxy.get(x).labels.push(blame);
		}
	}
	return x;
}

Void = function(x, blame) {
	if (x == null) {
		if (typeof x === "object" && unproxy.has(x)) {
			if (unproxy.get(x).labels.indexOf(blame) === -1) {
				unproxy.get(x).labels.push(blame);
			}
		}
		return x;
	}
	throw Error("The value " + x + " is not null or undefined\nBlaming " + blame);
}

Any = function(x, blame) { 
	if (typeof x === "object" && unproxy.has(x)) {
		if (unproxy.get(x).labels.indexOf(blame) === -1) {
			unproxy.get(x).labels.push(blame);
		}
	}
	return x; 
}

Dyn = function(x, blame) {
	var y = {
		valueOf: function() {
			return x;
		}
	};
	var p = new Proxy(y, {});	
	unproxy.set(p, {
		labels: [blame]
	});
	return p;
}