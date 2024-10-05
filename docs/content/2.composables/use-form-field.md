---
title: useFormField
description: 'A composable to integrate custom inputs with the Form component'
navigation: false
---

## Usage

Use the auto-imported `useFormField` composable to integrate custom inputs with a [Form](/components/form).

```vue
<script setup lang="ts">
const { inputId, emitFormBlur, emitFormInput, emitFormChange } = useFormField()
</script>
```
