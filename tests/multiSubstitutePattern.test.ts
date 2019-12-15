import MultiSubstitutePattern from '../examples/multiSubstitutePattern';

const prefix = 'test.regexp.pattern';
test(`${prefix}.multiSubstitutePattern`, () => {
	let str = 'abc';
	expect(MultiSubstitutePattern.replace(str, ['a', 'b', 'c'], ['x', 'y', 'z'])).toBe('xyz');
	str = '&<>\'"';
	expect(MultiSubstitutePattern.replace(str,
		['&', '<', '>', '\'', '"'],
		['&amp;', '&lt;', '&gt;', '&apos;', '&quot;'])).toBe('&amp;&lt;&gt;&apos;&quot;');
	expect(MultiSubstitutePattern.replace(
		MultiSubstitutePattern.replace(str,
			['&', '<', '>', '\'', '"'],
			['&amp;', '&lt;', '&gt;', '&apos;', '&quot;']),
		['&amp;', '&lt;', '&gt;', '&apos;', '&quot;'],
		['&', '<', '>', '\'', '"'],
	)).toBe(str);

	str = '`~!@#$%^&*()_+{}|:"<>?-=[]\\;\',./';
	expect(MultiSubstitutePattern.replace(
		str,
		['`', '~', '!', '@',
			'#', '$', '%', '^',
			'&', '*', '(', ')',
			'_', '+', '{', '}',
			'|', ':', '"', '<',
			'>', '?', '-', '=',
			'[', ']', '\\', ';',
			'\'', ',', '.', '/'],
		['"`"', '"~"', '"!"', '"@"',
			'"#"', '"$"', '"%"', '"^"',
			'"&"', '"*"', '"("', '")"',
			'"_"', '"+"', '"{"', '"}"',
			'"|"', '":"', '"""', '"<"',
			'">"', '"?"', '"-"', '"="',
			'"["', '"]"', '"\\"', '";"',
			'"\'"', '","', '"."', '"/"'],
	)).toBe('"`""~""!""@""#""$""%""^""&""*""("")""_""+""{""}""|"":"""""<"">""?""-""=""[""]""\\"";""\'"","".""/"');
});
