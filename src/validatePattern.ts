import SeparatedValuesPattern from './separatedValuesPattern';
import RegExpBuilder from './regExpBuilder';

export default class ValidatePattern {
	/**
	 * Validate email
	 * @param email https://tools.ietf.org/html/rfc5322#section-3.4
	 */
	static validateEmail(email: string): boolean {
		const partRe = /[a-zA-Z0-9!#$&'*+\-/=?^_`{|}~]+/;
		const reLocal = SeparatedValuesPattern.aba(partRe, /\./);
		const reDomain = SeparatedValuesPattern.aba(partRe, /\./);
		const re = new RegExpBuilder()
			.concat([reLocal, '@', reDomain])
			.enableMatchWhole()
			.toRegExp();
		return re.test(email);
	}
}
