// import { test } from 'jest';
import RegExpBuilder from '../src/regExpBuilder';

// const test = new jest.It()
const prefix = 'test.regexp';
test(`${prefix}.basic`, () => {
	expect(RegExpBuilder.alphanumeric.source).toBe('\\w');
	expect(RegExpBuilder.any.source).toBe('.');
	expect(RegExpBuilder.asterisk).toBe('*');
	expect(RegExpBuilder.backslash).toBe('\\');
	expect(RegExpBuilder.backspace.source).toBe('[\\b]');
	expect(RegExpBuilder.begin.source).toBe('^');
	expect(RegExpBuilder.carriageReturn.source).toBe('\\r');
	expect(RegExpBuilder.caseInsensitiveSearchFlag).toBe('i');
	expect(RegExpBuilder.characterSet('x', 'y', 'z').source).toBe('[xyz]');
	expect(RegExpBuilder.negatedCharacterSet('x', 'y', 'z').source).toBe('[^xyz]');
	expect(RegExpBuilder.digit.source).toBe('\\d');
	expect(RegExpBuilder.digit.source).toBe('\\d');
	expect(RegExpBuilder.dot.source).toBe('.');
	expect(RegExpBuilder.dotIsNewLineFlag).toBe('s');
	expect(RegExpBuilder.end.source).toBe('$');
	expect(RegExpBuilder.formfeed.source).toBe('\\f');
	expect(RegExpBuilder.globalSearchFlag).toBe('g');
	expect(RegExpBuilder.hex('0A').source).toBe('\\x0A');
	expect(RegExpBuilder.linefeed.source).toBe('\\n');
	expect(RegExpBuilder.lookahead('x', 'y').source).toBe('x(?=y)');
	expect(RegExpBuilder.lookbehind('x', 'y').source).toBe('(?<=y)x');
	expect(RegExpBuilder.more).toBe('*');
	expect(RegExpBuilder.multipleLineSearchFlag).toBe('m');
	expect(RegExpBuilder.negatedLookahead('x', 'y').source).toBe('x(?!y)');
	expect(RegExpBuilder.negatedLookbehind('x', 'y').source).toBe('(?<!y)x');
	expect(RegExpBuilder.nonCapturingParentheses('x').source).toBe('(?:x)');
	expect(RegExpBuilder.nonDigit.source).toBe('\\D');
	expect(RegExpBuilder.nonWhitespace.source).toBe('\\S');
	expect(RegExpBuilder.nonWord.source).toBe('\\W');
	expect(RegExpBuilder.nonWordBoundary.source).toBe('\\B');
	expect(RegExpBuilder.null.source).toBe('\\0');
	expect(RegExpBuilder.occurrence(5)).toBe('{5}');
	expect(RegExpBuilder.occurrenceOrMore(5)).toBe('{5, }');
	expect(RegExpBuilder.occurrenceOrMore(5, 10)).toBe('{5, 10}');
	expect(RegExpBuilder.oneOrMore).toBe('+');
	expect(RegExpBuilder.or('x', 'y').source).toBe('x|y');
	expect(RegExpBuilder.plus).toBe('+');
	expect(RegExpBuilder.questionmark).toBe('?');
	expect(RegExpBuilder.strickySearchFlag).toBe('y');
	expect(RegExpBuilder.tab.source).toBe('\\t');
	expect(RegExpBuilder.unicode('AAAA').source).toBe('\\uAAAA');
	expect(RegExpBuilder.unicodeFlag).toBe('u');
	expect(RegExpBuilder.unicodeU('AAAA').source).toBe('\\u{AAAA}');
	expect(RegExpBuilder.verticalTab.source).toBe('\\v');
	expect(RegExpBuilder.whitespace.source).toBe('\\s');
	expect(RegExpBuilder.wordBoundary.source).toBe('\\b');
	expect(RegExpBuilder.zeroOrOne).toBe('?');
});

// TODO: IPV4, IPV6
// TODO: Literal, multiple replaces occurrence, 
