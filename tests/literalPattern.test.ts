import LiteralPattern from '../src/literalPattern';

const prefix = 'test.regexp';
test(`${prefix}.literalPattern`, () => {
	const exp = LiteralPattern.literal('"', '\\\\');
	const str = '"a\\"b\\\\c","edf",ghi';
	expect(exp.exec(str)[0]).toBe('"a\\"b\\\\c"');
	expect(exp.exec(str)[0]).toBe('"edf"');
	expect(exp.exec(str)).toBe(null);
});
