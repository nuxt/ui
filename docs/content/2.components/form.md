---
description: Collect and validate form data.
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/dev/src/runtime/components/Form.vue
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
| `submit()` | `Promise<void>` <br> [Triggers form submission.]{class="text-gray-600 dark:text-gray-300 mt-1"} |
| `validate(path?: string \| string[], opts: { silent?: boolean })` | `Promise<T>` <br> [Triggers form validation. Will raise any errors unless `opts.silent` is set to true.]{class="text-gray-600 dark:text-gray-300 mt-1"} |
| `clear(path?: string)` | `void` <br> [Clears form errors associated with a specific path. If no path is provided, clears all form errors.]{class="text-gray-600 dark:text-gray-300 mt-1"} |
| `getErrors(path?: string)` | `FormError[]` <br> [Retrieves form errors associated with a specific path. If no path is provided, returns all form errors.]{class="text-gray-600 dark:text-gray-300 mt-1"} |
| `setErrors(errors: FormError[], path?: string)` | `void` <br> [Sets form errors for a given path. If no path is provided, overrides all errors.]{class="text-gray-600 dark:text-gray-300 mt-1"} |
| `errors` | `Ref<FormError[]>` <br> [A reference to the array containing validation errors. Use this to access or manipulate the error information.]{class="text-gray-600 dark:text-gray-300 mt-1"} |
| `disabled` | `Ref<boolean>` |
