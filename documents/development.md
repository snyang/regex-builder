# Development

## Publish steps

- change the package version
- build: run `npm run build`
- pack: run `npm pack`
- check the package
- publish: `npm publish --access public`

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

### The or operation is in low priority
`(ab)|(cd) === ab|cd`

### The qualifier operation are in high priority
`a(b*) === ab*`

### match the whole string
In TypeScript, it is using `/^abc$/`.
