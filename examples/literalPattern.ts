import RegExpSpec from '../src/regExpSpec';
import RegExpCoder from '../src/regExpCoder';

export default class LiteralPattern {
	/**
	 * `/"([^"\\]|\\.)*"/g`  
	 * For literal cases. e.g. `"abc\ndef"`  
	 * `"` is qualifier  
	 * `\` is escape character
	 * @param qualifier the qualifier
	 * @param escape the escape char
	 */
	static literal(qualifier: string,
		escape: string): RegExp {
		const negated = true;
		const re = new RegExpCoder()
			.define('charWithEscape', `${escape}.`)
			.defineSet('charWithoutEscape', [qualifier, escape], { negated })
			.join(qualifier)
			.or(['charWithoutEscape', 'charWithEscape'], { qualifier: '*' })
			.join(qualifier)
			.toRegExp(RegExpSpec.globalSearchFlag);

		return re;
	}
}
