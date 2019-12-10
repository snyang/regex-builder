import ValidatePattern from '../src/validatePattern';

const prefix = 'test.regexp';
test(`${prefix}.ValidatePattern.email`, () => {
	expect(ValidatePattern.validateEmail('1@1')).toBe(true);
	expect(ValidatePattern.validateEmail('12@112')).toBe(true);
	expect(ValidatePattern.validateEmail('1.1@1.1')).toBe(true);
	expect(ValidatePattern.validateEmail('12.13@14.15')).toBe(true);
	expect(ValidatePattern.validateEmail('12.@14.15')).toBe(false);
	expect(ValidatePattern.validateEmail('12.13@14.')).toBe(false);
	expect(ValidatePattern.validateEmail('12.13@')).toBe(false);
	expect(ValidatePattern.validateEmail('111')).toBe(false);
	expect(ValidatePattern.validateEmail('@@@')).toBe(false);
	expect(ValidatePattern.validateEmail('王@王')).toBe(false);
});
