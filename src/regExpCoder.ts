// eslint-disable-next-line import/no-cycle
import { RegExpOptions } from './regExpOptions';
import { RegExpSpec } from './regExpSpec';

/**
 * RegExp Param
 */
export type RegExpParam = undefined | string | RegExp | RegExpCoder | RegExpOptions;

const Or: string = '|';
const Not: string = '^';

/**
 * Regular Expression Coder
 * 
 * @see [Regular Expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)
 */
export class RegExpCoder {
	/**
	 * Chars that need escaped
	 */
	private static escapedChars = new Map<string, string>([
		['^', '\\^'],
		['\\', '\\\\'],
		['.', '\\.'],
		['(', '\\('],
		[')', '\\)'],
		['[', '\\['],
		[']', '\\]'],
		['?', '\\?'],
		['+', '\\+'],
		['*', '\\*'],
		['|', '\\|'],
		['$', '\\$'],
	]);

	/**
	 * Chars that need escaped in a set expression.
	 */
	private static escapedSetChars = new Map<string, string>([
		['^', '\\^'],
		['\\', '\\\\'],
		[']', '\\]'],
		['-', '\\-'],
	]);

	// variables 
	private variables: Map<string, string> = new Map<string, string>();

	// the final regular expression
	private result: string = '';

	// if enable match whole
	private isMatchWhole: boolean = false;

	/**
	 * Create an instance of RegExpCoder
	 */
	static new(): RegExpCoder {
		return new RegExpCoder();
	}

	/**
	 * Get the last options if there is
	 * @param exp the expression
	 */
	private getParamOptions(...exp: RegExpParam[]): undefined | RegExpOptions {
		if (!this) {
			return undefined;
		}

		if (!exp) {
			return undefined;
		}

		const lastParam = exp[exp.length - 1];
		if (!lastParam) {
			return undefined;
		}

		if (typeof lastParam === 'string' || lastParam instanceof RegExpCoder || lastParam instanceof RegExp) {
			return undefined;
		}

		if (lastParam.expression) {
			return undefined;
		}

		return lastParam;
	}

	/**
	 * Apply options to a specific expression
	 * @param exp the expression
	 * @param options the options
	 */
	private applyOptions(exp: string, options?: RegExpOptions): string {
		if (!this) {
			return '';
		}

		let source = exp;
		// case: set
		if (options && options.negatedSet) {
			// case: negatedSet
			source = `[${Not}${source}]`;
		} else if (options && options.set) {
			// case: set
			source = `[${source}]`;
		}

		// qualifier
		if (options && options.qualifier) {
			// groupQualifiedItem's defalt value is true, as qualifier operations are in high priority
			if (options.groupQualifiedItem === undefined || options.groupQualifiedItem) {
				source = `(${options.notRememberQualifiedItem ? '?:' : ''}${source})`;
			}
			source = `${source}${options.qualifier}`;
		}

		// case: group
		if (options && options.group) {
			if (options.notRemember) {
				source = `(?:${source})`;
			} else {
				const name = options.name || '';
				source = `(${name.length > 0 ? `?<${name}>:` : ''}${source})`;
			}
		}

		return source;
	}

	/**
 * Get the source of an expression or a variable
 * @param exp the expression
 */
	private getSource(exp: RegExpParam): string {
		if (!exp) {
			return '';
		}

		// case: string
		if (typeof exp === 'string') {
			if (this.variables.has(exp)) {
				// case: variable
				return this.variables.get(exp)!;
			}
			return exp;
		}

		// case: RegExp
		if (exp instanceof RegExp) {
			return exp.source;
		}

		// case: RegExpCoder
		if (exp instanceof RegExpCoder) {
			return exp.source;
		}

		// case: RegExpOptions
		if (exp.expression) {
			return this.applyOptions(this.getSource(exp.expression), exp);
		}

		// case: RegExpOptions without expression, 
		// return empty, the option will be used by outside
		return '';
	}

	/**
	 * create an expression
	 * @param exp the expression 
	 */
	private build(...exp: RegExpParam[]): string {
		let source = '';
		if (!exp) {
			return source;
		}

		const totalOptions = this.getParamOptions(...exp);

		exp.forEach((item, index) => {
			let itemSource = this.getSource(item);
			if (itemSource) {
				if (totalOptions && totalOptions.groupItem) {
					itemSource = `(${itemSource})`;
				}
				let or = '';
				if (index > 0 && totalOptions && totalOptions.or) {
					or = Or;
				}
				source += `${or}${itemSource}`;
			}
		});

		return this.applyOptions(source, totalOptions);
	}

	/**
	 * Encode a raw string to a regular expression string.  
	 * Following special characters will be encoded: `^\.()[]?+*|$`
	 * 
	 * For set case, encoded characters: `^\-]`  
	 * Rules: 
	 * - escape `^` only when it is the first char
	 * - escape `-` only when it is not the first char and not the last char
	 * - escaped `\]` always
	 * @param raw the raw string 
	 * @param forSet if for set `[]` operation
	 */
	static encodeRegExp(raw: string, forSet = false): string {
		if (!raw) {
			return raw;
		}

		let ret = '';
		for (let index = 0; index < raw.length; index += 1) {
			const char = raw.charAt(index);
			if (forSet) {
				let newChar = RegExpCoder.escapedSetChars.get(char);
				if (char === '^' && index !== 0) {
					newChar = undefined;
				} else if (char === '-' && (index === 0 || index === raw.length - 1)) {
					newChar = undefined;
				}
				ret += newChar || char;
			} else {
				const newChar = RegExpCoder.escapedChars.get(char);
				ret += newChar || char;
			}
		}

		return ret;
	}

	/**
	 * `xy`  
	 * Define a variable
	 * @param name the variable name
	 * @param exp the variable expression
	 */
	public define(name: string,
		...exp: RegExpParam[]): RegExpCoder {
		this.variables.set(name, this.build(...exp, this.getParamOptions(...exp)));
		return this;
	}

	/**
	 * `(xy)`  
	 * Define a variable for group operation
	 * @param name the variable name
	 * @param exp the variable expression
	 */
	public defineGroup(name: string,
		...exp: RegExpParam[]): RegExpCoder {
		this.variables.set(name, this.build(...exp, { group: true, ...this.getParamOptions(...exp) }));
		return this;
	}

	/**
	 * `x|y`  
	 * Define a variable for or operation
	 * @param name the variable name
	 * @param exp the variable expression
	 */
	public defineOr(name: string,
		...exp: RegExpParam[]): RegExpCoder {
		this.variables.set(name, this.build(...exp, { or: true, ...this.getParamOptions(...exp) }));
		return this;
	}

	/**
	 * `[xy]`  
	 * Define a variable for set
	 * @param name the variable name
	 * @param exp the variable expression
	 */
	public defineSet(name: string,
		...exp: RegExpParam[]): RegExpCoder {
		this.variables.set(name, this.build(...exp, { set: true, ...this.getParamOptions(...exp) }));
		return this;
	}

	/**
	 * `[^xy]`  
	 * Define a variable for negated set
	 * @param name the variable name
	 * @param exp the variable expression
	 */
	public defineNegatedSet(name: string,
		...exp: RegExpParam[]): RegExpCoder {
		this.variables.set(name, this.build(...exp,
			{ negatedSet: true, ...this.getParamOptions(...exp) }));
		return this;
	}

	/**
	 * `x(?=y)`  
	 * Define a lookahead variable
	 * @param name the variable name
	 * @param exp the variable expression
	 * @param exp2 the variable expression
	 * @param options the build options
	 */
	public defineLookahead(name: string,
		exp: string | RegExp | RegExpCoder,
		exp2: string | RegExp | RegExpCoder,
		options?: RegExpOptions): RegExpCoder {
		this.variables.set(name, this.build(
			`${this.getSource(exp)}(?=${this.getSource(exp2)})`,
			options,
		));
		return this;
	}

	/**
	 * `x(?!y)`  
	 * Define a negated lookahead variable
	 * @param name the variable name
	 * @param exp the variable expression
	 * @param exp2 the variable expression
	 * @param options the build options
	 */
	public defineNegatedLookahead(name: string,
		exp: string | RegExp | RegExpCoder,
		exp2: string | RegExp | RegExpCoder,
		options?: RegExpOptions): RegExpCoder {
		this.variables.set(name, this.build(
			`${this.getSource(exp)}(?!${this.getSource(exp2)})`,
			options,
		));
		return this;
	}

	/**
	 * `(?<=y)x`  
	 * Define a lookbehind variable
	 * @param name the variable name
	 * @param exp the variable expression
	 * @param exp2 the variable expression
	 * @param options the build options
	 */
	public defineLookbehind(name: string,
		exp: string | RegExp | RegExpCoder,
		exp2: string | RegExp | RegExpCoder,
		options?: RegExpOptions): RegExpCoder {
		this.variables.set(name, this.build(
			`(?<=${this.getSource(exp2)})${this.getSource(exp)}`,
			options,
		));
		return this;
	}

	/**
	 * `(?<!y)x`  
	 * Define a negated lookbehind variable
	 * @param name the variable name
	 * @param exp the variable expression
	 * @param exp2 the variable expression
	 * @param options the build options
	 */
	public defineNegatedLookbehind(name: string,
		exp: string | RegExp | RegExpCoder,
		exp2: string | RegExp | RegExpCoder,
		options?: RegExpOptions): RegExpCoder {
		this.variables.set(name, this.build(
			`(?<!${this.getSource(exp2)})${this.getSource(exp)}`,
			options,
		));
		return this;
	}

	/**
	 * Stash the current expression as a variable.
	 * @param name the variable name
	 */
	public stash(name: string): RegExpCoder {
		this.variables.set(name, this.result);
		this.result = '';
		return this;
	}

	/**
	 * `xy`  
	 * Append an expression 
	 * @param exp the expression 
	 */
	public join(...exp: RegExpParam[]): RegExpCoder {
		const source = this.build(...exp);
		this.result += source;
		return this;
	}

	/**
	 * `(xy)`  
	 * Append an expression for or operation
	 * @param exp the expression 
	 */
	public group(...exp: RegExpParam[]): RegExpCoder {
		const source = this.build(...exp, { group: true, ...this.getParamOptions(...exp) });
		this.result += source;
		return this;
	}

	/**
	 * `x|y`  
	 * Append an expression for or operation
	 * @param exp the expression 
	 */
	public or(...exp: RegExpParam[]): RegExpCoder {
		const source = this.build(...exp, { or: true, ...this.getParamOptions(...exp) });
		this.result += source;
		return this;
	}

	/**
	 * `[xy]`  
	 * Append an expression for set
	 * @param exp the expression 
	 */
	public set(...exp: RegExpParam[]): RegExpCoder {
		const source = this.build(...exp, { set: true, ...this.getParamOptions(...exp) });
		this.result += source;
		return this;
	}

	/**
	 * `[^xy]`  
	 * Append an expression for negated set
	 * @param exp the expression 
	 */
	public negatedSet(...exp: RegExpParam[]): RegExpCoder {
		const source = this.build(...exp, { negatedSet: true, ...this.getParamOptions(...exp) });
		this.result += source;
		return this;
	}

	/**
	 * `x(?=y)`  
	 * Append a lookahead expression
	 * @param exp the variable expression
	 * @param exp2 the variable expression
	 * @param options the build options
	 */
	public lookahead(exp: string | RegExp | RegExpCoder,
		exp2: string | RegExp | RegExpCoder,
		options?: RegExpOptions): RegExpCoder {
		const source = this.build(
			`${this.getSource(exp)}(?=${this.getSource(exp2)})`,
			options,
		);
		this.result += source;
		return this;
	}

	/**
	 * `x(?!y)`  
	 * Append a negated lookahead expression
	 * @param exp the variable expression
	 * @param exp2 the variable expression
	 * @param options the build options
	 */
	public negatedLookahead(exp: string | RegExp | RegExpCoder,
		exp2: string | RegExp | RegExpCoder,
		options?: RegExpOptions): RegExpCoder {
		const source = this.build(
			`${this.getSource(exp)}(?!${this.getSource(exp2)})`,
			options,
		);
		this.result += source;
		return this;
	}

	/**
	 * `(?<=y)x`  
	 * Append a lookbehind expression
	 * @param exp the variable expression
	 * @param exp2 the variable expression
	 * @param options the build options
	 */
	public lookbehind(exp: string | RegExp | RegExpCoder,
		exp2: string | RegExp | RegExpCoder,
		options?: RegExpOptions): RegExpCoder {
		const source = this.build(
			`(?<=${this.getSource(exp2)})${this.getSource(exp)}`,
			options,
		);
		this.result += source;
		return this;
	}

	/**
	 * `(?<!y)x`  
	 * Append a negated lookbehind expression.
	 * @param exp the variable expression
	 * @param exp2 the variable expression
	 * @param options the build options
	 */
	public negatedLookbehind(exp: string | RegExp | RegExpCoder,
		exp2: string | RegExp | RegExpCoder,
		options?: RegExpOptions): RegExpCoder {
		const source = this.build(
			`(?<!${this.getSource(exp2)})${this.getSource(exp)}`,
			options,
		);
		this.result += source;
		return this;
	}

	/**
	 * `(?<name>:`..
	 * Begin a group
	 * @param name the group name
	 */
	public beginGroup(name?: string): RegExpCoder {
		this.result += `(${name ? `?<${name}>:` : ''}`;
		return this;
	}

	/**
	 * `)`..
	 * End a group
	 * @param name the group name
	 */
	public endGroup(name?: string): RegExpCoder {
		if (name) {
			this.result += ')';
		}
		this.result += ')';
		return this;
	}

	/**
	 * Enable match whole
	 */
	public enableMatchWhole(): RegExpCoder {
		this.isMatchWhole = true;
		return this;
	}

	/**
	 * Clear the content
	 * @param keepDefinitions if keep the definitions
	 */
	public clear(keepDefinitions: boolean = false) {
		this.result = '';
		this.isMatchWhole = false;
		if (!keepDefinitions) {
			this.variables = new Map<string, string>();
		}
		return this;
	}

	/**
	 * Get the build result
	 * @param flags flags
	 */
	public toRegExp(flags?: string): RegExp {
		let exp = this.result;
		if (this.isMatchWhole) {
			exp = `${RegExpSpec.begin}${exp}${RegExpSpec.end}`;
		}
		return new RegExp(exp, flags);
	}

	/**
	 * Get source
	 */
	public get source(): string {
		return this.result;
	}
}
