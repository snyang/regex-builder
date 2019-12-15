# regex-builder
Building readable JavaScript/TypeScript regular expressions gracefully.

## Introduction

The regex-builder is using fluent APIs (with nested parameters) to help you to build regular expressions in a readable way.

- Sample: Check IPv4

Let's see how to use the util to define a IPv4 address in decimal number.
IPv4 address is presented in format of: `<0-255>.<0-255>.<0-255>.<0-255>`.
There are two elements, one is decimal number which is from 0 to 255, and another element is `.`.
We can define the decimal part as `subIP: /\d|\d\d|[1]\d\d|2[0-4]\d|25[0-5]/`
and the do element as `dot: /\./`

**For example:**
```typescript
const subIP = /(\d|\d\d|1\d\d|2[0-4]\d|25[0-5])/;
const dot = /\./;
const ipv4Exp = RegExpBuilder.new()
	.join([
		subIP,
		dot,
		subIP,
		dot,
		subIP,
		dot,
		subIP,
	])
	.enableMatchWhole()
	.toRegExp();

console.log(ipv4Exp.test('192.168.0.1')); // true
console.log(ipv4Exp.test('192-168-0-1')); // false
```

- If you like fluent API, you can use the define-build pattern.

You can define elements `sub-ip` and `dot` as variables and use them later.
**For example:**

```typescript
const ipv4Exp = RegExpBuilder.new()
	.define('sub-ip', /(\d|\d\d|1\d\d|2[0-4]\d|25[0-5])/)
	.define('dot', /\./)
	.join([
		'sub-ip',
		'dot',
		'sub-ip',
		'dot',
		'sub-ip',
		'dot',
		'sub-ip',
	])
	.enableMatchWhole()
	.toRegExp();

console.log(ipv4Exp.test('192.168.0.1')); // true
console.log(ipv4Exp.test('192-168-0-1')); // false
```

- For complex variables, you use build-stash-build pattern.
The `stash()` method will save the current result as a variable, then get the object cleared.
**For example:**
```typescript
const ipv4Exp = RegExpBuilder.new()
	.group(
		RegExpBuilder.new().or(
			[
				/\d/,
				/\d\d/,
				/1\d\d/,
				/2[0-4]\d/,
				/25[0-5]/,
			],
		),
	)
	.stash('sub-ip')
	.define('dot', /\./)
	.join([
		'sub-ip',
		'dot',
		'sub-ip',
		'dot',
		'sub-ip',
		'dot',
		'sub-ip',
	])
	.enableMatchWhole()
	.toRegExp();

console.log(ipv4Exp.test('192.168.0.1')); // true
console.log(ipv4Exp.test('192-168-0-1')); // false
```

## Main classes

### RegExpBuilder

| Method                      | Description                                                 |
| --------------------------- | ----------------------------------------------------------- |
| **static methods:**         |                                                             |
| `encodeRegExp`              | Encode a raw string to a regular expression string.         |
|                             | For example, it will convert `. -> \.`                      |
| `new()`                     | Create an instance of RegExpBuilder                         |
| **instance methods:**                            |                                                             |
| `join()`                    | Append an expression, .e.g `xyz`                            |
| `group()`                   | Append a group expression, e.g. `(xyz)`                     |
| `or()`                      | Append an or expression, e.g. `x|y|z)`                      |
| `set()`                     | Append a set expression, e.g. `[xyz]`                       |
| `negatedSet()`              | Append a negated set expression, e.g. `[^xyz]`              |
| `lookahead()`               | Append a lookahead expression, e.g. `x(?=y)`                |
| `negatedLookahead()`        | Append a negated lookahead expression, e.g. `x(?!y)`        |
| `lookbehind()`              | Append a lookbehind expression, e.g. `(?<=y)x`              |
| `negatedLookbehind()`       | Append a negated lookbehind expression, e.g. `(?<!y)x`      |
|                             |                                                             |
| `define()`                  | Define an expression, .e.g `xyz`                            |
| `defineGroup()`             | Define a group expression, e.g. `(xyz)`                     |
| `defineOr()`                | Define an or expression, e.g. `x|y|z)`                      |
| `defineSet()`               | Define a set expression, e.g. `[xyz]`                       |
| `defineNegatedSet()`        | Define a negated set expression, e.g. `[^xyz]`              |
| `defineLookahead()`         | Define a lookahead expression, e.g. `x(?=y)`                |
| `defineNegatedLookahead()`  | Define a negated lookahead expression, e.g. `x(?!y)`        |
| `defineLookbehind()`        | Define a lookbehind expression, e.g. `(?<=y)x`              |
| `defineNegatedLookbehind()` | Define a negated lookbehind expression, e.g. `(?<!y)x`      |
|                             |                                                             |
| `stash()`                   | Define an expression from the current state.                |
|                             |                                                             |
| `source`                    | Get the source of the current state.                        |
| `toRegExp()`                | Get the RegExp instance of the current state.               |
| `enableMatchWhole`          | Enable the expression to match the whole string. e.g. `^x$` |
| `beginGroup`                | Begin a group expression. e.g. `(`                          |
| `endGroup`                  | End the group expression, e.g. ')'                          |

### RegExpOptions


## References
[Regular Expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)
