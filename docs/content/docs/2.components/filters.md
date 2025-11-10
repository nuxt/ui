---
description: A component to display and manage filters (kinda looks like Linear filters)
category: data
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/Filters.vue
---

## Usage

The Filters component allows you to create powerful filtering interfaces for your data. It supports over 15 field types, 30+ customizable operators, hierarchical navigation, and a [Linear-inspired interface](https://linear.app/docs/filters).

::component-code
---
collapse: true
class: '!py-4'
ignore:
  - filters
  - fields
props:
  filters: []
  fields:
    - key: 'name'
      label: 'Full name'
      type: 'text'
      placeholder: 'Enter a name...'
      icon: 'lucide:user'
      operators:
        - value: 'contains'
          label: 'contains'
        - value: 'starts_with'
          label: 'starts with'
        - value: 'is'
          label: 'is'
    - key: 'status'
      label: 'Status'
      type: 'select'
      options:
        - value: 'active'
          label: 'Active'
        - value: 'inactive'
          label: 'Inactive'
        - value: 'pending'
          label: 'Pending'
        - value: 'archived'
          label: 'Archived'
      icon: 'lucide:check-circle'
    - key: 'age'
      label: 'Age'
      type: 'number'
      defaultOperator: 'equals'
      min: 0
      max: 120
      step: 1
      placeholder: 'Enter an age...'
      icon: 'lucide:calendar'
    - key: 'tags'
      label: 'Tags'
      type: 'multiselect'
      options:
        - value: 'important'
          label: 'Important'
        - value: 'urgent'
          label: 'Urgent'
        - value: 'normal'
          label: 'Normal'
      maxSelections: 4
      icon: 'lucide:tag'
    - key: 'createdAt'
      label: 'Creation date'
      type: 'date'
      icon: 'lucide:calendar-days'
    - key: 'isActive'
      label: 'Active'
      type: 'boolean'
      onLabel: 'Yes'
      offLabel: 'No'
      icon: 'lucide:toggle-left'
---
::

::callout{icon="i-simple-icons-github" to="https://github.com/nuxt/ui/tree/v4/playgrounds/nuxt/app/pages/components/filters.vue" aria-label="View source code"}
This example demonstrates the most common use case of the `Filters` component. Check out the source code on GitHub.
::

### Basic Setup

Use the `filters` prop to manage active filters and the `fields` prop to define available filterable fields.

::component-code
---
collapse: true
class: '!py-4'
ignore:
  - filters
  - fields
props:
  filters: []
  fields:
    - key: 'name'
      label: 'Name'
      type: 'text'
      icon: 'lucide:user'
    - key: 'status'
      label: 'Status'
      type: 'select'
      options:
        - value: 'active'
          label: 'Active'
        - value: 'inactive'
          label: 'Inactive'
---
::

### Fields Configuration

Fields can be configured with various properties:

- `key`: [Unique identifier for the field.]{class="text-muted"}
- `label`: [Display label for the field.]{class="text-muted"}
- `type`: [Field type (`text`, `number`, `date`, `select`, `multiselect`, `boolean`, `email`, `url`, `tel`, `time`, `datetime`, `custom`, `separator`).]{class="text-muted"}
- `icon`: [Icon to display (Nuxt Icon format, e.g., `lucide:user`).]{class="text-muted"}
- `placeholder`: [Placeholder text for input fields.]{class="text-muted"}
- `operators`: [Custom operators for this field (overrides defaults).]{class="text-muted"}
- `defaultOperator`: [Default operator to use when creating a filter.]{class="text-muted"}
- `options`: [Options for `select` and `multiselect` fields.]{class="text-muted"}
- `validation`: [Custom validation function or regex pattern.]{class="text-muted"}
- `children`: [Nested fields for hierarchical navigation.]{class="text-muted"}

## Field Types

### Text

Text input field with search and optional validation.

**Available operators:** `contains`, `not_contains`, `starts_with`, `ends_with`, `is`, `empty`, `not_empty`

::component-code
---
collapse: true
class: '!py-4'
ignore:
  - filters
  - fields
props:
  filters: []
  fields:
    - key: 'name'
      label: 'Name'
      type: 'text'
      placeholder: 'Enter a name...'
      icon: 'lucide:user'
      pattern: '^[A-Za-z]+$'
      validation: (value) => {
        if (typeof value !== 'string' || value.length <= 2) {
          return 'Name must contain at least 3 characters'
        }
      }
---
::

### Number

Numeric input field with min/max/step constraints.

**Available operators:** `equals`, `not_equals`, `greater_than`, `less_than`, `between`, `not_between`, `empty`, `not_empty`

::component-code
---
collapse: true
class: '!py-4'
ignore:
  - filters
  - fields
props:
  filters: []
  fields:
    - key: 'age'
      label: 'Age'
      type: 'number'
      min: 0
      max: 120
      step: 1
      placeholder: 'Enter an age...'
---
::

### Number Range

For numeric fields, when the `between` or `not_between` operator is selected, the component automatically displays two inputs (min/max) via `FilterNumberRange`.

**Note:** There is no separate `numberrange` type. Use `type: 'number'` with the `between` or `not_between` operator.

::component-code
---
collapse: true
class: '!py-4'
ignore:
  - filters
  - fields
props:
  filters: []
  fields:
    - key: 'priceRange'
      label: 'Price'
      type: 'number'
      min: 0
      max: 1000
      step: 10
      defaultOperator: 'between'
---
::

### Date

Single date picker.

**Available operators:** `before`, `after`, `is`, `is_not`, `between`, `not_between`, `empty`, `not_empty`

::component-code
---
collapse: true
class: '!py-4'
ignore:
  - filters
  - fields
props:
  filters: []
  fields:
    - key: 'createdAt'
      label: 'Created at'
      type: 'date'
      icon: 'lucide:calendar'
---
::

### Date Range

For date fields, when the `between` or `not_between` operator is selected, the component automatically displays two date pickers (start/end) via `FilterDateRange`.

**Note:** There is no separate `daterange` type. Use `type: 'date'` with the `between` or `not_between` operator.

::component-code
---
collapse: true
class: '!py-4'
ignore:
  - filters
  - fields
props:
  filters: []
  fields:
    - key: 'dateRange'
      label: 'Period'
      type: 'date'
      icon: 'lucide:calendar-range'
      defaultOperator: 'between'
---
::

### Select

Single selection dropdown.

**Available operators:** `is`, `is_not`, `empty`, `not_empty`

::component-code
---
collapse: true
class: '!py-4'
ignore:
  - filters
  - fields
props:
  filters: []
  fields:
    - key: 'status'
      label: 'Status'
      type: 'select'
      options:
        - value: 'active'
          label: 'Active'
          icon: 'lucide:check-circle'
        - value: 'inactive'
          label: 'Inactive'
          icon: 'lucide:x-circle'
      searchable: true
      icon: 'lucide:check-circle'
---
::

### Multiselect

Multiple selection dropdown.

**Available operators:** `is_any_of`, `is_not_any_of`, `includes_all`, `excludes_all`, `empty`, `not_empty`

::component-code
---
collapse: true
class: '!py-4'
ignore:
  - filters
  - fields
props:
  filters: []
  fields:
    - key: 'tags'
      label: 'Tags'
      type: 'multiselect'
      options:
        - value: 'important'
          label: 'Important'
        - value: 'urgent'
          label: 'Urgent'
        - value: 'normal'
          label: 'Normal'
      maxSelections: 5
      searchable: true
---
::

**Special features:**
- Real-time updates when adding/removing options
- Popover stays open to allow multiple selections
- Displays selection count in the button

### Boolean

On/off toggle with customizable labels.

**Available operators:** `is`, `is_not`, `empty`, `not_empty`

::component-code
---
collapse: true
class: '!py-4'
ignore:
  - filters
  - fields
props:
  filters: []
  fields:
    - key: 'isActive'
      label: 'Active'
      type: 'boolean'
      onLabel: 'Yes'
      offLabel: 'No'
      icon: 'lucide:toggle-left'
---
::

### Email

Email input field with automatic format validation.

**Available operators:** `contains`, `not_contains`, `starts_with`, `ends_with`, `is`, `empty`, `not_empty`

::component-code
---
collapse: true
class: '!py-4'
ignore:
  - filters
  - fields
props:
  filters: []
  fields:
    - key: 'email'
      label: 'Email'
      type: 'email'
      placeholder: 'email@example.com'
      icon: 'lucide:mail'
---
::

### URL

URL input field with automatic format validation.

**Available operators:** `contains`, `not_contains`, `starts_with`, `ends_with`, `is`, `empty`, `not_empty`

::component-code
---
collapse: true
class: '!py-4'
ignore:
  - filters
  - fields
props:
  filters: []
  fields:
    - key: 'website'
      label: 'Website'
      type: 'url'
      placeholder: 'https://example.com'
      icon: 'lucide:globe'
---
::

### Tel

Phone input field with automatic format validation.

**Available operators:** `contains`, `not_contains`, `starts_with`, `ends_with`, `is`, `empty`, `not_empty`

::component-code
---
collapse: true
class: '!py-4'
ignore:
  - filters
  - fields
props:
  filters: []
  fields:
    - key: 'phone'
      label: 'Phone'
      type: 'tel'
      placeholder: '+33 6 12 34 56 78'
      icon: 'lucide:phone'
---
::

### Time

Time picker.

**Available operators:** `before`, `after`, `is`, `between`, `not_between`, `empty`, `not_empty`

::component-code
---
collapse: true
class: '!py-4'
ignore:
  - filters
  - fields
props:
  filters: []
  fields:
    - key: 'startTime'
      label: 'Start time'
      type: 'time'
      icon: 'lucide:clock'
---
::

### DateTime

Combined date and time picker.

**Available operators:** `before`, `after`, `is`, `between`, `not_between`, `empty`, `not_empty`

::component-code
---
collapse: true
class: '!py-4'
ignore:
  - filters
  - fields
props:
  filters: []
  fields:
    - key: 'appointment'
      label: 'Appointment'
      type: 'datetime'
      icon: 'lucide:calendar-clock'
---
::

### Custom

Allows using a custom Vue component for rendering.

::component-code
---
collapse: true
class: '!py-4'
ignore:
  - filters
  - fields
props:
  filters: []
  fields:
    - key: 'customField'
      label: 'Custom field'
      type: 'custom'
      customRenderer: defineAsyncComponent(() => import('./CustomFilter.vue'))
---
::

The custom component will receive the following props:
- `field`: Field configuration
- `values`: Current values
- `onChange`: Function to update values
- `operator`: Current operator

## Operators

### Available Operators by Type

| Operator | Supported Types | Description |
|----------|----------------|-------------|
| `is` | select, boolean, date, time, datetime, text, email, url, tel | Exact equality |
| `is_not` | select, boolean, date | Inequality |
| `is_any_of` | multiselect | One of the values |
| `is_not_any_of` | multiselect | None of the values |
| `includes_all` | multiselect | Includes all values |
| `excludes_all` | multiselect | Excludes all values |
| `contains` | text, email, url, tel | Contains text |
| `not_contains` | text, email, url, tel | Does not contain text |
| `starts_with` | text, email, url, tel | Starts with |
| `ends_with` | text, email, url, tel | Ends with |
| `equals` | number | Equal to |
| `not_equals` | number | Not equal to |
| `greater_than` | number | Greater than |
| `less_than` | number | Less than |
| `before` | date, time, datetime | Before |
| `after` | date, time, datetime | After |
| `between` | number, date, time, datetime | Between two values (automatically displays a range) |
| `not_between` | number, date, time, datetime | Not between (automatically displays a range) |
| `empty` | All | Is empty |
| `not_empty` | All | Is not empty |

### Default Operator

You can define a default operator for a field:

::component-code
---
collapse: true
class: '!py-4'
ignore:
  - filters
  - fields
props:
  filters: []
  fields:
    - key: 'status'
      label: 'Status'
      type: 'select'
      defaultOperator: 'is_not'
      options:
        - value: 'active'
          label: 'Active'
        - value: 'inactive'
          label: 'Inactive'
---
::

## Examples

### Hierarchical Navigation

Fields can be organized hierarchically with unlimited depth, similar to Linear's interface.

::component-code
---
collapse: true
class: '!py-4'
ignore:
  - filters
  - fields
props:
  filters: []
  fields:
    - key: 'name-structure'
      label: 'Name'
      icon: 'lucide:user'
      children:
        - key: 'firstName'
          label: 'First name'
          type: 'text'
          placeholder: 'Enter a first name...'
          icon: 'lucide:user'
        - key: 'lastName'
          label: 'Last name'
          type: 'text'
          placeholder: 'Enter a last name...'
          icon: 'lucide:user'
    - key: 'contact'
      label: 'Contact'
      icon: 'lucide:mail'
      children:
        - key: 'email'
          label: 'Email'
          type: 'email'
          placeholder: 'email@example.com'
          icon: 'lucide:mail'
        - key: 'phone'
          label: 'Phone'
          type: 'tel'
          placeholder: '+33 6 12 34 56 78'
          icon: 'lucide:phone'
---
::

**Behavior:**
- When selecting a parent field, a new popover opens to the right with child fields
- Navigation can be infinitely nested
- Each navigation level is independent
- Search works at each level
- Popovers automatically close when selecting a final field

### Field Grouping

Organize fields into groups for better organization.

::component-code
---
collapse: true
class: '!py-4'
ignore:
  - filters
  - fields
props:
  filters: []
  fields:
    - group: 'Personal Information'
      fields:
        - key: 'name'
          label: 'Full name'
          type: 'text'
          placeholder: 'Enter a name...'
          icon: 'lucide:user'
        - key: 'age'
          label: 'Age'
          type: 'number'
          min: 0
          max: 120
          step: 1
          placeholder: 'Enter an age...'
          icon: 'lucide:calendar'
    - group: 'Contact'
      fields:
        - key: 'email'
          label: 'Email'
          type: 'email'
          placeholder: 'email@example.com'
          icon: 'lucide:mail'
        - key: 'phone'
          label: 'Phone'
          type: 'tel'
          placeholder: '+33 6 12 34 56 78'
          icon: 'lucide:phone'
    - group: 'Status'
      fields:
        - key: 'status'
          label: 'Status'
          type: 'select'
          options:
            - value: 'active'
              label: 'Active'
            - value: 'inactive'
              label: 'Inactive'
            - value: 'pending'
              label: 'Pending'
          icon: 'lucide:check-circle'
        - key: 'isActive'
          label: 'Active'
          type: 'boolean'
          onLabel: 'Yes'
          offLabel: 'No'
          icon: 'lucide:toggle-left'
---
::

Groups are displayed with headers in the selection popover.

### Custom Operators

Define custom operators for each field.

::component-code
---
collapse: true
class: '!py-4'
ignore:
  - filters
  - fields
props:
  filters: []
  fields:
    - key: 'name'
      label: 'Full name'
      type: 'text'
      placeholder: 'Enter a name...'
      icon: 'lucide:user'
      operators:
        - value: 'contains'
          label: 'contains'
        - value: 'starts_with'
          label: 'starts with'
        - value: 'is'
          label: 'is'
    - key: 'age'
      label: 'Age'
      type: 'number'
      placeholder: 'Enter an age...'
      icon: 'lucide:calendar'
      operators:
        - value: 'equals'
          label: 'equals'
        - value: 'greater_than'
          label: 'greater than'
        - value: 'less_than'
          label: 'less than'
        - value: 'between'
          label: 'between'
---
::

### Validation

The filter system includes automatic and customizable validation with visual error display.

#### Automatic Validation

`email`, `url`, and `tel` fields have built-in automatic format validation:

- **Email**: Valid email format (e.g., `user@example.com`)
- **URL**: Valid URL format with or without http/https scheme, supports multiple subdomains (e.g., `https://example.com` or `example.com`)
- **Phone**: Valid phone format accepting digits, spaces, dashes, parentheses, and the + sign (e.g., `+33 6 12 34 56 78`)

::component-example
---
prettier: true
collapse: true
name: 'filters-validation-automatic-example'
highlights:
  - 49
  - 57
class: '!py-4'
---
::

#### Custom Validation

You can add custom validation via two methods:

**1. Regex Pattern:**

::component-code
---
collapse: true
class: '!py-4'
ignore:
  - filters
  - fields
props:
  filters: []
  fields:
    - key: 'code'
      label: 'Product code'
      type: 'text'
      pattern: '^[A-Z]{3}-[0-9]{3}$'
---
::

**2. Validation Function:**

::component-code
---
collapse: true
class: '!py-4'
ignore:
  - filters
  - fields
props:
  filters: []
  fields:
    - key: 'score'
      label: 'Score'
      type: 'number'
      validation: (value) => {
        if (!/^\d+(\.\d+)?$/.test(String(value))) {
          return 'Score must be a number'
        }
        if (value < 0) {
          return 'Score cannot be negative'
        }
        if (value > 100) {
          return 'Score cannot exceed 100'
        }
      }
---
::

**Note:** The validation function can return:
- `undefined`, `null`, or `false`: Value is valid (no need to return explicitly)
- `true`: Value is invalid (default error message from `i18n.validation.invalid`)
- `string`: Value is invalid with custom error message

#### Conditional Validation

Strict validation (full format) only applies to operators requiring a complete value (`is`, `equals`, etc.). For partial search operators (`contains`, `starts_with`, etc.), full format validation is disabled to allow partial searches.

For example, with an email field and the `starts_with` operator, you can enter "john" without error, whereas with the `is` operator, a complete email is required.

#### Error Display

Validation errors are displayed visually:
- Input turns red (`color="error"`) and stays red even without focus
- A tooltip appears above the input with the error message
- The tooltip appears automatically when the input is focused or hovered and there's an error

Error messages can be customized via `i18n.validation`:

::component-code
---
collapse: true
class: '!py-4'
ignore:
  - filters
  - fields
props:
  filters: []
  fields:
    - key: 'email'
      label: 'Email'
      type: 'email'
  i18n:
    validation:
      invalidEmail: 'Invalid email format'
      invalidUrl: 'Invalid URL format'
      invalidTel: 'Invalid phone format'
      invalid: 'Invalid input format'
---
::

### Internationalization

All texts can be customized via the `i18n` prop. The configuration is merged with default English values, so you only need to override what you want to change.

The `i18n` prop accepts a partial `FilterI18nConfig` object.

::component-code
---
collapse: true
class: '!py-4'
ignore:
  - filters
  - fields
props:
  filters: []
  fields:
    - key: 'name'
      label: 'Nom'
      type: 'text'
    - key: 'status'
      label: 'Statut'
      type: 'select'
      options:
        - value: 'active'
          label: 'Actif'
        - value: 'inactive'
          label: 'Inactif'
  i18n:
    addFilter: 'Ajouter un filtre'
    searchFields: 'Rechercher un champ...'
    noFieldsFound: 'Aucun champ trouvé.'
    operators:
      contains: 'contient'
      is: 'est'
      isNot: "n'est pas"
      startsWith: 'commence par'
      endsWith: 'se termine par'
      empty: 'est vide'
      notEmpty: "n'est pas vide"
    placeholders:
      enterField: (fieldType) => `Entrer ${fieldType}...`
      selectField: 'Sélectionner...'
      searchField: (fieldName) => `Rechercher ${fieldName.toLowerCase()}...`
    validation:
      invalidEmail: 'Format d\'email invalide'
      invalidUrl: 'Format d\'URL invalide'
      invalidTel: 'Format de téléphone invalide'
      invalid: 'Format d\'entrée invalide'
---
::

**Note:** The system includes English translations by default. You can override any part of the configuration, and the merge function will combine your custom values with the defaults.

### Variants

The component supports two visual variants:

- `outline` (default): Visible borders
- `solid`: Colored background without borders

### Sizes

Three sizes are available:

- `sm`: Small size
- `md` (default): Medium size
- `lg`: Large size

### Radius

- `md` (default): Rounded borders
- `full`: Fully rounded borders

### Multiple Filters per Field

By default, `allowMultiple` is enabled, allowing multiple filters for the same field.

To disable this feature:

::component-code
---
collapse: true
class: '!py-4'
ignore:
  - filters
  - fields
props:
  allowMultiple: false
  filters: []
  fields:
    - key: 'name'
      label: 'Name'
      type: 'text'
---
::

When `allowMultiple` is `false`, fields already used in a filter are no longer available in the selection list.

### Filter Management

Filters can be added via:
1. The "Add filter" button
2. Hierarchical navigation for nested fields
3. Programmatically via the `change` event

Each filter can be modified:
- **Field**: Not modifiable after creation (delete and recreate)
- **Operator**: Modifiable via the operator dropdown
- **Values**: Modifiable via input components

Filters can be removed via:
- The remove button (X) on each filter
- Programmatically by filtering the filters array

## API

### Props

:component-props

### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `change` | `Filter[]` | Emitted when filters change |

## Changelog

:component-changelog
