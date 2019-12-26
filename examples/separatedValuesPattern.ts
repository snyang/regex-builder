import { RegExpCoder } from '../src/regExpCoder';

export interface SeparatedValuesOptions {
	qualifier?: string;
	escaper?: string;
	escaped?: string;
	separator: string;
}

/**
 * For separated values pattern.  
 */
export class CsvPattern {
	/**
	 * `/(("[^"]*")|[^\n])* /g`
	 * The expression for find next row in whole content.
	 */
	static getCsvRowExp(options: SeparatedValuesOptions): RegExp {
		const newOptions = {
			...{
				qualifier: '"',
				escaper: '"',
				escaped: '"',
				separator: ',',
			},
			...options,
		};
		const re = RegExpCoder.new()
			.define('qualifiedContent',
				RegExpCoder.new().group(
					newOptions.qualifier,
					RegExpCoder.new().negatedSet(newOptions.qualifier, { qualifier: '*' }),
					newOptions.qualifier,
				))
			.define('nonSeparator',
				RegExpCoder.new().negatedSet(newOptions.separator))
			.or(
				'qualifiedContent',
				'nonSeparator',
				{ qualifier: '*' },
			);

		return re.toRegExp('g');
	}

	/**
	 * `/(?<=^|,)([^",]*|"([^"]|"")*")(?=,|$)/g`
	 * `/(?<=^|,)[^"]|("([^"]|"")*")(?=,|$))`
	 * The expression for find cell values in a row.
	 * Note: the result would includes qualifiers e.g. `"a"` or non-escaped content e.g. `""`. 
	 */
	static getCsvCellExp(options: SeparatedValuesOptions): RegExp {
		const newOptions = {
			...{
				qualifier: '"',
				escaper: '"',
				escaped: '"',
				separator: ',',
			},
			...options,
		};
		const re = RegExpCoder.new()
			.lookbehind('', `^|${newOptions.separator}`)
			.or(
				RegExpCoder.new().negatedSet(
					newOptions.escaped,
					newOptions.separator,
					{ qualifier: '*' },
				),
				RegExpCoder.new().group(
					newOptions.qualifier,
					RegExpCoder.new().or(
						`[^${newOptions.escaped}]`,
						`${newOptions.escaper}${newOptions.escaped}`,
						{ qualifier: '*' },
					),
					newOptions.qualifier,
				),
				{ group: true },
			)
			.lookahead('', `${newOptions.separator}|$`);

		return re.toRegExp('g');
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
			.define('separator', separator, { group, notRemember })
			.define('column', column, { group })
			.join('column', { group })
			.join('separator', 'column', { qualifier: '*' });
		return re.toRegExp('g');
	}
}
