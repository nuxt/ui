---
description: Describe human-readable time
title: DateTime
category: element
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/DateTime.vue
---

## Usage

Use the `datetime` prop to format the time into a human-readable string.

::component-code
---
class: 'p-8'
ignore:
  - datetime
props:
  datetime: '2002-11-18T00:00:00.000Z'
---
::

You can also use a `Date` object as datetime. 

:component-example{name="date-time-date-example"}

When passing a string, ensure it's formatted as ISO 8601 (`YYYY-MM-DDTHH:mm:ss.sssZ`) or RFC 2822 (`Day, DD Mon YYYY HH:mm:ss GMT`), as the string will be passed to the `Date` constructor.

::component-code
---
class: 'p-8'
props:
  datetime: '2002-11-18T00:00:00.000Z'
items:
  datetime:
    - 2002-11-18T00:00:00.000Z
    - 2002-11-18
    - Sun, 18 Nov 2020 00:00:00 GMT
    - 1037577600000
---
::

### Locale

Use the `locale` prop to use a specific BCP 47 language locale to format the datetime. The locale string will be passed to `toLocaleString()`.

::component-code
---
prettier: true
ignore:
  - datetime
class: 'p-8'
props:
  datetime: '2002-11-18T00:00:00.000Z'
  locale: 'zh-cn'
items:
  locale:
    - zh-cn
    - en-us
    - fr-fr
    - es-es
---
::

### Format

Use `format` prop to change the default formatting length of the `Date` with an object. The object will be passed to `toLocaleString()`.

::component-code
---
prettier: true
ignore:
  - datetime
class: 'p-8'
props:
  datetime: '2002-11-18T00:00:00.000Z'
  format: { dateStyle: "short", timeStyle: "long" }
items:
  format.dateStyle:
    - short
    - medium
    - long
    - full
  format.timeStyle:
    - short
    - medium
    - long
    - full
---
::

Alternatively, you may use one of the following shorthand strings:

| Shorthand | Example (en-us)                                |
|-----------|------------------------------------------------|
| `xs`      | `9/8/25 6:34 PM`                               |
| `sm`      | `Sep 8, 2025, 6:34 PM`                         |
| `md`      | `Monday, Sep 8, 2025, 6:34 PM`                 |
| `lg`      | `Monday, September 8, 2025, 6:34:00 PM`        |
| `xl`      | `Monday, September 8, 2025, 6:34:00 PM GMT -4` |
| `time:sm` | `6:34 PM`                                      |
| `time:md` | `6:34:00 PM`                                   |
| `time:lg` | `6:34:00 PM GMT -4`                            |
| `date:sm` | `9/8/25`                                       |
| `date:md` | `Sep 8, 2025`                                  |
| `date:lg` | `Monday, Sep 8, 2025`                          |
| `date:xl` | `Monday, September 8, 2025`                    |

::component-code
---
ignore:
  - datetime
class: 'p-8'
props:
  datetime: '2002-11-18T00:00:00.000Z'
  format: 'md'
items:
  format:
    - xs
    - sm
    - md
    - lg
    - xl
    - date:sm
    - date:md
    - date:lg
    - date:xl
    - time:sm
    - time:md
    - time:lg
---
::

### Ago

Use `ago` prop to enable a tooltip that shows the difference in time from now that automatically refreshes.

::component-code
---
ignore:
  - datetime
class: 'p-8'
props:
  datetime: '2002-11-08T00:00:00.000Z'
  ago: true
---
::

The `refresh` prop can be used to programmatically enable or disable refreshing the difference.

:component-example{name="date-time-ago-refresh-example"}

## API

### Props

:component-props

### Slots

:component-slots

## Theme

:component-theme

## Changelog

:component-changelog
