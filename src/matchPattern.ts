import RegExpBuilder from './regExpBuilder';

export default class MatchPattern {
	/**
	 * For literal cases. e.g. `"abc\ndef"`  
	 * `"` is qualifier  
	 * `\` is escape char
	 * @param qualifier the qualifier
	 * @param escape the escape char
	 */
	static literal(qualifier: string,
		escape: string | string[]): RegExp {
		const qualiterEx = new RegExp(qualifier);
		const withEscapeEx = RegExpBuilder.or(...escape);
		const withoutEscapeEx = new RegExpBuilder().groupNotOr(qualifier, ...escape).toRegExp();
		const re = new RegExpBuilder()
			.concat(qualiterEx)
			.groupOr([withoutEscapeEx, withEscapeEx], '*')
			.concat(qualiterEx)
			.toRegExp();

		return re;
	}

	/**
	 * For ABA pattern, e.g. csv format: `abc,def,hig`
	 * @param column the column part
	 * @param separator the separator
	 * @param options 
	 */
	static aba(column: string | RegExp,
		separator: string | RegExp,
		options?: { allowBeginSeparator: boolean, allowEndSeparator: boolean }): RegExp {
		const columnEx = this.toRegExp(column);
		const separatorEx = this.toRegExp(separator);
		let re = new RegExpBuilder();
		if (options && options.allowBeginSeparator) {
			// `b?a((ba)*)`
			re = re.concat(separatorEx, { qualifier: '?', group: true });
			re = re.concat(columnEx, { group: true });
		} else {
			re = re.concat(columnEx, { group: true });
		}
		re = re.concat([separatorEx, columnEx], { qualifier: '*', group: true });
		if (options && options.allowEndSeparator) {
			re = re.concat(separatorEx, { qualifier: '?', group: true });
		}

		return re.toRegExp();
	}

	static toRegExp(re: string | RegExp): RegExp {
		if (typeof re === 'string') {
			return new RegExp(re);
		}

		return re;
	}
}
