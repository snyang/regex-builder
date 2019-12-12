import RegExpBuilder from './regExpBuilder';

export interface SeparatedValuesOptions {
	qualifier: string;
	escaper: string;
	escaped: string;
	separator: string;
	allowBeginSeparator: boolean;
	allowEndSeparator: boolean;
}

/**
 * For separated values pattern.  
 * e.g. csv format: `abc,def,hig`
 * qualifier: `"`
 * escaper: `"`
 * escaped: `"`
 * separator: `,`
 */
export default class SeparatedValuesPattern {
	private _data: string;

	private options: SeparatedValuesOptions;

	/**
	 * init
	 */
	public init(options: SeparatedValuesOptions) {
		this.options = options;
	}

	/**
	 * `/(?<=(^|,)("?))([^"]|"")+(?=("?)(,|$))/g;`  
	 * The expression for find cell values in a row.
	 */
	getCellExp(): RegExp {
		const re = new RegExpBuilder()
			.concatLookahead('', `(^${this.options.separator}|)(${this.options.escaper}?)`)
			.concatOr(
				[
					`[^${this.options.escaped}]`,
					`${this.options.escaper}${this.options.escaped}`,
				], { qualifier: '+' },
			)
			.concatLookbehind('', `(${this.options.escaper}?)(${this.options.separator}|$)`);

		return re.toRegExp('g');
	}

	/**
	 * `(?:b?)a(?:(b(a))*)(?:b?)`  
	 * `/(?<=(^|,)("?))([^"]|"")+(?=("?)(,|$))/g;`  
	 * For ABA pattern, e.g. csv format: `abc,def,hig`
	 * @param column the column expression
	 * @param separator the separator expression
	 * @param options 
	 */
	static aba(column: string | RegExp,
		separator: string | RegExp,
		options?: { allowBeginSeparator: boolean, allowEndSeparator: boolean }): RegExp {
		const group = true;
		const notRemember = true;
		let re = new RegExpBuilder()
			.define('separatorZeroOrOne', separator, { group, notRemember, qualifier: '?' })
			.define('separator', separator, { group, notRemember })
			.define('column', column, { group });
		if (options && options.allowBeginSeparator) {
			re = re.concat('separatorZeroOrOne');
		}
		re = re.concat('column', { group });
		re = re.concat(['separator', 'column'], { qualifier: '*' });
		if (options && options.allowEndSeparator) {
			re = re.concat('separatorZeroOrOne');
		}

		return re.toRegExp();
	}
}
