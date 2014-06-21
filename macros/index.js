macro virtualValues {
    case {_ require($path) } => {
        return #{
            vvalues = require($path);
        }
    }
    case {_ require } => {
        return #{
            vvalues = require("virtual-values.js");
        }
    }
}

export virtualValues;

let VProxy = macro {
    case {_ ($params ...) } => {
        return #{
            vvalues.VProxy($params ...)
        }
    }
}
export VProxy;

operator - 14 { $op } => #{ vvalues.unary("-", $op) }
export -;
