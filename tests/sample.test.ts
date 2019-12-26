/* eslint-disable no-console */
import { RegExpCoder } from '../src/regExpCoder';

const prefix = 'test.regexp';
test(`${prefix}.sample.ipv4.join`, () => {
	const subIP = /(\d|\d\d|1\d\d|2[0-4]\d|25[0-5])/;
	const dot = /\./;
	const ipv4Exp = RegExpCoder.new()
		.join(
			subIP,
			dot,
			subIP,
			dot,
			subIP,
			dot,
			subIP,
		)
		.enableMatchWhole()
		.toRegExp();

	console.log(ipv4Exp.test('192.168.0.1')); // true
	console.log(ipv4Exp.test('192-168-0-1')); // false

	expect(ipv4Exp.test('0.0.0.0')).toBe(true);
	expect(ipv4Exp.test('255.255.255.255')).toBe(true);
	expect(ipv4Exp.test('192.168.0.1')).toBe(true);
	expect(ipv4Exp.test('192.168.0.001')).toBe(false);
	expect(ipv4Exp.test('256.256.256.256')).toBe(false);
	expect(ipv4Exp.test('192-168-0-1')).toBe(false);
});

test(`${prefix}.sample.ipv4.define`, () => {
	const ipv4Exp = RegExpCoder.new()
		.define('sub-ip', /(\d|\d\d|1\d\d|2[0-4]\d|25[0-5])/)
		.define('dot', /\./)
		.join(
			'sub-ip',
			'dot',
			'sub-ip',
			'dot',
			'sub-ip',
			'dot',
			'sub-ip',
		)
		.enableMatchWhole()
		.toRegExp();

	console.log(ipv4Exp.test('192.168.0.1')); // true
	console.log(ipv4Exp.test('192-168-0-1')); // false

	expect(ipv4Exp.test('0.0.0.0')).toBe(true);
	expect(ipv4Exp.test('255.255.255.255')).toBe(true);
	expect(ipv4Exp.test('192.168.0.1')).toBe(true);
	expect(ipv4Exp.test('192.168.0.001')).toBe(false);
	expect(ipv4Exp.test('256.256.256.256')).toBe(false);
	expect(ipv4Exp.test('192-168-0-1')).toBe(false);
});

test(`${prefix}.sample.ipv4.stash`, () => {
	const ipv4Exp = RegExpCoder.new()
		.group(
			RegExpCoder.new().or(
				/\d/,
				/\d\d/,
				/1\d\d/,
				/2[0-4]\d/,
				/25[0-5]/,
			),
		)
		.stash('sub-ip')
		.define('dot', /\./)
		.join(
			'sub-ip',
			'dot',
			'sub-ip',
			'dot',
			'sub-ip',
			'dot',
			'sub-ip',
		)
		.enableMatchWhole()
		.toRegExp();

	console.log(ipv4Exp.test('192.168.0.1'));
	console.log(ipv4Exp.test('192-168-0-1'));

	expect(ipv4Exp.test('0.0.0.0')).toBe(true);
	expect(ipv4Exp.test('255.255.255.255')).toBe(true);
	expect(ipv4Exp.test('192.168.0.1')).toBe(true);
	expect(ipv4Exp.test('192.168.0.001')).toBe(false);
	expect(ipv4Exp.test('256.256.256.256')).toBe(false);
	expect(ipv4Exp.test('192-168-0-1')).toBe(false);
});


test(`${prefix}.sample.ipv4.options`, () => {
	const group = true;
	const ipv4Exp = RegExpCoder.new()
		.or(
			/\d/,
			/\d\d/,
			/1\d\d/,
			/2[0-4]\d/,
			/25[0-5]/,
			{ group }, // <-- Use options here
		)
		.stash('sub-ip')
		.define('dot', /\./)
		.join(
			'sub-ip',
			'dot',
			'sub-ip',
			'dot',
			'sub-ip',
			'dot',
			'sub-ip',
		)
		.enableMatchWhole()
		.toRegExp();

	console.log(ipv4Exp.test('192.168.0.1')); // true
	console.log(ipv4Exp.test('192-168-0-1')); // false

	expect(ipv4Exp.test('0.0.0.0')).toBe(true);
	expect(ipv4Exp.test('255.255.255.255')).toBe(true);
	expect(ipv4Exp.test('192.168.0.1')).toBe(true);
	expect(ipv4Exp.test('192.168.0.001')).toBe(false);
	expect(ipv4Exp.test('256.256.256.256')).toBe(false);
	expect(ipv4Exp.test('192-168-0-1')).toBe(false);
});
