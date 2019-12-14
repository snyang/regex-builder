import RegExpBuilder from './regExpBuilder';

export interface SeparatedValuesOptions {
	qualifier?: string;
	escaper?: string;
	escaped?: string;
	separator: string;
}

/**
 * For separated values pattern.  
 */
export default class CsvPattern {
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
		const re = RegExpBuilder.new()
			.define('qualifiedContent',
				RegExpBuilder.new().group([
					newOptions.qualifier,
					RegExpBuilder.new().negatedSet(newOptions.qualifier, { qualifier: '*' }),
					newOptions.qualifier,
				]))
			.define('nonSeparator',
				RegExpBuilder.new().negatedSet(newOptions.separator))
			.or([
				'qualifiedContent',
				'nonSeparator',
			], { qualifier: '*' });

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
		const re = RegExpBuilder.new()
			.lookbehind('', `^|${newOptions.separator}`)
			.or(
				[
					RegExpBuilder.new().negatedSet(
						[newOptions.escaped, newOptions.separator],
						{ qualifier: '*' },
					),
					RegExpBuilder.new().group(
						[
							newOptions.qualifier,
							RegExpBuilder.new().or(
								[`[^${newOptions.escaped}]`, `${newOptions.escaper}${newOptions.escaped}`],
								{ qualifier: '*' },
							),
							newOptions.qualifier,
						],
					),
				],
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
		const re = RegExpBuilder.new()
			.define('separator', separator, { group, notRemember })
			.define('column', column, { group })
			.join('column', { group })
			.join(['separator', 'column'], { qualifier: '*' });
		return re.toRegExp('g');
	}
}
