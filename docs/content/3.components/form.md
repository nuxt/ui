---
description: Collect and validate form data.
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/benjamincanac/ui3/tree/dev/src/runtime/components/Form.vue
---

## Usage

## Examples

## API

### Props

:component-props

### Slots

:component-slots

### Events

:component-events

### Exposed

When accessing the component via a template ref, you can use the following:

| Name | Type |
| ---- | ---- |
| `submit()`{lang="ts-type"} | `Promise<void>`{lang="ts-type"} <br> <div class="text-gray-600 dark:text-gray-300 mt-1"><p>Triggers form submission.</p> |
| `validate(path?: string \| string[], opts: { silent?: boolean })`{lang="ts-type"} | `Promise<T>`{lang="ts-type"} <br> <div class="text-gray-600 dark:text-gray-300 mt-1"><p>Triggers form validation. Will raise any errors unless `opts.silent` is set to true.</p> |
| `clear(path?: string)`{lang="ts-type"} | `void` <br> <div class="text-gray-600 dark:text-gray-300 mt-1"><p>Clears form errors associated with a specific path. If no path is provided, clears all form errors.</p> |
| `getErrors(path?: string)`{lang="ts-type"} | `FormError[]`{lang="ts-type"} <br> <div class="text-gray-600 dark:text-gray-300 mt-1"><p>Retrieves form errors associated with a specific path. If no path is provided, returns all form errors.</p></div> |
| `setErrors(errors: FormError[], path?: string)`{lang="ts-type"} | `void` <br> <div class="text-gray-600 dark:text-gray-300 mt-1"><p>Sets form errors for a given path. If no path is provided, overrides all errors.</p> |
| `errors`{lang="ts-type"} | `Ref<FormError[]>`{lang="ts-type"} <br> <div class="text-gray-600 dark:text-gray-300 mt-1"><p>A reference to the array containing validation errors. Use this to access or manipulate the error information.</p> |
| `disabled`{lang="ts-type"} | `Ref<boolean>`{lang="ts-type"} |
