/**
 * RegExp Options
 */
export default class RegExpOptions {
	/**
	 * qualifier: would be one of:  
	 * `?`: zero or one  
	 * `+`: one or more  
	 * `*`: zero or more  
	 * `{n}`: `n` times of occurrences  
	 * `{n, }`: `n` times or more of occurrences  
	 * `{n, m}`: `n` to `m` times of occurrences  
	 */
	qualifier?: string;

	/**
	 * `(x)*`
	 * If need to group qualified item, work with qualifier. Default: true.  
	 */
	groupQualifiedItem?: boolean;

	/**
	 * `(?:x)*`
	 * If need not to remember the group qualified item, work with qualifier. Default is false.
	 */
	notRememberQualifiedItem?: boolean;

	/**
	 * `(x)(y)`  
	 * If need to group each items. Default is false.
	 * Default: false, not group.
	 */
	groupItem?: boolean;

	/**
	 * `(x)`  
	 * If need to group the input, Default is false.
	 */
	group?: boolean;

	/**
	 * The group name. work with group
	 */
	name?: string;

	/**
	 * `(?:x)`
	 * If need not to remember the group, work with group. Default is false.
	 */
	notRemember?: boolean;

	/**
	 * `x|y`  
	 * If using or operations for items. Default is false.
	 */
	or?: boolean;

	/**
	 * `[xy]`
	 * If it is a set. Default is false.
	 */
	set?: boolean;

	/**
	 * `[^xy]`  
	 * If negated the input, work with set. Default is false.
	 */
	negated?: boolean;
}
