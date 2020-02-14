import { RegExpCoder } from '../src/regExpCoder';

const splitter: string = '|';
const escaper: string = '\\';

export class MarkdownPattern {
	/**
	 * The regular expression to match a markdown table headers or rows
	 * `/^\s*(\|)?((\s*(([^|\\]|\\\\|\\\|)*)\s*\|)+)(\s*(([^|\\]|\\\\|\\\|)*)\s*)+\s*$/`
	 */
	static markdownRowExp(): RegExp {
		const whitespaceAny = /\s*/;
		const noSplitterChar = RegExpCoder.new()
			.negatedSet(splitter, RegExpCoder.encodeRegExp(escaper));
		const qualifiedSplitterChar = RegExpCoder.new().or(
			RegExpCoder.encodeRegExp(`${escaper}${escaper}`),
			RegExpCoder.encodeRegExp(`${escaper}${splitter}`),
		);
		const cell = RegExpCoder.new()
			.join(whitespaceAny)
			.or(
				noSplitterChar,
				qualifiedSplitterChar,
				{ qualifier: '*', group: true },
			)
			.join(whitespaceAny);
		const re = RegExpCoder.new()
			.join(whitespaceAny)
			.join(RegExpCoder.encodeRegExp(splitter), { qualifier: '?', notRemember: true })
			.join(cell, RegExpCoder.encodeRegExp(splitter), { qualifier: '+', group: true })
			.join(cell, { qualifier: '+' })
			.join(whitespaceAny)
			.enableMatchWhole()
			.toRegExp();

		return re;
	}

	/**
	 * The splitter expression to split a markdown row to cells
	 * `/(?<!(?:^|[^\\|])(?:\\\\|\\\|)*\\)\|/`
	 */
	static markdownCellSplitterExp(): RegExp {
		const noSplitterChar = RegExpCoder.new()
			.negatedSet(
				RegExpCoder.encodeRegExp(splitter, true),
				RegExpCoder.encodeRegExp(escaper, true),
			);
		const qualifiedSplitterChar = RegExpCoder.new()
			.or(
				RegExpCoder.encodeRegExp(`${escaper}${escaper}`),
				RegExpCoder.encodeRegExp(`${escaper}${splitter}`),
			);

		const re = new RegExpCoder()
			.negatedLookbehind(
				RegExpCoder.encodeRegExp(splitter),
				new RegExpCoder()
					.or('^', noSplitterChar, { group: true, notRemember: true })
					.join(qualifiedSplitterChar, {
						qualifier: '*',
						groupItem: true,
						notRememberGroupItem: true,
						groupQualifiedItem: false,
					})
					.join(RegExpCoder.encodeRegExp(escaper)),
			)
			.toRegExp();

		return re;
	}
}
