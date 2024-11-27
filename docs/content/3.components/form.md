---
description: A form component with built-in validation and submission handling.
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/tree/v3/src/runtime/components/Form.vue
---

## Usage

Use the Form component to validate form data using schema libraries such as [Zod](https://github.com/colinhacks/zod), [Yup](https://github.com/jquense/yup), [Joi](https://github.com/hapijs/joi), [Valibot](https://github.com/fabian-hiller/valibot), [Superstruct](https://github.com/ianstormtaylor/superstruct) or your own validation logic.

It works with the [FormField](/components/form-field) component to display error messages around form elements automatically.

### Schema Validation

It requires two props:
- `state` - a reactive object holding the form's state.
- `schema` - a schema object from a validation library like [Zod](https://github.com/colinhacks/zod), [Yup](https://github.com/jquense/yup), [Joi](https://github.com/hapijs/joi), [Valibot](https://github.com/fabian-hiller/valibot) or [Superstruct](https://github.com/ianstormtaylor/superstruct).

::warning
**No validation library is included** by default, ensure you **install the one you need**.
::

::tabs
  ::component-example{label="Zod"}
  ---
  name: 'form-example-zod'
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

  ::component-example{label="Valibot"}
  ---
  name: 'form-example-valibot'
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

Errors are reported directly to the [FormField](/components/form-field) component based on the `name` or `error-pattern` prop. This means the validation rules defined for the `email` attribute in your schema will be applied to `<FormField name="email">`{lang="vue"}.

Nested validation rules are handled using dot notation. For example, a rule like `{ user: z.object({ email: z.string() }) }`{lang="ts"} will be applied to `<FormField name="user.email">`{lang="vue"}.

### Custom Validation

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

### Input Events

The Form component automatically triggers validation when an input emits an `input`, `change`, or `blur` event.
- Validation on `input` occurs **as you type**.
- Validation on `change` occurs when you **commit to a value**.
- Validation on `blur` happens when an input **loses focus**.

You can control when validation happens this using the `validate-on` prop.

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
You can use the [`useFormField`](/composables/use-form-field) composable to implement this inside your own components.
::

### Error Event

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

### Nesting Forms

Nesting form components allows you to manage complex data structures, such as lists or conditional fields, more efficiently.

For example, it can be used to dynamically add fields based on user's input:
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
| `submit()`{lang="ts-type"} | `Promise<void>`{lang="ts-type"} <br> <div class="text-[var(--ui-text-toned)] mt-1"><p>Triggers form submission.</p> |
| `validate(path?: string \| string[], opts: { silent?: boolean })`{lang="ts-type"} | `Promise<T>`{lang="ts-type"} <br> <div class="text-[var(--ui-text-toned)] mt-1"><p>Triggers form validation. Will raise any errors unless `opts.silent` is set to true.</p> |
| `clear(path?: string)`{lang="ts-type"} | `void` <br> <div class="text-[var(--ui-text-toned)] mt-1"><p>Clears form errors associated with a specific path. If no path is provided, clears all form errors.</p> |
| `getErrors(path?: string)`{lang="ts-type"} | `FormError[]`{lang="ts-type"} <br> <div class="text-[var(--ui-text-toned)] mt-1"><p>Retrieves form errors associated with a specific path. If no path is provided, returns all form errors.</p></div> |
| `setErrors(errors: FormError[], path?: string)`{lang="ts-type"} | `void` <br> <div class="text-[var(--ui-text-toned)] mt-1"><p>Sets form errors for a given path. If no path is provided, overrides all errors.</p> |
| `errors`{lang="ts-type"} | `Ref<FormError[]>`{lang="ts-type"} <br> <div class="text-[var(--ui-text-toned)] mt-1"><p>A reference to the array containing validation errors. Use this to access or manipulate the error information.</p> |
| `disabled`{lang="ts-type"} | `Ref<boolean>`{lang="ts-type"} |
