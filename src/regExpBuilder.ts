/**
 * Regular Expression Builder
 * 
 * @see [Regular Expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)
 */
export default class RegExpBuilder {
	/**
	 * `\`, backslash.
	 * @see [backslash](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#special-backslash)
	 */
	static get backslash(): string {
		return '\\';
	}

	/**
	 * `^`,
	 * Matches beginning of input. 
	 * If the multiline flag is set to true, also matches immediately after a line break character.
	 * 
	 * @see: [Caret](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#special-caret)
	 */
	static get begin(): RegExp {
		return /^/;
	}

	/**
	 * `$`,
	 * Matches end of input. 
	 * If the multiline flag is set to true, also matches immediately before a line break character.
	 * 
	 * @see [dollar](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#special-dollar)
	 */
	static get end(): RegExp {
		return /$/;
	}

	/**
	 * `*`,
	 * Matches the preceding expression 0 or more times. Equivalent to `{0,}`.
	 * 
	 * @see [asterisk](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#special-asterisk)
	 */
	static get more(): string {
		return this.asterisk;
	}

	/**
	 * `*`,
	 * Matches the preceding expression 0 or more times. Equivalent to `{0,}`.
	 * 
	 * @see [asterisk](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#special-asterisk)
	 */
	static get asterisk(): string {
		return '*';
	}

	/**
	 * `+`,
	 * Matches the preceding expression 1 or more times. Equivalent to `{1,}`.
	 * 
	 * @see [plus](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#special-plus)
	 */
	static get oneOrMore(): string {
		return this.plus;
	}

	/**
	 * `+`,
	 * Matches the preceding expression 1 or more times. Equivalent to `{1,}`.
	 * 
	 * @see [plus](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#special-plus)
	 */
	static get plus(): string {
		return '+';
	}

	/**
	 * `?`,
	 * Matches the preceding expression 0 or 1 time. Equivalent to `{0,1}`.
	 * 
	 * @see [questionmark](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#special-questionmark)
	 */
	static get zeroOrOne(): string {
		return this.questionmark;
	}

	/**
	 * `?`,
	 * Matches the preceding expression 0 or 1 time. Equivalent to `{0,1}`.
	 * 
	 * @see [questionmark](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#special-questionmark)
	 */
	static get questionmark(): string {
		return '?';
	}

	/**
	 * `.`, 
	 * Matches any single character except the newline character, by default.
	 * 
	 * @see [dot](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#special-dot)
	 */
	static get any(): RegExp {
		return this.dot;
	}

	/**
	 * `.`, 
	 * Matches any single character except the newline character, by default.
	 * 
	 * @see [dot](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#special-dot)
	 */
	static get dot(): RegExp {
		return /./;
	}

	/**
	 * `(x)`, Matches `x` and remembers the match. 
	 * The parentheses are called capturing parentheses
	 * 
	 * @param x pattern
	 * 
	 * @see [capturing parentheses](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#special-capturing-parentheses)
	 */
	static capturingParentheses(x: string | RegExp): RegExp {
		const source = typeof (x) === 'string' ? x : x.source;
		return new RegExp(`(${source})`);
	}

	/**
	 * `(?:x)`, Matches `x` but does not remember the match.
	 * The parentheses are called non-capturing parentheses.
	 * @param x pattern
	 * 
	 * @see [non capturing parentheses](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#special-non-capturing-parentheses)
	 */
	static nonCapturingParentheses(x: string | RegExp): RegExp {
		const source = typeof (x) === 'string' ? x : x.source;
		return new RegExp(`(?:${source})`);
	}

	/**
	 * `x(?=y)`,
	 * Matches `x` only if `x` is followed by `y`. This is called a lookahead.
	 * 
	 * @param x pattern
	 * @param followedBy pattern
	 * 
	 * @see [lookahead](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#special-lookahead)
	 */
	static lookahead(x: string | RegExp, followedBy: string | RegExp): RegExp {
		const source = typeof (x) === 'string' ? x : x.source;
		const ySource = typeof (followedBy) === 'string' ? followedBy : followedBy.source;
		return new RegExp(`${source}(?=${ySource})`);
	}

	/**
	 * `x(?!y)`
	 * Matches `x` only if `x` is not followed by `y`. 
	 * This is called a negated lookahead.
	 * @param x pattern
	 * @param notFollowedBy pattern
	 * 
	 * @see [negated look ahead](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#special-negated-look-ahead)
	 */
	static negatedLookahead(x: string | RegExp, notFollowedBy: string | RegExp): RegExp {
		const source = typeof (x) === 'string' ? x : x.source;
		const ySource = typeof (notFollowedBy) === 'string' ? notFollowedBy : notFollowedBy.source;
		return new RegExp(`${source}(?!${ySource})`);
	}

	/**
	 * `(?<=y)x`,
	 * Matches `x` only if `x` is preceded by `y`.
	 * This is called a lookbehind.
	 * 
	 * @param x pattern
	 * @param precededBy pattern
	 * 
	 * @see [lookbehind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#special-lookbehind) 
	 */
	static lookbehind(x: string | RegExp, precededBy: string | RegExp): RegExp {
		const source = typeof (x) === 'string' ? x : x.source;
		const ySource = typeof (precededBy) === 'string' ? precededBy : precededBy.source;
		return new RegExp(`(?<=${ySource})${source}`);
	}

	/**
	 * `(?<!y)x`,
	 * Matches `x` only if `x` is not preceded by `y`.
	 * This is called a negated lookbehind.
	 * 
	 * @param x pattern
	 * @param notPrecededBy pattern
	 * 
	 * @see [negative lookbehind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#special-negative-lookbehind)
	 */
	static negatedLookbehind(x: string | RegExp, notPrecededBy: string | RegExp): RegExp {
		const source = typeof (x) === 'string' ? x : x.source;
		const ySource = typeof (notPrecededBy) === 'string' ? notPrecededBy : notPrecededBy.source;
		return new RegExp(`(?<!${ySource})${source}`);
	}

	/**
	 * `x|y`,
	 * Matches 'x', or 'y' (if there is no match for 'x').
	 * 
	 * @param items pattern
	 * 
	 * @see [or](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#special-or)
	 */
	static or(...items: string[] | RegExp[]): RegExp {
		let source = '';
		items.forEach((value: string | RegExp, index: number) => {
			source += (index === 0 ? '' : '|') + (typeof (value) === 'string' ? value : value.source);
		});
		return new RegExp(source);
	}

	/**
	 * `{n}`, 
	 * Matches exactly n occurrences of the preceding expression. N must be a positive integer.
	 *
	 * @param n times of occurrences
	 * 
	 * @see [quantifier](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#special-quantifier)
	 */
	static occurrence(n: number): string {
		return `{${n}}`;
	}

	/**
	 * `(n, }`, `{n, m}`,
	 * Matches at least `n` occurrences of the preceding expression. `N` must be a positive integer.
	 * Where `n` and `m` are positive integers and `n <= m`. 
	 * Matches at least `n` and at most `m` occurrences of the preceding expression. 
	 * When `m` is omitted, it's treated as `∞`.
	 * 
	 * @param n at least occurrences
	 * @param m (optional) at most occurrences
	 * 
	 * @see [quantifier](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#special-quantifier)
	 * @see [quantifier-range](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#special-quantifier-range)
	 */
	static occurrenceOrMore(n: number, m?: number): string {
		return `{${n}, ${m || ''}}`;
	}

	/**
	 * `[xyz]`,
	 * Character set. 
	 * 
	 * @see [character set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#special-character-set)
	 */
	static characterSet(...chars: string[]): RegExp {
		const source = chars.join('');
		return new RegExp(`[${source}]`);
	}

	/**
	 * `[^xyz]`,
	 * A negated or complemented character set. 
	 * 
	 * @see [negated character set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#special-negated-character-set)
	 */
	static negatedCharacterSet(...chars: string[]): RegExp {
		const source = chars.join('');
		return new RegExp(`[^${source}]`);
	}

	/**
	 * `[\b]`,
	 * Matches a backspace (U+0008).
	 * 
	 * @see [backspace](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#special-backspace)
	 */
	static get backspace(): RegExp {
		return /[\b]/;
	}

	/**
	 * `\b`
	 * Matches a word boundary.
	 * 
	 * @see [word boundary](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#special-word-boundary)
	 */
	static get wordBoundary(): RegExp {
		return /\b/;
	}

	/**
	 * `\B`, Matches a non-word boundary. 
	 * 
	 * @see [non word boundary](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#special-non-word-boundary)
	 */
	static get nonWordBoundary(): RegExp {
		return /\B/;
	}

	/**
	 * `\cX`
	 * Matches a control character in a string.
	 * 
	 * @param X a character ranging from A to Z.
	 * 
	 * @see [control](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#special-control)
	 */
	static controlCharacter(X: string): RegExp {
		return new RegExp(`\\c${X}`);
	}

	/**
	 * `\d`, Matches a digit character. Equivalent to `[0 - 9]`.
	 * 
	 * @see [digit](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#special-digit)
	 */
	static get digit(): RegExp {
		return /\d/;
	}

	/**
	 * `\D`, Matches a non-digit character. Equivalent to `[^ 0 - 9]`.
	 * 
	 * @see [non digit](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#special-non-digit)
	 */
	static get nonDigit(): RegExp {
		return /\D/;
	}

	/**
	 * `\f`,
	 * Matches a form feed (U+000C).
	 * 
	 * @see [form-feed](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#special-form-feed)
	 */
	static get formfeed(): RegExp {
		return /\f/;
	}

	/**
	 * `\n`,
	 * Matches a line feed (U+000A).
	 * 
	 * @see [](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#special-line-feed)
	 */
	static get linefeed(): RegExp {
		return /\n/;
	}

	/**
	 * `\r`,
	 * Matches a carriage return (U+000D).
	 * 
	 * @see [](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#special-carriage-return)
	 */
	static get carriageReturn(): RegExp {
		return /\r/;
	}

	/**
	 * `\s`,
	 * Matches a white space character, including space, tab, form feed, line feed.
	 * 
	 * @see [white space](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#special-white-space)
	 */
	static get whitespace(): RegExp {
		return /\s/;
	}

	/**
	 * `\S`,
	 * Matches a character other than white space. 
	 * 
	 * @see [non white space](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#special-non-white-space)
	 */
	static get nonWhitespace(): RegExp {
		return /\S/;
	}

	/**
	 * `\t`,
	 * Matches a tab (U+0009).
	 * 
	 * @see [tab](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#special-tab)
	 */
	static get tab(): RegExp {
		return /\t/;
	}

	/**
	 * `\v`,
	 * Matches a vertical tab (U+000B).
	 * 
	 * @see [vertical tab](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#special-vertical-tab)
	 */
	static get verticalTab(): RegExp {
		return /\v/;
	}

	/**
	 * `\w`,
	 * Matches any alphanumeric character including the underscore. 
	 * 
	 * @see [word](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#special-word)
	 */
	static get alphanumeric(): RegExp {
		return /\w/;
	}

	/**
	 * `\W`,
	 * Matches any non-word character. 
	 * 
	 * @see [non word](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#special-non-word)
	 */
	static get nonWord(): RegExp {
		return /\W/;
	}

	/**
	 * `\0`, Matches a NULL (U+0000) character.
	 * 
	 * @see [null](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#special-null)
	 */
	static get null(): RegExp {
		return /\0/;
	}

	/**
	 * `\xhh`,
	 * Matches the character with the code `hh`.
	 * @param hh two hexadecimal digits
	 * 
	 * @see [hex escape](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#special-hex-escape)
	 */
	static hex(hh: string): RegExp {
		return new RegExp(`\\x${hh}`);
	}

	/**
	 * `\uhhhh`
	 * Matches the character with the code `hhhh`.
	 * @param hhhh four hexadecimal digits
	 * 
	 * @see [unicode-escape](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#special-unicode-escape)
	 */
	static unicode(hhhh: string): RegExp {
		return new RegExp(`\\u${hhhh.padStart(4, '0')}`);
	}

	/**
	 * `\u(hhhh} `
	 * (only when u flag is set) 
	 * Matches the character with the Unicode value hhhh (hexadecimal digits).
	 * @param hhhh four hexadecimal digits
	 * 
	 * @see [unicode-escape-es6](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#special-unicode-escape-es6)
	 */
	static unicodeU(hhhh: string): RegExp {
		return new RegExp(`\\u{${hhhh}}`);
	}

	/**
	 * `g`, 
	 * Global search.
	 */
	static get globalSearchFlag(): string {
		return 'g';
	}

	/**
	 * `i`, 
	 * Case-insensitive search.
	 */
	static get caseInsensitiveSearchFlag(): string {
		return 'i';
	}

	/**
	 * `n`, 
	 * Multi-line search.
	 */
	static get multipleLineSearchFlag(): string {
		return 'm';
	}

	/**
	 * `s`, 
	 * Allows . to match newline characters. 
	 */
	static get dotIsNewLineFlag(): string {
		return 's';
	}

	/**
	 * `u`, 
	 * "unicode"; treat a pattern as a sequence of unicode code points.
	 */
	static get unicodeFlag(): string {
		return 'u';
	}

	/**
	 * `y`, 
	 * Perform a "sticky" search that matches starting at the current position in the target string.
	 * 
	 * @see [sticky](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/sticky)
	 */
	static get strickySearchFlag(): string {
		return 'y';
	}

	private static getSource(regEx?: RegExp): string {
		if (!regEx) {
			return '';
		}
		return regEx.source;
	}

	private variables: Map<string, RegExp> = new Map<string, RegExp>();

	private result?: RegExp;

	public define(varName: string, regEx: RegExp): RegExpBuilder {
		this.variables.set(varName, regEx);
		return this;
	}

	public concat(ex: RegExp | RegExp[], qualitier?: string, group?: boolean): RegExpBuilder {
		if (ex instanceof RegExp) {
			let source = RegExpBuilder.getSource(ex);
			if (group) {
				source = `(${source})`;
			}
			this.result = new RegExp(RegExpBuilder.getSource(this.result) + source + (qualitier || ''));
		} else {
			// multiple expressions
			let source = '';
			ex.forEach((value) => {
				source += RegExpBuilder.getSource(value);
			});
			if (group) {
				source = `(${source})`;
			}
			this.result = new RegExp(RegExpBuilder.getSource(this.result) + source + (qualitier || ''));
		}
		return this;
	}

	public groupOr(regExps: RegExp[], qualitier?: string): RegExpBuilder {
		let source = '';
		regExps.forEach((value, index) => {
			source += `${index > 0 ? '|' : ''}(${RegExpBuilder.getSource(value)})`;
		});
		const regExp = new RegExp(source);
		return this.concat(regExp, qualitier, true);
	}

	public toRegExp(flags?: string): RegExp {
		if (flags) {
			return new RegExp(RegExpBuilder.getSource(this.result), flags);
		}
		return this.result;
	}
}
