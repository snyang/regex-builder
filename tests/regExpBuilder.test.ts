import RegExpBuilder from '../src/regExpBuilder';

const group = true;
const groupItem = true;
const notRemember = true;
const notRememberQualifiedItem = true;

const prefix = 'test.regexp';
test(`${prefix}.`, () => {
	// concat single
	expect(new RegExpBuilder().join('x').toRegExp().source).toBe('x');
	expect(new RegExpBuilder().join('x', { group }).toRegExp().source).toBe('(x)');
	expect(new RegExpBuilder().join('x', { group, notRemember }).toRegExp().source).toBe('(?:x)');
	expect(new RegExpBuilder().join('x', { group, name: 'name1' }).toRegExp().source).toBe('(?<name1>:x)');
	expect(new RegExpBuilder().join(/x/).toRegExp().source).toBe('x');
	expect(new RegExpBuilder().join(/x/, { group }).toRegExp().source).toBe('(x)');
	expect(new RegExpBuilder().join(/x/, { group, notRemember }).toRegExp().source).toBe('(?:x)');
	expect(new RegExpBuilder().join(/x/, { group, name: 'name1' }).toRegExp().source).toBe('(?<name1>:x)');
	// concat multiple 
	expect(new RegExpBuilder().join(['x', 'y', 'z']).toRegExp().source).toBe('xyz');
	expect(new RegExpBuilder().join(['x', 'y', 'z'], { group }).toRegExp().source).toBe('(xyz)');
	expect(new RegExpBuilder().join(['x', 'y', 'z'], { group, notRemember }).toRegExp().source).toBe('(?:xyz)');
	expect(new RegExpBuilder().join(['x', 'y', 'z'], { group, name: 'name1' }).toRegExp().source).toBe('(?<name1>:xyz)');
	expect(new RegExpBuilder().join([/x/, /y/, /z/]).toRegExp().source).toBe('xyz');
	expect(new RegExpBuilder().join([/x/, /y/, /z/], { group }).toRegExp().source).toBe('(xyz)');
	expect(new RegExpBuilder().join([/x/, /y/, /z/], { group, notRemember }).toRegExp().source).toBe('(?:xyz)');
	expect(new RegExpBuilder().join(['x', /y/, /z/], { group, name: 'name1' }).toRegExp().source).toBe('(?<name1>:xyz)');
	expect(new RegExpBuilder().join(['x', 'y', 'z'], { qualifier: '*' }).toRegExp().source).toBe('(xyz)*');
	expect(new RegExpBuilder().join(['x', 'y', 'z'], { qualifier: '*', notRememberQualifiedItem }).toRegExp().source).toBe('(?:xyz)*');
	expect(new RegExpBuilder().join(['x'], { qualifier: '*', groupQualifiedItem: false }).toRegExp().source).toBe('x*');
	// or
	expect(new RegExpBuilder().or(['x', 'y', 'z']).toRegExp().source).toBe('x|y|z');
	expect(new RegExpBuilder().or(['x', 'y', 'z'], { group }).toRegExp().source).toBe('(x|y|z)');
	expect(new RegExpBuilder().or(['x', 'y', 'z'], { group, notRemember }).toRegExp().source).toBe('(?:x|y|z)');
	expect(new RegExpBuilder().or(['x', 'y', 'z'], { group, name: 'name1' }).toRegExp().source).toBe('(?<name1>:x|y|z)');
	expect(new RegExpBuilder().or(['x', 'y', 'z'], { groupItem }).toRegExp().source).toBe('(x)|(y)|(z)');
	expect(new RegExpBuilder().or([/x/, 'y', 'z'], { groupItem, group }).toRegExp().source).toBe('((x)|(y)|(z))');
	// set
	expect(new RegExpBuilder().set('x').toRegExp().source).toBe('[x]');
	expect(new RegExpBuilder().set(['x', 'y', 'z']).toRegExp().source).toBe('[xyz]');
	expect(new RegExpBuilder().negatedSet(['x', 'y', 'z']).toRegExp().source).toBe('[^xyz]');
	// look
	expect(new RegExpBuilder().lookahead('x', 'y').toRegExp().source).toBe('x(?=y)');
	expect(new RegExpBuilder().negatedLookahead('x', 'y').toRegExp().source).toBe('x(?!y)');
	expect(new RegExpBuilder().lookbehind('x', 'y').toRegExp().source).toBe('(?<=y)x');
	expect(new RegExpBuilder().negatedLookbehind('x', 'y').toRegExp().source).toBe('(?<!y)x');
	// match whole
	expect(new RegExpBuilder().join('x').enableMatchWhole().toRegExp().source).toBe('^x$');
});

test(`${prefix}.define`, () => {
	const exp = new RegExpBuilder()
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
	const exp = new RegExpBuilder()
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
