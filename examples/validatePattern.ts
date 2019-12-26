import { CsvPattern } from './separatedValuesPattern';
import { RegExpCoder } from '../src/regExpCoder';

export class ValidatePattern {
	static emailAddressRe: RegExp;

	/**
	 * Get expression of email addresses
	 * (Email Address Spec)[https://tools.ietf.org/html/rfc5322#section-3.4]
	 */
	static getEmailAddressRegExp(): RegExp {
		const separator = '.';
		if (!this.emailAddressRe) {
			const partRe = /[a-zA-Z0-9!#$&'*+\-/=?^_`{|}~]+/;
			const reLocal = CsvPattern.aba(partRe, separator);
			const reDomain = CsvPattern.aba(partRe, separator);
			const re = new RegExpCoder()
				.join(reLocal, '@', reDomain);
			this.emailAddressRe = re.toRegExp();
		}

		return this.emailAddressRe;
	}

	/**
	 * Validate email address
	 * @param exp the expression for email address validation 
	 * @param emailAddress the email address
	 */
	static validateEmailAddress(emailAddress: string): boolean {
		const exp = this.getEmailAddressRegExp();
		const re = new RegExpCoder()
			.join(exp)
			.enableMatchWhole()
			.toRegExp(exp.flags);
		return re.test(emailAddress);
	}
}
