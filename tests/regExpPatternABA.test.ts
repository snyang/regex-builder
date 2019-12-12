import LiteralPattern from '../src/literalPattern';
import SeparatedValuesPattern from '../src/separatedValuesPattern';

const prefix = 'test.regexp.pattern';
test(`${prefix}.literal`, () => {
	const exp = LiteralPattern.literal('"', '\\\\');
	const str = '"abc","edf",ghi';
	expect(exp.source).toBe('"(?:[^"\\\\]|\\\\.)*"');
	expect(exp.exec(str)[0]).toBe('"abc"');
	expect(exp.exec(str)[0]).toBe('"edf"');
	expect(exp.exec(str)).toBe(null);
});

test(`${prefix}.aba`, () => {
	const exp = SeparatedValuesPattern.aba(LiteralPattern.literal(undefined, '\\\\'), ',');
	console.log(exp.source);
	console.log(exp.exec('abc,edf,ghi'));
	expect(exp.test('abc,edf,ghi')).toBe(true);
});
