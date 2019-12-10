# Development

## Principles

- provide a readable regular expression building method
- Support raw values (bad requirements)
  If the user want to get `/[^\\]/`, the user can only need to input `\`.
- Support regular expression string input
- Support RegExp input
- richfull concatenate functions
- provide patterns for validation/match

## Use cases
- raw string to regexp string (bad requirement)

| Expected            | Method                      |
| ------------------- | --------------------------- |
| `'a.b' -> /a\\.b/`  | `toRegExpString('a.b')`     |
| `'^\]' -> /\^\\\]/` | `toRegExpSetString('^\\]')` |

- concat

| Expected      | Method                               |
| ------------- | ------------------------------------ |
| `x`           | `concat('x')`                        |
| `(x)`         | `concat('x', {group})`               |
| `(x)`         | `.groupBegin()`                      |
|               | `.concat('x')`                       |
|               | `.groupEnd()`                        |
| `(?:x)`       | `concat('x', {group, notRemember})`  |
| `(?<name>:x)` | `concat('x', {group, name: 'name'})` |
| `xy`          | `concat(['x', 'y'])`                 |
| `(x)(y)`      | `concat(['x', 'y'], {groupItem})`    |
| `(xy)`        | `concat(['x', 'y'], {group})`        |
| `x|y`         | `concatOr(['x', 'y'])`               |
| `(x)|(y)`     | `concatOr(['x', 'y'], {groupItem})`  |
| `(x|y)`       | `concatOr(['x', 'y'], {group})`      |
| `[x]`         | `concatSet('x')`                     |
| `[xyz]`       | `concatSet(['xy', 'z'])`             |
| `[^xyz]`      | `concatSet(['xy', 'z'], {negated})`  |
| `^x$`         | `concat('x').enableMatchAll()`       |
| `x(?=y)`      | `lookahead('x', 'y')`                |
| `x(?!y)`      | `negatedLookahead('x', 'y')`         |
| `(?<=y)x`     | `lookbehind('x', 'y')`               |
| `(?<!y)x`     | `negatedLookbehind('x', 'y')`        |

- define variables

| Expected      | Method                                            |
| ------------- | ------------------------------------------------- |
| `x`           | `define('<varName>', 'x')`                        |
| `x`           | `concat('x').stash('<varName>')`                  |
| `(x)`         | `define('<varName>', 'x', {group})`               |
| `(?:x)`       | `define('<varName>', 'x', {group, notRemember})`  |
| `(?<name>:x)` | `define('<varName>', 'x', {group, name: 'name'})` |
| `xy`          | `define('<varName>', ['x', 'y'])`                 |
| `(xy)`        | `define('<varName>', ['x', 'y'], {group})`        |
| `x|y`         | `defineOr('<varName>', ['x', 'y'])`               |
| `(x|y)`       | `defineOr('<varName>', ['x', 'y'], {group})`      |
| `[x]`         | `defineSet('<varName>', 'x')`                     |
| `[xyz]`       | `defineSet('<varName>', ['xy', 'z'])`             |
| `[^xyz]`      | `defineSet('<varName>', ['xy', 'z'], {negated})`  |
| `x(?=y)`      | `defineLookahead('<varName>', 'x', 'y')`          |
| `x(?!y)`      | `defineNegatedLookahead('<varName>', 'x', 'y')`   |
| `(?<=y)x`     | `defineLookbehind('<varName>', 'x', 'y')`         |
| `(?<!y)x`     | `defineNegatedLookbehind('<varName>', 'x', 'y')`  |

- define variables by using concat and stash

| Expected | Method                           |
| -------- | -------------------------------- |
| `x`      | `concat('x').stash('<varName>')` |

- use variable, same as concatnate
> If an input expression is a string, try to find if there is a variable with same name, otherwise use the expression directly.

| Expected      | Method                                |
| ------------- | ------------------------------------- |
| `[0-9a-zA-Z]` | `.define('digit', '0-9')`             |
|               | `.define('alphabetic', 'a-zA-Z')`     |
|               | `.concatSet(['digit', 'alphabetic'])` |
| `[0-9a-zA-Z]` | `.define('digit', '0-9')`             |
|               | `.concatSet(['digit', 'a-zA-Z'])`     |

```typescript
// /[0-9a-zA-Z]/
const re = new RegExpBuilder()
  .define('digit', '0-9')
  .define('alphabetic', 'a-zA-Z')
  .concatSet(['digit', 'alphabetic'])
```

## Tips
### When use `\` as escape character
- In a character set. `[abc]`
  - Escaping `^` only when `^` is the first character, e.g. `[\^]`;
		It is invalid: `[a\^]`.
  - Escaping `-` only when `-` is not the first or the last character, e.g. `[A\-Z]`;
		It is invalid: `[^\-Z]`, or `[A\-]`.
  - Escaping `\]`, e.g. `[\\\]]`;
  - Otherwise, cannot use `\`;
- In other places, it is using for special characters `[.^$?*+()[\]\\{}bBcdDfnrsStvwWxu]` and also any characters
  In face, there is only syntax limitations: it is invalid: `/\/`, `(\)`, using `\` at end of matched

### The or operation
`(ab)|(cd) === ab|cd`

### matchAll
In TypeScript, it is using `/^abc$/` as matchAll `/abc/`
