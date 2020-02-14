import { MarkdownPattern } from '../examples/markdownPattern';

const prefix = 'test.regexp';
test(`${prefix}.markdownPattern.row`, () => {
	const exp = MarkdownPattern.markdownRowExp();
	const row = 'ABC | EDF | Hi\\\\\\|g ';
	expect(exp.test(row)).toBe(true);
});

test(`${prefix}.markdownPattern.cell`, () => {
	const exp = MarkdownPattern.markdownCellSplitterExp();

	expect('a\\| | a'.split(exp)).toStrictEqual(['a\\| ', ' a']);
	expect('a\\\\\\| | a'.split(exp)).toStrictEqual(['a\\\\\\| ', ' a']);
	expect('a\\\\| | a'.split(exp)).toStrictEqual(['a\\\\', ' ', ' a']);
	expect('\\| | a'.split(exp)).toStrictEqual(['\\| ', ' a']);
	expect('\\\\\\| | a'.split(exp)).toStrictEqual(['\\\\\\| ', ' a']);
	expect('\\\\| | a'.split(exp)).toStrictEqual(['\\\\', ' ', ' a']);
});
