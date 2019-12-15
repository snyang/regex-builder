# Pattern: Separated Values

## Case: CSV
- Comma-Separated Values，CSV

| Element             | Description |
| ------------------- | ----------- |
| Line Separator      | `\n`        |
| Qualifier           | `"?`        |
| Separator           | `,`         |
| Escape character    | `"`         |
| Escaped characters  | `"`         |
| multiple lines data | `Support`   |

- split to lines.
  - Rule: use `\n` as line separator
  - Rule: skip `\n` between `"`., e.g. `"a\nb"`
  - Rule: But `"`
  - RegExp: `/("[^"]*"|[^\n])*/g`

- line to data:
  - Rule: use `,` as column separator
  - Rule: a column must after `^|,`
  - Rule: a column must before `,|$`
  - Rule: column case 1: `abc`
  - Rule: column case 2: qualified `""""`, `","`, `"\n"`
  - RegExp: `/(?<=^|,)([^",]*|"([^"]|"")*")(?=,|$)/g`
    note: `\n` is ignored.
  - Need to un-qualified and un-escaped
  
### CVS Functions
- GetNextRow(): string[]

## Markdown Table

- Markdown table

| Element               | Description   |
| --------------------- | ------------- |
| Qualifier             | No            |
| Separator             | `|`           |
| Escape character      | `\`           |
| Escaped characters    | `|`           |
| multiple lines value  | `Not Support` |
| Allow empty           | `Yes`         |
| Has headers           | `Yes`         |
| Has line row          | `Yes`         |
| line row character    | `:?-+:?`      |
| Need trim             | `Yes`         |
| Allow Begin Separator | `Yes`         |
| Allow End Separator   | `Yes`         |

- Markdown table
The smallest one
```md
a |  
- |

<or>

| a
| -
```

|   a   | b    |
| :---: | :--- |
|  abc  | \|   |

- Find a table
  
- split to lines.
  - Rule: use `\n` as line separator
  - RegExp: `/[^\n]*/g`

- line to data:
  - Rule: use `(\s*)\|(\s*)` as column separator
  - Rule: a column must after `^|\|`
  - Rule: a column must before `\||$`
  - Rule: column case 1: `abc`
  - Rule: column case 2: escaped `\|`
  - RegExp: `/(?<=^|,)([^",]*|"([^"]|"")*")(?=,|$)/g`.
    note: `\n` is ignored.
  - Need to un-escaped and trim
  
### Functions
- find(): string
- GetNextRow(): string[]
- isHeader, isLine, isDataRow
