import { RegExpSpec } from '../src/regExpSpec';
import { RegExpCoder } from '../src/regExpCoder';

export class LiteralPattern {
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
		const re = new RegExpCoder()
			.define('$charWithEscape', `${escape}.`)
			.defineNegatedSet('$charWithoutEscape', qualifier, escape)
			.join(qualifier)
			.or('$charWithoutEscape', '$charWithEscape', { qualifier: '*' })
			.join(qualifier)
			.toRegExp(RegExpSpec.globalSearchFlag);

		return re;
	}
}
