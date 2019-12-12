# Pattern: Separated Values

## Cases
- Comma-Separated Values，CSV

| Element                 | Description |
| ----------------------- | ----------- |
| Qualifier               | `"|\0`      |
| Separator               | `,`         |
| Escape character        | `"`         |
| Escaped characters      | `"`         |
| Value in multiple lines | `Yes`       |
| Allow empty             | `Yes`       |
| Has headers             | `No`        |
| Has line                | `No`        |
| line character          | N/A         |
| Need trim               | `No`        |
| Allow Begin Separator   | `No`        |
| Allow End Separator     | `No`        |

- Markdown table

| Element                 | Description |
| ----------------------- | ----------- |
| Qualifier               | No          |
| Separator               | `|`         |
| Escape character        | `\`         |
| Escaped characters      | `|`         |
| Value in multiple lines | `Yes`       |
| Allow empty             | `Yes`       |
| Has headers             | `Yes`       |
| Has line                | `Yes`       |
| line character          | `-`         |
| Need trim               | `Yes`       |
| Allow Begin Separator   | `Yes`       |
| Allow End Separator     | `Yes`       |

## Functions

- Case: CSV
  - GetNextRow(): string[]
- Case: Markdown
  - GetHeader(): string[]
  - GetNextRow(): string[]
