import RegExpBuilder from '../src/regExpBuilder';

const prefix = 'test.regexp';
test(`${prefix}.sql.literal`, () => {
	expect(testMatchSqlLiteral("Name = 'ab\\'c' And ")).toBe("'ab\\'c'");
	expect(testMatchSqlLiteral("Name = '' And ")).toBe("''");
	expect(testMatchSqlLiteral("Name = 'abc' And ")).toBe("'abc'");
	expect(testMatchSqlLiteral("Name = 'ab\\\t\\\\\\'c' And ")).toBe("'ab\\\t\\\\\\'c'");
	expect(testMatchSqlLiteral("Name = 'ab\\' And ")).toBe(null);
});

test(`${prefix}.markdown.table`, () => {
	expect(testMarkdownTableLine(' | ---- | ----- |')).toBe(true);
	expect(testMarkdownTableLine('| :---- | -----:')).toBe(true);
	expect(testMarkdownTableLine(' ---- | ----- | ')).toBe(true);
	expect(testMarkdownTableLine(' ---- | ----- ')).toBe(true);
	expect(testMarkdownTableLine(' abc | ----- ')).toBe(false);
});

function testMatchSqlLiteral(str: string): string {
	// case: escape for any character
	// const withEscapeEx = /\\./;
	// const withoutEscapeEx = /[^\\.']/;

	// case: escape for specific characters, e.g. ['\\', '\t', '\'']
	const withEscapeEx = /(\\\\)|(\\\t)|(\\')/;
	const withoutEscapeEx = /[^(\\\\)(\\\t)(\\')]/;

	const qualifierEx = /'/;
	const re = new RegExpBuilder()
		.concat(qualifierEx)
		.groupOr([withoutEscapeEx, withEscapeEx], '*')
		.concat(qualifierEx)
		.toRegExp();
	const result = str.match(re);
	if (result) {
		return result[0];
	}
	return null;
}

function testMarkdownTableLine(str: string): boolean {
	const headerLineEx = /(\s*)(:?)(-*)(:?)(\s*)/;
	const splitterEx = /\|/;
	const re = new RegExpBuilder()
		.concat(RegExpBuilder.begin)
		.concat(RegExpBuilder.whitespace, '*')
		.concat(splitterEx, '?', true)
		.concat([headerLineEx, splitterEx], '+', true)
		.concat(headerLineEx, '?', true)
		.concat(RegExpBuilder.whitespace, '*')
		.concat(RegExpBuilder.end)
		.toRegExp();
	return re.test(str);
}
