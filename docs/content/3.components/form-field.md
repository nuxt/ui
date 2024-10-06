---
title: FormField
description: A wrapper for form elements that provides validation and error handling.
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/tree/v3/src/runtime/components/FormField.vue
---

## Usage

Wrap any form component with a FormField. Used in a [Form](/components/form), it provides validation and error handling.

### Label

Use the `label` prop to set the label for the form control.

::component-code
---
prettier: true
props:
  label: Email
slots:
  default: |

    <UInput placeholder="Enter your email" />
---

:u-input{placeholder="Enter your email"}
::

::note
The label `for` attribute and the form control are associated with a unique `id` if not provided.
::

When using the `required` prop, an asterisk is be added next to the label.

::component-code
---
prettier: true
ignore:
  - label
props:
  label: Email
  required: true
slots:
  default: |

    <UInput placeholder="Enter your email" />
---

:u-input{placeholder="Enter your email"}
::

### Description

Use the `description` prop to provide additional information below the label.

::component-code
---
prettier: true
ignore:
  - label
props:
  label: Email
  description: We'll never share your email with anyone else.
slots:
  default: |

    <UInput placeholder="Enter your email" class="w-full" />
---

:u-input{placeholder="Enter your email" class="w-full"}
::

### Hint

Use the `hint` prop to display a hint message next to the label.

::component-code
---
prettier: true
ignore:
  - label
props:
  label: Email
  hint: Optional
slots:
  default: |

    <UInput placeholder="Enter your email" />
---

:u-input{placeholder="Enter your email"}
::

### Help

Use the `help` prop to display a help message below the form control.

::component-code
---
prettier: true
ignore:
  - label
props:
  label: Email
  help: Please enter a valid email address.
slots:
  default: |

    <UInput placeholder="Enter your email" class="w-full" />
---

:u-input{placeholder="Enter your email" class="w-full"}
::

### Error

Use the `error` prop to display an error message below the form control. When used together with the `help` prop, the `error` prop takes precedence.

When used inside a [Form](/components/form), this is automatically set when a validation error occurs.

::component-code
---
prettier: true
ignore:
  - label
props:
  label: Email
  error: Please enter a valid email address.
slots:
  default: |

    <UInput placeholder="Enter your email" class="w-full" />
---

:u-input{placeholder="Enter your email" class="w-full"}
::

::tip{to="/getting-started/theme#colors"}
This sets the `color` to `error` on the form control. You can change it globally in your `app.config.ts`.
::

### Size

Use the `size` prop to change the size of the FormField, the `size` is proxied to the form control.

::component-code
---
prettier: true
ignore:
  - label
  - description
  - hint
  - help
props:
  label: Email
  description: We'll never share your email with anyone else.
  hint: Optional
  help: Please enter a valid email address.
  size: xl
slots:
  default: |

    <UInput placeholder="Enter your email" class="w-full" />
---

:u-input{placeholder="Enter your email" class="w-full"}
::

## API

### Props

:component-props

### Slots

:component-slots

## Theme

:component-theme
