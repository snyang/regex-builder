import RegExpOptions from './regExpOptions';
import RegExpToken from './regExpToken';

/**
 * RegExp Param
 */
export type RegExpParam =
	string | RegExp | RegExpBuilder
	| (string | RegExp | RegExpBuilder)[];

const Or: string = '|';
const Not: string = '^';

/**
 * Regular Expression Builder
 * 
 * @see [Regular Expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)
 */
export default class RegExpBuilder {
	// variables 
	private variables: Map<string, string> = new Map<string, string>();

	// the final regular expression
	private result: string = '';

	// if enable match whole
	private isMatchWhole: boolean = false;

	static new(): RegExpBuilder {
		return new RegExpBuilder();
	}

	/**
	 * Get the source of an expression or a variable
	 * @param exp the expression
	 */
	private getSource(exp: string | RegExp | RegExpBuilder): string {
		if (!exp) {
			return '';
		}

		if (typeof exp === 'string') {
			if (this.variables.has(exp)) {
				return this.variables.get(exp);
			}
			return exp;
		}

		if (exp instanceof RegExp) {
			return exp.source;
		}

		return exp.source;
	}

	/**
	 * create an expression
	 * @param exp the expression 
	 * @param options the build options
	 */
	private build(exp: RegExpParam,
		options?: RegExpOptions): string {
		let source = '';
		if (exp === undefined) {
			return source;
		}
		if (typeof exp === 'string'
			|| exp instanceof RegExp
			|| exp instanceof RegExpBuilder) {
			source = this.getSource(exp);
		} else {
			exp.forEach((item, index) => {
				let itemSource = this.getSource(item);
				if (options && options.groupItem) {
					itemSource = `(${itemSource})`;
				}
				let or = '';
				if (index > 0 && options && options.or) {
					or = Or;
				}
				source += `${or}${itemSource}`;
			});
		}

		// case: set
		// case: negated, work with set
		if (options && options.negated) {
			source = `${Not}${source}`;
		}
		if (options && options.set) {
			source = `[${source}]`;
		}

		// qualifier
		if (options && options.qualifier) {
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
	 * `xy`  
	 * Define a variable
	 * @param name the variable name
	 * @param exp the variable expression
	 * @param options the build options
	 */
	public define(name: string,
		exp: RegExpParam,
		options?: RegExpOptions): RegExpBuilder {
		this.variables.set(name, this.build(exp, options));
		return this;
	}

	/**
	 * `(xy)`  
	 * Define a variable for group operation
	 * @param name the variable name
	 * @param exp the variable expression
	 * @param options the build options
	 */
	public defineGroup(name: string,
		exp: RegExpParam,
		options?: RegExpOptions): RegExpBuilder {
		this.variables.set(name, this.build(exp, { group: true, ...options }));
		return this;
	}

	/**
	 * `x|y`  
	 * Define a variable for or operation
	 * @param name the variable name
	 * @param exp the variable expression
	 * @param options the build options
	 */
	public defineOr(name: string,
		exp: RegExpParam,
		options?: RegExpOptions): RegExpBuilder {
		this.variables.set(name, this.build(exp, { or: true, ...options }));
		return this;
	}

	/**
	 * `[xy]`  
	 * Define a variable for set
	 * @param name the variable name
	 * @param exp the variable expression
	 * @param options the build options
	 */
	public defineSet(name: string,
		exp: RegExpParam,
		options?: RegExpOptions): RegExpBuilder {
		this.variables.set(name, this.build(exp, { set: true, ...options }));
		return this;
	}

	/**
	 * `[^xy]`  
	 * Define a variable for negated set
	 * @param name the variable name
	 * @param exp the variable expression
	 * @param options the build options
	 */
	public defineNegatedSet(name: string,
		exp: RegExpParam,
		options?: RegExpOptions): RegExpBuilder {
		this.variables.set(name, this.build(exp, { set: true, negated: true, ...options }));
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
		exp: string | RegExp | RegExpBuilder,
		exp2: string | RegExp | RegExpBuilder,
		options?: RegExpOptions): RegExpBuilder {
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
		exp: string | RegExp | RegExpBuilder,
		exp2: string | RegExp | RegExpBuilder,
		options?: RegExpOptions): RegExpBuilder {
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
		exp: string | RegExp | RegExpBuilder,
		exp2: string | RegExp | RegExpBuilder,
		options?: RegExpOptions): RegExpBuilder {
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
		exp: string | RegExp | RegExpBuilder,
		exp2: string | RegExp | RegExpBuilder,
		options?: RegExpOptions): RegExpBuilder {
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
	public stash(name: string): RegExpBuilder {
		this.variables.set(name, this.result);
		this.result = '';
		return this;
	}

	/**
	 * `xy`  
	 * Append an expression 
	 * @param exp the expression 
	 * @param options the build options
	 */
	public join(exp: RegExpParam,
		options?: RegExpOptions): RegExpBuilder {
		const source = this.build(exp, options);
		this.result += source;
		return this;
	}

	/**
	 * `(xy)`  
	 * Append an expression for or operation
	 * @param exp the expression 
	 * @param options the build options
	 */
	public group(exp: RegExpParam,
		options?: RegExpOptions): RegExpBuilder {
		const source = this.build(exp, { group: true, ...options });
		this.result += source;
		return this;
	}

	/**
	 * `x|y`  
	 * Append an expression for or operation
	 * @param exp the expression 
	 * @param options the build options
	 */
	public or(exp: RegExpParam,
		options?: RegExpOptions): RegExpBuilder {
		const source = this.build(exp, { or: true, ...options });
		this.result += source;
		return this;
	}

	/**
	 * `[xy]`  
	 * Append an expression for set
	 * @param exp the expression 
	 * @param options the build options
	 */
	public set(exp: RegExpParam,
		options?: RegExpOptions): RegExpBuilder {
		const source = this.build(exp, { set: true, ...options });
		this.result += source;
		return this;
	}

	/**
	 * `[^xy]`  
	 * Append an expression for negated set
	 * @param exp the expression 
	 * @param options the build options
	 */
	public negatedSet(exp: RegExpParam,
		options?: RegExpOptions): RegExpBuilder {
		const source = this.build(exp, { set: true, negated: true, ...options });
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
	public lookahead(exp: string | RegExp | RegExpBuilder,
		exp2: string | RegExp | RegExpBuilder,
		options?: RegExpOptions): RegExpBuilder {
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
	public negatedLookahead(exp: string | RegExp | RegExpBuilder,
		exp2: string | RegExp | RegExpBuilder,
		options?: RegExpOptions): RegExpBuilder {
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
	public lookbehind(exp: string | RegExp | RegExpBuilder,
		exp2: string | RegExp | RegExpBuilder,
		options?: RegExpOptions): RegExpBuilder {
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
	public negatedLookbehind(exp: string | RegExp | RegExpBuilder,
		exp2: string | RegExp | RegExpBuilder,
		options?: RegExpOptions): RegExpBuilder {
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
	public beginGroup(name?: string): RegExpBuilder {
		this.result += `(${name ? `?<${name}>:` : ''}`;
		return this;
	}

	/**
	 * `)`..
	 * End a group
	 * @param name the group name
	 */
	public endGroup(name?: string): RegExpBuilder {
		if (name) {
			this.result += ')';
		}
		this.result += ')';
		return this;
	}

	/**
	 * Enable match whole
	 */
	public enableMatchWhole(): RegExpBuilder {
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
			exp = `${RegExpToken.begin}${exp}${RegExpToken.end}`;
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
