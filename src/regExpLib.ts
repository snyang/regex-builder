import { RegExpCoder } from './regExpCoder';

export class RegExpLib {
	/**
	 * Get expression of email addresses
	 * (Email Address Spec)[https://tools.ietf.org/html/rfc5322#section-3.4]
	 */
	static getEmailAddressRegExp(): RegExp {
		const separator = '.';
		const partRe = /[a-zA-Z0-9!#$&'*+\-/=?^_`{|}~]+/;
		const reLocal = this.aba(partRe, separator);
		const reDomain = this.aba(partRe, separator);
		const re = new RegExpCoder().join(reLocal, '@', reDomain);

		return re.toRegExp();
	}

	/**
	 * Test a string with a specific expression.
	 * @param exp the expression
	 * @param value the tested string
	 */
	static test(exp: RegExp, value: string): boolean {
		const re = new RegExpCoder()
			.join(exp)
			.enableMatchWhole()
			.toRegExp(exp.flags);
		return re.test(value);
	}

	/**
	 * `column(separator(column))*`  
	 * For ABA pattern, e.g. `abc,def,ghi`
	 * @param column the column expression
	 * @param separator the separator
	 */
	static aba(column: string | RegExp,
		separator: string): RegExp {
		const group = true;
		const notRemember = true;
		const re = RegExpCoder.new()
			.define('$separator', separator, { group, notRemember })
			.define('$column', column, { group })
			.join('$column', { group })
			.join('$separator', '$column', { qualifier: '*' });
		return re.toRegExp('g');
	}
}
