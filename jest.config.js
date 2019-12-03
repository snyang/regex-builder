const { defaults } = require('jest-config');
module.exports = {
	transform: {
		".(ts|tsx)": 'ts-jest'
	},
	testMatch: ["<rootDir>/tests/**/*.(test|spec).(js|ts)"],
	moduleFileExtensions: ['ts', 'js'],
};
