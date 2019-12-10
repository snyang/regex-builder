import BuildOptions from './buildOptions';

const Begin: string = '^'
const End: string = '$'
const Or: string = '|'
const Not: string = '^'

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
	// if enable match all
	private isMatchAll: boolean = false;

	/**
	 * Get the source of an expression or a variable
	 * @param exp the expression
	 */
	private getSource(exp: string | RegExp): string {
		if (!exp) {
			return '';
		}
		if (typeof exp === 'string') {
			if (this.variables.has(exp)) {
				return this.variables.get(exp);
			}
			return exp;
		}

		return exp.source;
	}

	/**
	 * create a expression
	 * @param exp the expression 
	 * @param options the build options
	 */
	private create(exp: string | RegExp | (string | RegExp)[],
		options?: BuildOptions): string {
		let source = '';
		if (typeof exp === 'string' || exp instanceof RegExp) {
			source = this.getSource(exp);
		} else {
			exp.forEach((item, index) => {
				let itemSource = this.getSource(item);
				if (options && options.groupItem) {
					itemSource = `(${itemSource})`
				}
				let or = ''
				if (index > 0 && options && options.or) {
					or = Or
				}
				source += `${or}${itemSource}`;
			});
		}

		//TODO: need an option for group options?
		if (options && options.qualifier) {
			source = `(?:${source})${options.qualifier}`;
		}

		// case: group
		if (options && options.group) {
			if (options.notRemember) {
				source = `(?:${source})`
			} else {
				const name = options.name || '';
				source = `(${name.length > 0 ? `?<${name}>` : ''}${source})`
			}
		}

		// case: set
		// case: negated, work with set
		if (options && options.negated) {
			source = `${Not}${source}`;
		}
		if (options && options.set) {
			source = `[${source}]`;
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
		exp: string | RegExp | (string | RegExp)[],
		options: BuildOptions): RegExpBuilder {
		this.variables.set(name, this.create(exp, options));
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
		exp: string | RegExp | (string | RegExp)[],
		options: BuildOptions): RegExpBuilder {
		this.variables.set(name, this.create(exp, { or: true, ...options }));
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
		exp: string | RegExp | (string | RegExp)[],
		options: BuildOptions): RegExpBuilder {
		this.variables.set(name, this.create(exp, { set: true, ...options }));
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
		exp: string | RegExp,
		exp2: string | RegExp,
		options: BuildOptions): RegExpBuilder {
		this.variables.set(name, this.create(
			`${this.getSource(exp)}(?=${this.getSource(exp2)})`,
			options));
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
		exp: string | RegExp,
		exp2: string | RegExp,
		options: BuildOptions): RegExpBuilder {
		this.variables.set(name, this.create(
			`${this.getSource(exp)}(?!${this.getSource(exp2)})`,
			options));
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
		exp: string | RegExp,
		exp2: string | RegExp,
		options: BuildOptions): RegExpBuilder {
		this.variables.set(name, this.create(
			`(?<=${this.getSource(exp2)})${this.getSource(exp)}`,
			options));
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
		exp: string | RegExp,
		exp2: string | RegExp,
		options: BuildOptions): RegExpBuilder {
		this.variables.set(name, this.create(
			`(?<!${this.getSource(exp2)})${this.getSource(exp)}`,
			options));
		return this;
	}

	/**
	 * Stash the current expression as a variable.
	 * @param name the variable name
	 */
	public stash(name: string): RegExpBuilder {
		this.variables.set(name, this.result);
		this.result = ''
		return this;
	}

	/**
	 * `xy`  
	 * Concatnate an expression 
	 * @param exp the expression 
	 * @param options the build options
	 */
	public concat(exp: string | RegExp | (string | RegExp)[],
		options?: BuildOptions): RegExpBuilder {
		let source = this.create(exp, options)
		this.result += source;
		return this;
	}

	/**
	 * `x|y`  
	 * Concatnate an expression for or operation
	 * @param exp the expression 
	 * @param options the build options
	 */
	public concatOr(exp: string | RegExp | (string | RegExp)[],
		options: BuildOptions): RegExpBuilder {
		let source = this.create(exp, { or: true, ...options });
		this.result += source;
		return this;
	}

	/**
	 * `[xy]`  
	 * Concatnate an expression for set
	 * @param exp the expression 
	 * @param options the build options
	 */
	public concatSet(exp: string | RegExp | (string | RegExp)[],
		options: BuildOptions): RegExpBuilder {
		let source = this.create(exp, { set: true, ...options });
		this.result += source;
		return this;
	}

	/**
	 * `x(?=y)`  
	 * Concatnate a lookahead expression
	 * @param exp the variable expression
	 * @param exp2 the variable expression
	 * @param options the build options
	 */
	public concatLookahead(exp: string | RegExp,
		exp2: string | RegExp,
		options: BuildOptions): RegExpBuilder {
		let source = this.create(
			`${this.getSource(exp)}(?=${this.getSource(exp2)})`,
			options);
		this.result += source;
		return this;
	}

	/**
	 * `x(?!y)`  
	 * Concatnate a negated lookahead expression
	 * @param exp the variable expression
	 * @param exp2 the variable expression
	 * @param options the build options
	 */
	public concatNegatedLookahead(exp: string | RegExp,
		exp2: string | RegExp,
		options: BuildOptions): RegExpBuilder {
		let source = this.create(
			`${this.getSource(exp)}(?!${this.getSource(exp2)})`,
			options);
		this.result += source;
		return this;
	}

	/**
	 * `(?<=y)x`  
	 * Concatnate a lookbehind expression
	 * @param exp the variable expression
	 * @param exp2 the variable expression
	 * @param options the build options
	 */
	public concatLookbehind(exp: string | RegExp,
		exp2: string | RegExp,
		options: BuildOptions): RegExpBuilder {
		let source = this.create(
			`(?<=${this.getSource(exp2)})${this.getSource(exp)}`,
			options);
		this.result += source;
		return this;
	}

	/**
	 * `(?<!y)x`  
	 * Concatnate a negated lookbehind expression.
	 * @param exp the variable expression
	 * @param exp2 the variable expression
	 * @param options the build options
	 */
	public concatNegatedLookbehind(exp: string | RegExp,
		exp2: string | RegExp,
		options: BuildOptions): RegExpBuilder {
		let source = this.create(
			`(?<!${this.getSource(exp2)})${this.getSource(exp)}`,
			options);
		this.result += source;
		return this;
	}

	/**
	 * `(?<name>:`..
	 * Begin a group
	 * @param name the group name
	 */
	public beginGroup(name?: string): RegExpBuilder {
		this.result += `(${name && `?<${name}>:`}`;
		return this;
	}

	/**
	 * `)`..
	 * End a group
	 * @param name the group name
	 */
	public endGroup(name?: string): RegExpBuilder {
		if (name) {
			this.result += `)`
		}
		this.result += `)`
		return this;
	}

	/**
	 * Enable matchAll
	 */
	public enableMatchAll(): RegExpBuilder {
		this.isMatchAll = true;
		return this;
	}

	/**
	 * Get the build result
	 * @param flags flags
	 */
	public toRegExp(flags?: string): RegExp {
		let exp = this.result;
		if (this.isMatchAll) {
			exp = `${Begin}${exp}${End}`
		}
		return new RegExp(exp, flags);
	}
}
