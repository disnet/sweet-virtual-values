operator ++ 15 { $op }     => #{ vvalues.unary("++", $op) }
operator -- 15 { $op }     => #{ vvalues.unary("--", $op) }
operator ! 14 { $op }      => #{ vvalues.unary("!", $op) }
operator ~ 14 { $op }      => #{ vvalues.unary("~", $op) }
operator + 14 { $op }      => #{ vvalues.unary("+", $op) }
operator - 14 { $op }      => #{ vvalues.unary("-", $op) }
operator typeof 14 { $op } => #{ vvalues.unary("typeof", $op) }
operator void 14 { $op }   => #{ vvalues.unary("void", $op) }

operator * 13 left { $left, $right }          => #{ vvalues.binary("*", $left, $right) }
operator / 13 left { $left, $right }          => #{ vvalues.binary("/", $left, $right) }
operator % 13 left { $left, $right }          => #{ vvalues.binary("%", $left, $right) }
operator + 12 left { $left, $right }          => #{ vvalues.binary("+", $left, $right) }
operator - 12 left { $left, $right }          => #{ vvalues.binary("-", $left, $right) }
operator >> 11 left { $left, $right }         => #{ vvalues.binary(">>", $left, $right) }
operator << 11 left { $left, $right }         => #{ vvalues.binary("<<", $left, $right) }
operator >>> 11 left { $left, $right }        => #{ vvalues.binary(">>>", $left, $right) }
operator < 10 left { $left, $right }          => #{ vvalues.binary("<", $left, $right) }
operator <= 10 left { $left, $right }         => #{ vvalues.binary("<=", $left, $right) }
operator >= 10 left { $left, $right }         => #{ vvalues.binary(">", $left, $right) }
operator > 10 left { $left, $right }          => #{ vvalues.binary(">=", $left, $right) }
operator in 10 left { $left, $right }         => #{ vvalues.binary("in", $left, $right) }
operator instanceof 10 left { $left, $right } => #{ vvalues.binary("instanceof", $left, $right) }
operator == 9 left { $left, $right }          => #{ vvalues.binary("==", $left, $right) }
operator != 9 left { $left, $right }          => #{ vvalues.binary("!=", $left, $right) }
operator === 9 left { $left, $right }         => #{ vvalues.binary("===", $left, $right) }
operator !== 9 left { $left, $right }         => #{ vvalues.binary("!==", $left, $right) }
operator & 8 left { $left, $right }           => #{ vvalues.binary("&", $left, $right) }
operator ^ 7 left { $left, $right }           => #{ vvalues.binary("^", $left, $right) }
operator | 6 left { $left, $right }           => #{ vvalues.binary("|", $left, $right) }
operator && 5 left { $left, $right }          => #{ vvalues.binary("&&", $left, $right) }
operator || 4 left { $left, $right }          => #{ vvalues.binary("||", $left, $right) }




