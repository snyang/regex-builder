import SeparatedValuesPattern from './separatedValuesPattern';
import RegExpBuilder from './regExpBuilder';

export default class ValidatePattern {
	static emailAddressRe: RegExp;

	/**
	 * Get expression of email addresses
	 * (Email Address Spec)[https://tools.ietf.org/html/rfc5322#section-3.4]
	 */
	static getEmailAddressRegExp(): RegExp {
		const separator = '.';
		if (!this.emailAddressRe) {
			const partRe = /[a-zA-Z0-9!#$&'*+\-/=?^_`{|}~]+/;
			const reLocal = SeparatedValuesPattern.aba(partRe, separator);
			const reDomain = SeparatedValuesPattern.aba(partRe, separator);
			const re = new RegExpBuilder()
				.join([reLocal, '@', reDomain]);
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
		const re = new RegExpBuilder()
			.join(exp)
			.enableMatchWhole()
			.toRegExp(exp.flags);
		return re.test(emailAddress);
	}
}
