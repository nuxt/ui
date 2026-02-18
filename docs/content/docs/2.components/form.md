---
description: A form component with built-in validation and submission handling.
category: form
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/Form.vue
---

## Usage

Use the Form component to validate form data using any validation library supporting [Standard Schema](https://github.com/standard-schema/standard-schema) such as [Valibot](https://github.com/fabian-hiller/valibot), [Zod](https://github.com/colinhacks/zod), [Regle](https://github.com/victorgarciaesgi/regle), [Yup](https://github.com/jquense/yup), [Joi](https://github.com/hapijs/joi) or [Superstruct](https://github.com/ianstormtaylor/superstruct) or your own validation logic.

It works with the [FormField](/docs/components/form-field) component to display error messages around form elements automatically.

### Schema validation

It requires two props:

- `state` - a reactive object holding the form's state.
- `schema` - any [Standard Schema](https://github.com/standard-schema/standard-schema) or [Superstruct](https://github.com/ianstormtaylor/superstruct).

::warning
**No validation library is included** by default, ensure you **install the one you need**.
::

::tabs{class="gap-0"}
  ::component-example{label="Valibot"}
  ---
  name: 'form-example-valibot'
  props:
    class: 'w-60'
  ---
  ::

  ::component-example{label="Zod"}
  ---
  name: 'form-example-zod'
  props:
    class: 'w-60'
  ---
  ::

  ::component-example{label="Regle"}
  ---
  name: 'form-example-regle'
  props:
    class: 'w-60'
  ---
  ::

  ::component-example{label="Yup"}
  ---
  name: 'form-example-yup'
  props:
    class: 'w-60'
  ---
  ::

  ::component-example{label="Joi"}
  ---
  name: 'form-example-joi'
  props:
    class: 'w-60'
  ---
  ::

  ::component-example{label="Superstruct"}
  ---
  name: 'form-example-superstruct'
  props:
    class: 'w-60'
  ---
  ::
::

Errors are reported directly to the [FormField](/docs/components/form-field) component based on the `name` or `error-pattern` prop. This means the validation rules defined for the `email` attribute in your schema will be applied to `<FormField name="email">`{lang="vue"}.

Nested validation rules are handled using dot notation. For example, a rule like `{ user: z.object({ email: z.string() }) }`{lang="ts"} will be applied to `<FormField name="user.email">`{lang="vue"}.

### Custom validation

Use the `validate` prop to apply your own validation logic.

The validation function must return a list of errors with the following attributes:

- `message` - the error message to display.
- `name` - the `name` of the `FormField` to send the error to.

::tip
It can be used alongside the `schema` prop to handle complex use cases.
::

::component-example
---
name: 'form-example-basic'
props:
  class: 'w-60'
---
::

### Input events

The Form component automatically triggers validation when an input emits an `input`, `change`, or `blur` event.

- Validation on `input` occurs **as you type**.
- Validation on `change` occurs when you **commit to a value**.
- Validation on `blur` happens when an input **loses focus**.

You can control when validation happens this using the `validate-on` prop.

::tip
The form always validates on submit.
::

::component-example{label="Default"}
---
source: false
name: 'form-example-elements'
options:
  - name: 'validate-on'
    label: 'validate-on'
    items:
    - 'input'
    - 'change'
    - 'blur'
    default:
    - 'input'
    - 'change'
    - 'blur'
    multiple: true
---
::

::tip
You can use the [`useFormField`](/docs/composables/use-form-field) composable to implement this inside your own components.
::

### Error event

You can listen to the `@error` event to handle errors. This event is triggered when the form is submitted and contains an array of `FormError` objects with the following fields:

- `id` - the input's `id`.
- `name` - the `name` of the `FormField`
- `message` - the error message to display.

Here's an example that focuses the first input element with an error after the form is submitted:

::component-example
---
name: 'form-example-on-error'
collapse: true
props:
  class: 'w-60'
---
::

### HTML5 validation :badge{label="Soon" class="align-text-top"}

When calling `form.submit()` programmatically, the Form component automatically triggers native HTML5 validation before submission.

::note
This is particularly useful when the submit button is outside the form element, such as in a modal footer.
::

::component-example
---
name: 'form-example-html5-validation'
props:
  class: 'w-60'
---
::

### Nesting forms

Use the `nested` prop to nest multiple Form components and link their validation functions. In this case, validating the parent form will automatically validate all the other forms inside it.

Nested forms directly inherit their parent's state, so you don't need to define a separate state for them. You can use the `name` prop to target a nested attribute within the parent's state.

It can be used to dynamically add fields based on user's input:

::component-example
---
collapse: true
name: 'form-example-nested'
---
::

Or to validate list inputs:
::component-example
---
collapse: true
name: 'form-example-nested-list'
---
::


## API

### Props

:component-props

::callout{icon="i-simple-icons-mdnwebdocs" to="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#attributes" target="_blank"}
This component also supports all native `<form>` HTML attributes.
::

### Slots

:component-slots

### Emits

:component-emits

### Expose

You can access the typed component instance using [`useTemplateRef`](https://vuejs.org/api/composition-api-helpers.html#usetemplateref).

```vue
<script setup lang="ts">
const form = useTemplateRef('form')
</script>

<template>
  <UForm ref="form" />
</template>
```

This will give you access to the following:

| Name | Type |
| ---- | ---- |
| `submit()`{lang="ts-type"} | `Promise<void>`{lang="ts-type"} <br> <div class="text-toned mt-1"><p>Triggers form submission with HTML5 validation.</p></div> |
| `validate(opts: { name?: keyof T \| (keyof T)[], silent?: boolean, nested?: boolean, transform?: boolean })`{lang="ts-type"} | `Promise<T>`{lang="ts-type"} <br> <div class="text-toned mt-1"><p>Triggers form validation. Will raise any errors unless `opts.silent` is set to true.</p></div> |
| `clear(path?: keyof T \| RegExp)`{lang="ts-type"} | `void` <br> <div class="text-toned mt-1"><p>Clears form errors associated with a specific path. If no path is provided, clears all form errors.</p></div> |
| `getErrors(path?: keyof T \| RegExp)`{lang="ts-type"} | `FormError[]`{lang="ts-type"} <br> <div class="text-toned mt-1"><p>Retrieves form errors associated with a specific path. If no path is provided, returns all form errors.</p></div> |
| `setErrors(errors: FormError[], name?: keyof T \| RegExp)`{lang="ts-type"} | `void` <br> <div class="text-toned mt-1"><p>Sets form errors for a given path. If no path is provided, overrides all errors.</p></div> |
| `errors`{lang="ts-type"} | `Ref<FormError[]>`{lang="ts-type"} <br> <div class="text-toned mt-1"><p>A reference to the array containing validation errors. Use this to access or manipulate the error information.</p></div> |
| `disabled`{lang="ts-type"} | `Ref<boolean>`{lang="ts-type"} |
| `dirty`{lang="ts-type"} | `Ref<boolean>`{lang="ts-type"} `true` if at least one form field has been updated by the user. |
| `dirtyFields`{lang="ts-type"} | `DeepReadonly<Set<keyof T>>`{lang="ts-type"} Tracks fields that have been modified by the user. |
| `touchedFields`{lang="ts-type"} | `DeepReadonly<Set<keyof T>>`{lang="ts-type"} Tracks fields that the user interacted with. |
| `blurredFields`{lang="ts-type"} | `DeepReadonly<Set<keyof T>>`{lang="ts-type"} Tracks fields blurred by the user. |

## Theme

:component-theme

## Changelog

:component-changelog
