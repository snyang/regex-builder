import ValidatePattern from '../examples/validatePattern';

const prefix = 'test.regexp';
test(`${prefix}.validatePattern.emailAddress`, () => {
	expect(ValidatePattern.validateEmailAddress('1@1')).toBe(true);
	expect(ValidatePattern.validateEmailAddress('my.name@g.mail.com')).toBe(true);
	expect(ValidatePattern.validateEmailAddress('12@112')).toBe(true);
	expect(ValidatePattern.validateEmailAddress('1.1@1.1')).toBe(true);
	expect(ValidatePattern.validateEmailAddress('12.13@14.15')).toBe(true);
	expect(ValidatePattern.validateEmailAddress('12.@14.15')).toBe(false);
	expect(ValidatePattern.validateEmailAddress('12.13@14.')).toBe(false);
	expect(ValidatePattern.validateEmailAddress('12.13@')).toBe(false);
	expect(ValidatePattern.validateEmailAddress('111')).toBe(false);
	expect(ValidatePattern.validateEmailAddress('@@@')).toBe(false);
	expect(ValidatePattern.validateEmailAddress('王@王')).toBe(false);
});
