import { CsvPattern } from '../examples/separatedValuesPattern';

const prefix = 'test.regexp';
test(`${prefix}.separatedValuesPattern.csv`, () => {
	const expRow = CsvPattern.getCsvRowExp({
		qualifier: '"',
		separator: '\\n',
	});
	const exp = CsvPattern.getCsvCellExp({
		qualifier: '"',
		escaper: '"',
		escaped: '"',
		separator: ',',
	});
	const str = `abc,"e"",\ndf",,hij

123,456,789`;
	let match = expRow.exec(str);
	let rowString = match![0];
	expect(rowString).toBe('abc,"e"",\ndf",,hij');
	let matchData = exp.exec(rowString);
	exp.lastIndex += 1;
	expect(matchData![0]).toBe('abc');
	matchData = exp.exec(rowString);
	exp.lastIndex += 1;
	expect(matchData![0]).toBe('"e"",\ndf"');
	matchData = exp.exec(rowString);
	exp.lastIndex += 1;
	expect(matchData![0]).toBe('');
	matchData = exp.exec(rowString);
	exp.lastIndex += 1;
	expect(matchData![0]).toBe('hij');
	matchData = exp.exec(rowString);
	exp.lastIndex += 1;
	expect(matchData).toBe(null);

	match = expRow.exec(str);
	expRow.lastIndex += 1;
	[rowString] = match!;
	expect(rowString).toBe('');
	matchData = exp.exec(rowString);
	exp.lastIndex += 1;
	expect(matchData).toBe(null);
});
