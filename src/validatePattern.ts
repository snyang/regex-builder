import MatchPattern from './matchPattern';
import RegExpBuilder from './regExpBuilder';

export default class ValidatePattern {
	/**
	 * Validate email
	 * @param email https://tools.ietf.org/html/rfc5322#section-3.4
	 */
	static validateEmail(email: string): boolean {
		const partRe = /[a-zA-Z0-9!#$&'*+\-/=?^_`{|}~]+/;
		const reLocal = MatchPattern.aba(partRe, /\./);
		const reDomain = MatchPattern.aba(partRe, /\./);
		const re = new RegExpBuilder()
			.concat([reLocal, '@', reDomain])
			.matchAllPattern()
			.toRegExp();
		console.log(re.source);
		const result = re.exec(email);
		return result !== null;
	}
}
