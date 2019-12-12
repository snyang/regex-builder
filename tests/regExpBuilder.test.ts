import RegExpBuilder from '../src/regExpBuilder';

const group = true;
const groupItem = true;
const notRemember = true;

const prefix = 'test.regexp';
test(`${prefix}.concat`, () => {
	// concat single
	expect(new RegExpBuilder().concat('x').toRegExp().source).toBe('x');
	expect(new RegExpBuilder().concat('x', { group }).toRegExp().source).toBe('(x)');
	expect(new RegExpBuilder().concat('x', { group, notRemember }).toRegExp().source).toBe('(?:x)');
	expect(new RegExpBuilder().concat('x', { group, name: 'name1' }).toRegExp().source).toBe('(?<name1>:x)');
	expect(new RegExpBuilder().concat(/x/).toRegExp().source).toBe('x');
	expect(new RegExpBuilder().concat(/x/, { group }).toRegExp().source).toBe('(x)');
	expect(new RegExpBuilder().concat(/x/, { group, notRemember }).toRegExp().source).toBe('(?:x)');
	expect(new RegExpBuilder().concat(/x/, { group, name: 'name1' }).toRegExp().source).toBe('(?<name1>:x)');
	// concat multiple 
	expect(new RegExpBuilder().concat(['x', 'y', 'z']).toRegExp().source).toBe('xyz');
	expect(new RegExpBuilder().concat(['x', 'y', 'z'], { group }).toRegExp().source).toBe('(xyz)');
	expect(new RegExpBuilder().concat(['x', 'y', 'z'], { group, notRemember }).toRegExp().source).toBe('(?:xyz)');
	expect(new RegExpBuilder().concat(['x', 'y', 'z'], { group, name: 'name1' }).toRegExp().source).toBe('(?<name1>:xyz)');
	expect(new RegExpBuilder().concat([/x/, /y/, /z/]).toRegExp().source).toBe('xyz');
	expect(new RegExpBuilder().concat([/x/, /y/, /z/], { group }).toRegExp().source).toBe('(xyz)');
	expect(new RegExpBuilder().concat([/x/, /y/, /z/], { group, notRemember }).toRegExp().source).toBe('(?:xyz)');
	expect(new RegExpBuilder().concat(['x', /y/, /z/], { group, name: 'name1' }).toRegExp().source).toBe('(?<name1>:xyz)');
	// concatOr
	expect(new RegExpBuilder().concatOr(['x', 'y', 'z']).toRegExp().source).toBe('x|y|z');
	expect(new RegExpBuilder().concatOr(['x', 'y', 'z'], { group }).toRegExp().source).toBe('(x|y|z)');
	expect(new RegExpBuilder().concatOr(['x', 'y', 'z'], { group, notRemember }).toRegExp().source).toBe('(?:x|y|z)');
	expect(new RegExpBuilder().concatOr(['x', 'y', 'z'], { group, name: 'name1' }).toRegExp().source).toBe('(?<name1>:x|y|z)');
	expect(new RegExpBuilder().concatOr(['x', 'y', 'z'], { groupItem }).toRegExp().source).toBe('(x)|(y)|(z)');
	expect(new RegExpBuilder().concatOr([/x/, 'y', 'z'], { groupItem, group }).toRegExp().source).toBe('((x)|(y)|(z))');
	// concatSet
	expect(new RegExpBuilder().concatSet('x').toRegExp().source).toBe('[x]');
	expect(new RegExpBuilder().concatSet(['x', 'y', 'z']).toRegExp().source).toBe('[xyz]');
	expect(new RegExpBuilder().concatNegatedSet(['x', 'y', 'z']).toRegExp().source).toBe('[^xyz]');
	// look
	expect(new RegExpBuilder().concatLookahead('x', 'y').toRegExp().source).toBe('x(?=y)');
	expect(new RegExpBuilder().concatNegatedLookahead('x', 'y').toRegExp().source).toBe('x(?!y)');
	expect(new RegExpBuilder().concatLookbehind('x', 'y').toRegExp().source).toBe('(?<=y)x');
	expect(new RegExpBuilder().concatNegatedLookbehind('x', 'y').toRegExp().source).toBe('(?<!y)x');
	// match whole
	expect(new RegExpBuilder().concat('x').enableMatchWhole().toRegExp().source).toBe('^x$');
});

test(`${prefix}.define`, () => {
	const exp = new RegExpBuilder()
		.define('a', 'x')
		.define('b', /y/);
	// concat single
	expect(exp.concat('a').toRegExp().source).toBe('x');
	exp.clear(true);
	expect(exp.concat('a', { group }).toRegExp().source).toBe('(x)');
	exp.clear(true);
	expect(exp.concat('a', { group, notRemember }).toRegExp().source).toBe('(?:x)');
	exp.clear(true);
	expect(exp.concat('a', { group, name: 'name1' }).toRegExp().source).toBe('(?<name1>:x)');
	exp.clear(true);
	// concat multiple 
	expect(exp.concat(['a', 'b', 'z']).toRegExp().source).toBe('xyz');
	exp.clear(true);
	expect(exp.concat(['a', 'b', 'z'], { group }).toRegExp().source).toBe('(xyz)');
	exp.clear(true);
	expect(exp.concat(['a', 'b', 'z'], { group, notRemember }).toRegExp().source).toBe('(?:xyz)');
	exp.clear(true);
	expect(exp.concat(['a', 'b', /z/], { group, name: 'name1' }).toRegExp().source).toBe('(?<name1>:xyz)');
	exp.clear(true);
	// concatOr
	expect(exp.concatOr(['a', 'b', 'z']).toRegExp().source).toBe('x|y|z');
	exp.clear(true);
	expect(exp.concatOr(['a', 'b', 'z'], { group }).toRegExp().source).toBe('(x|y|z)');
	exp.clear(true);
	expect(exp.concatOr(['a', 'b', 'z'], { group, notRemember }).toRegExp().source).toBe('(?:x|y|z)');
	exp.clear(true);
	expect(exp.concatOr(['a', 'b', 'z'], { group, name: 'name1' }).toRegExp().source).toBe('(?<name1>:x|y|z)');
	exp.clear(true);
	expect(exp.concatOr(['a', 'b', 'z'], { groupItem }).toRegExp().source).toBe('(x)|(y)|(z)');
	exp.clear(true);
	expect(exp.concatOr(['a', 'b', /z/], { groupItem, group }).toRegExp().source).toBe('((x)|(y)|(z))');
	exp.clear(true);
	// concatSet
	expect(exp.concatSet('a').toRegExp().source).toBe('[x]');
	exp.clear(true);
	expect(exp.concatSet(['a', 'b', 'z']).toRegExp().source).toBe('[xyz]');
	exp.clear(true);
	expect(exp.concatNegatedSet(['a', 'b', 'z']).toRegExp().source).toBe('[^xyz]');
	exp.clear(true);
	// look
	expect(exp.concatLookahead('a', 'b').toRegExp().source).toBe('x(?=y)');
	exp.clear(true);
	expect(exp.concatNegatedLookahead('a', 'b').toRegExp().source).toBe('x(?!y)');
	exp.clear(true);
	expect(exp.concatLookbehind('a', 'b').toRegExp().source).toBe('(?<=y)x');
	exp.clear(true);
	expect(exp.concatNegatedLookbehind('a', 'b').toRegExp().source).toBe('(?<!y)x');
	exp.clear(true);
	// match whole
	expect(exp.concat('a').enableMatchWhole().toRegExp().source).toBe('^x$');
});

test(`${prefix}.concat.stash`, () => {
	const exp = new RegExpBuilder()
		.concat('x')
		.stash('a')
		.concat(/y/)
		.stash('b');
	// concat single
	expect(exp.concat('a').toRegExp().source).toBe('x');
	exp.clear(true);
	expect(exp.concat('a', { group }).toRegExp().source).toBe('(x)');
	exp.clear(true);
	expect(exp.concat('a', { group, notRemember }).toRegExp().source).toBe('(?:x)');
	exp.clear(true);
	expect(exp.concat('a', { group, name: 'name1' }).toRegExp().source).toBe('(?<name1>:x)');
	exp.clear(true);
	// concat multiple 
	expect(exp.concat(['a', 'b', 'z']).toRegExp().source).toBe('xyz');
	exp.clear(true);
	expect(exp.concat(['a', 'b', 'z'], { group }).toRegExp().source).toBe('(xyz)');
	exp.clear(true);
	expect(exp.concat(['a', 'b', 'z'], { group, notRemember }).toRegExp().source).toBe('(?:xyz)');
	exp.clear(true);
	expect(exp.concat(['a', 'b', /z/], { group, name: 'name1' }).toRegExp().source).toBe('(?<name1>:xyz)');
	exp.clear(true);
	// concatOr
	expect(exp.concatOr(['a', 'b', 'z']).toRegExp().source).toBe('x|y|z');
	exp.clear(true);
	expect(exp.concatOr(['a', 'b', 'z'], { group }).toRegExp().source).toBe('(x|y|z)');
	exp.clear(true);
	expect(exp.concatOr(['a', 'b', 'z'], { group, notRemember }).toRegExp().source).toBe('(?:x|y|z)');
	exp.clear(true);
	expect(exp.concatOr(['a', 'b', 'z'], { group, name: 'name1' }).toRegExp().source).toBe('(?<name1>:x|y|z)');
	exp.clear(true);
	expect(exp.concatOr(['a', 'b', 'z'], { groupItem }).toRegExp().source).toBe('(x)|(y)|(z)');
	exp.clear(true);
	expect(exp.concatOr(['a', 'b', /z/], { groupItem, group }).toRegExp().source).toBe('((x)|(y)|(z))');
	exp.clear(true);
	// concatSet
	expect(exp.concatSet('a').toRegExp().source).toBe('[x]');
	exp.clear(true);
	expect(exp.concatSet(['a', 'b', 'z']).toRegExp().source).toBe('[xyz]');
	exp.clear(true);
	expect(exp.concatNegatedSet(['a', 'b', 'z']).toRegExp().source).toBe('[^xyz]');
	exp.clear(true);
	// look
	expect(exp.concatLookahead('a', 'b').toRegExp().source).toBe('x(?=y)');
	exp.clear(true);
	expect(exp.concatNegatedLookahead('a', 'b').toRegExp().source).toBe('x(?!y)');
	exp.clear(true);
	expect(exp.concatLookbehind('a', 'b').toRegExp().source).toBe('(?<=y)x');
	exp.clear(true);
	expect(exp.concatNegatedLookbehind('a', 'b').toRegExp().source).toBe('(?<!y)x');
	exp.clear(true);
	// match whole
	expect(exp.concat('a').enableMatchWhole().toRegExp().source).toBe('^x$');
});
