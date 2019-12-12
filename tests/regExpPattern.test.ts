import RegExpToken from '../src/regExpToken';
import RegExpBuilder from '../src/regExpBuilder';

// const prefix = 'test.regexp';
// test(`${prefix}.internalIsGrouped`, () => {
// 	expect(RegExpBuilder.internalIsGrouped('(abc)')).toBe(true);
// 	expect(RegExpBuilder.internalIsGrouped('(abc)(def)')).toBe(false);
// 	expect(RegExpBuilder.internalIsGrouped('(abc\\)')).toBe(false);
// 	expect(RegExpBuilder.internalIsGrouped('(abc\\\\)')).toBe(true);
// 	expect(RegExpBuilder.internalIsGrouped('(abc\\\\\\)')).toBe(false);
// 	expect(RegExpBuilder.internalIsGrouped('(abc\\\\\\\\)')).toBe(true);
// 	expect(RegExpBuilder.internalIsGrouped('(())')).toBe(true);
// 	expect(RegExpBuilder.internalIsGrouped('((\\)))')).toBe(true);
// 	expect(RegExpBuilder.internalIsGrouped('(a(b)c)')).toBe(true);
// 	expect(RegExpBuilder.internalIsGrouped('(a\\(b)c)')).toBe(false);
// 	expect(RegExpBuilder.internalIsGrouped('(a\\\\(b)c)')).toBe(true);
// 	expect(RegExpBuilder.internalIsGrouped('(a\\\\(b\\)c)')).toBe(false);
// 	expect(RegExpBuilder.internalIsGrouped('(a\\\\(b\\\\)c)')).toBe(true);
// });

const prefix = 'test.regexp';
test(`${prefix}.sql.literal`, () => {
	expect(testMatchSqlLiteral("Name = 'ab\\'(c' And ")).toBe("'ab\\'(c'");
	expect(testMatchSqlLiteral("Name = '' And ")).toBe("''");
	expect(testMatchSqlLiteral("Name = 'abc' And ")).toBe("'abc'");
	expect(testMatchSqlLiteral("Name = 'ab\\\t\\\\\\'c' And ")).toBe("'ab\\\t\\\\\\'c'");
	expect(testMatchSqlLiteral("Name = 'ab\\' And ")).toBe(null);
});

test(`${prefix}.markdown.table`, () => {
	expect(testMarkdownTableLine('  | ---- | ----- |')).toBe(true);
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
	const withoutEscapeEx = /[^\\\t']/;

	const qualifierEx = /'/;
	const re = new RegExpBuilder()
		.concat(qualifierEx)
		.concatOr([withoutEscapeEx, withEscapeEx], { qualifier: '*' })
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
		.concat(RegExpToken.begin)
		.concat(RegExpToken.whitespace, { qualifier: '*' })
		.concat(splitterEx, { qualifier: '?', group: true })
		.concat([headerLineEx, splitterEx], { qualifier: '+', group: true })
		.concat(headerLineEx, { qualifier: '?', group: true })
		.concat(RegExpToken.whitespace, { qualifier: '*' })
		.concat(RegExpToken.end)
		.toRegExp();
	return re.test(str);
}
