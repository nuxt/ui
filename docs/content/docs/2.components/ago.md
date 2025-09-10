---
description: Describe human-readable time difference
category: element
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/Ago.vue
---

## Usage

Use the `datetime` prop to show a locale-aware human-readable relative time difference from now. 

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

:component-example{name="ago-date-example"}

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

Use the `locale` prop to use a specific locale to format the datetime.

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

### Refresh

The `refresh` prop can be used to programmatically enable or disable refreshing the difference.

:component-example{name="ago-refresh-example"}

## API

### Props

:component-props

### Slots

:component-slots

## Theme

:component-theme

## Changelog

:component-changelog
