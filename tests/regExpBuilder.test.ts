import RegExpCoder from '../src/regExpCoder';

const group = true;
const groupItem = true;
const notRemember = true;
const notRememberQualifiedItem = true;

const prefix = 'test.regexp';
test(`${prefix}.encode`, () => {
	expect(RegExpCoder.encodeRegExp('a^\\.()[]?+*|$z')).toBe('a\\^\\\\\\.\\(\\)\\[\\]\\?\\+\\*\\|\\$z');
	expect(RegExpCoder.encodeRegExp('^\\a-z]', true)).toBe('\\^\\\\a\\-z\\]');
	expect(RegExpCoder.encodeRegExp('a^z', true)).toBe('a^z');
	expect(RegExpCoder.encodeRegExp('-z', true)).toBe('-z');
	expect(RegExpCoder.encodeRegExp('a-', true)).toBe('a-');
});

test(`${prefix}.`, () => {
	// concat single
	expect(new RegExpCoder().join('x').toRegExp().source).toBe('x');
	expect(new RegExpCoder().join('x', { group }).toRegExp().source).toBe('(x)');
	expect(new RegExpCoder().join('x', { group, notRemember }).toRegExp().source).toBe('(?:x)');
	expect(new RegExpCoder().join('x', { group, name: 'name1' }).toRegExp().source).toBe('(?<name1>:x)');
	expect(new RegExpCoder().join(/x/).toRegExp().source).toBe('x');
	expect(new RegExpCoder().join(/x/, { group }).toRegExp().source).toBe('(x)');
	expect(new RegExpCoder().join(/x/, { group, notRemember }).toRegExp().source).toBe('(?:x)');
	expect(new RegExpCoder().join(/x/, { group, name: 'name1' }).toRegExp().source).toBe('(?<name1>:x)');
	// concat multiple 
	expect(new RegExpCoder().join(['x', 'y', 'z']).toRegExp().source).toBe('xyz');
	expect(new RegExpCoder().join(['x', 'y', 'z'], { group }).toRegExp().source).toBe('(xyz)');
	expect(new RegExpCoder().join(['x', 'y', 'z'], { group, notRemember }).toRegExp().source).toBe('(?:xyz)');
	expect(new RegExpCoder().join(['x', 'y', 'z'], { group, name: 'name1' }).toRegExp().source).toBe('(?<name1>:xyz)');
	expect(new RegExpCoder().join([/x/, /y/, /z/]).toRegExp().source).toBe('xyz');
	expect(new RegExpCoder().join([/x/, /y/, /z/], { group }).toRegExp().source).toBe('(xyz)');
	expect(new RegExpCoder().join([/x/, /y/, /z/], { group, notRemember }).toRegExp().source).toBe('(?:xyz)');
	expect(new RegExpCoder().join(['x', /y/, /z/], { group, name: 'name1' }).toRegExp().source).toBe('(?<name1>:xyz)');
	expect(new RegExpCoder().join(['x', 'y', 'z'], { qualifier: '*' }).toRegExp().source).toBe('(xyz)*');
	expect(new RegExpCoder().join(['x', 'y', 'z'], { qualifier: '*', notRememberQualifiedItem }).toRegExp().source).toBe('(?:xyz)*');
	expect(new RegExpCoder().join(['x'], { qualifier: '*', groupQualifiedItem: false }).toRegExp().source).toBe('x*');
	// or
	expect(new RegExpCoder().or(['x', 'y', 'z']).toRegExp().source).toBe('x|y|z');
	expect(new RegExpCoder().or(['x', 'y', 'z'], { group }).toRegExp().source).toBe('(x|y|z)');
	expect(new RegExpCoder().or(['x', 'y', 'z'], { group, notRemember }).toRegExp().source).toBe('(?:x|y|z)');
	expect(new RegExpCoder().or(['x', 'y', 'z'], { group, name: 'name1' }).toRegExp().source).toBe('(?<name1>:x|y|z)');
	expect(new RegExpCoder().or(['x', 'y', 'z'], { groupItem }).toRegExp().source).toBe('(x)|(y)|(z)');
	expect(new RegExpCoder().or([/x/, 'y', 'z'], { groupItem, group }).toRegExp().source).toBe('((x)|(y)|(z))');
	// set
	expect(new RegExpCoder().set('x').toRegExp().source).toBe('[x]');
	expect(new RegExpCoder().set(['x', 'y', 'z']).toRegExp().source).toBe('[xyz]');
	expect(new RegExpCoder().negatedSet(['x', 'y', 'z']).toRegExp().source).toBe('[^xyz]');
	// look
	expect(new RegExpCoder().lookahead('x', 'y').toRegExp().source).toBe('x(?=y)');
	expect(new RegExpCoder().negatedLookahead('x', 'y').toRegExp().source).toBe('x(?!y)');
	expect(new RegExpCoder().lookbehind('x', 'y').toRegExp().source).toBe('(?<=y)x');
	expect(new RegExpCoder().negatedLookbehind('x', 'y').toRegExp().source).toBe('(?<!y)x');
	// match whole
	expect(new RegExpCoder().join('x').enableMatchWhole().toRegExp().source).toBe('^x$');
});

test(`${prefix}.define`, () => {
	const exp = new RegExpCoder()
		.define('a', 'x')
		.define('b', /y/);
	// concat single
	expect(exp.join('a').toRegExp().source).toBe('x');
	exp.clear(true);
	expect(exp.join('a', { group }).toRegExp().source).toBe('(x)');
	exp.clear(true);
	expect(exp.join('a', { group, notRemember }).toRegExp().source).toBe('(?:x)');
	exp.clear(true);
	expect(exp.join('a', { group, name: 'name1' }).toRegExp().source).toBe('(?<name1>:x)');
	exp.clear(true);
	// concat multiple 
	expect(exp.join(['a', 'b', 'z']).toRegExp().source).toBe('xyz');
	exp.clear(true);
	expect(exp.join(['a', 'b', 'z'], { group }).toRegExp().source).toBe('(xyz)');
	exp.clear(true);
	expect(exp.join(['a', 'b', 'z'], { group, notRemember }).toRegExp().source).toBe('(?:xyz)');
	exp.clear(true);
	expect(exp.join(['a', 'b', /z/], { group, name: 'name1' }).toRegExp().source).toBe('(?<name1>:xyz)');
	exp.clear(true);
	// or
	expect(exp.or(['a', 'b', 'z']).toRegExp().source).toBe('x|y|z');
	exp.clear(true);
	expect(exp.or(['a', 'b', 'z'], { group }).toRegExp().source).toBe('(x|y|z)');
	exp.clear(true);
	expect(exp.or(['a', 'b', 'z'], { group, notRemember }).toRegExp().source).toBe('(?:x|y|z)');
	exp.clear(true);
	expect(exp.or(['a', 'b', 'z'], { group, name: 'name1' }).toRegExp().source).toBe('(?<name1>:x|y|z)');
	exp.clear(true);
	expect(exp.or(['a', 'b', 'z'], { groupItem }).toRegExp().source).toBe('(x)|(y)|(z)');
	exp.clear(true);
	expect(exp.or(['a', 'b', /z/], { groupItem, group }).toRegExp().source).toBe('((x)|(y)|(z))');
	exp.clear(true);
	// set
	expect(exp.set('a').toRegExp().source).toBe('[x]');
	exp.clear(true);
	expect(exp.set(['a', 'b', 'z']).toRegExp().source).toBe('[xyz]');
	exp.clear(true);
	expect(exp.negatedSet(['a', 'b', 'z']).toRegExp().source).toBe('[^xyz]');
	exp.clear(true);
	// look
	expect(exp.lookahead('a', 'b').toRegExp().source).toBe('x(?=y)');
	exp.clear(true);
	expect(exp.negatedLookahead('a', 'b').toRegExp().source).toBe('x(?!y)');
	exp.clear(true);
	expect(exp.lookbehind('a', 'b').toRegExp().source).toBe('(?<=y)x');
	exp.clear(true);
	expect(exp.negatedLookbehind('a', 'b').toRegExp().source).toBe('(?<!y)x');
	exp.clear(true);
	// match whole
	expect(exp.join('a').enableMatchWhole().toRegExp().source).toBe('^x$');
});

test(`${prefix}..stash`, () => {
	const exp = new RegExpCoder()
		.join('x')
		.stash('a')
		.join(/y/)
		.stash('b');
	// concat single
	expect(exp.join('a').toRegExp().source).toBe('x');
	exp.clear(true);
	expect(exp.join('a', { group }).toRegExp().source).toBe('(x)');
	exp.clear(true);
	expect(exp.join('a', { group, notRemember }).toRegExp().source).toBe('(?:x)');
	exp.clear(true);
	expect(exp.join('a', { group, name: 'name1' }).toRegExp().source).toBe('(?<name1>:x)');
	exp.clear(true);
	// concat multiple 
	expect(exp.join(['a', 'b', 'z']).toRegExp().source).toBe('xyz');
	exp.clear(true);
	expect(exp.join(['a', 'b', 'z'], { group }).toRegExp().source).toBe('(xyz)');
	exp.clear(true);
	expect(exp.join(['a', 'b', 'z'], { group, notRemember }).toRegExp().source).toBe('(?:xyz)');
	exp.clear(true);
	expect(exp.join(['a', 'b', /z/], { group, name: 'name1' }).toRegExp().source).toBe('(?<name1>:xyz)');
	exp.clear(true);
	// or
	expect(exp.or(['a', 'b', 'z']).toRegExp().source).toBe('x|y|z');
	exp.clear(true);
	expect(exp.or(['a', 'b', 'z'], { group }).toRegExp().source).toBe('(x|y|z)');
	exp.clear(true);
	expect(exp.or(['a', 'b', 'z'], { group, notRemember }).toRegExp().source).toBe('(?:x|y|z)');
	exp.clear(true);
	expect(exp.or(['a', 'b', 'z'], { group, name: 'name1' }).toRegExp().source).toBe('(?<name1>:x|y|z)');
	exp.clear(true);
	expect(exp.or(['a', 'b', 'z'], { groupItem }).toRegExp().source).toBe('(x)|(y)|(z)');
	exp.clear(true);
	expect(exp.or(['a', 'b', /z/], { groupItem, group }).toRegExp().source).toBe('((x)|(y)|(z))');
	exp.clear(true);
	// set
	expect(exp.set('a').toRegExp().source).toBe('[x]');
	exp.clear(true);
	expect(exp.set(['a', 'b', 'z']).toRegExp().source).toBe('[xyz]');
	exp.clear(true);
	expect(exp.negatedSet(['a', 'b', 'z']).toRegExp().source).toBe('[^xyz]');
	exp.clear(true);
	// look
	expect(exp.lookahead('a', 'b').toRegExp().source).toBe('x(?=y)');
	exp.clear(true);
	expect(exp.negatedLookahead('a', 'b').toRegExp().source).toBe('x(?!y)');
	exp.clear(true);
	expect(exp.lookbehind('a', 'b').toRegExp().source).toBe('(?<=y)x');
	exp.clear(true);
	expect(exp.negatedLookbehind('a', 'b').toRegExp().source).toBe('(?<!y)x');
	exp.clear(true);
	// match whole
	expect(exp.join('a').enableMatchWhole().toRegExp().source).toBe('^x$');
});
