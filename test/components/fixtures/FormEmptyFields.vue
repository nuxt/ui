<script setup lang="ts">
import { reactive, useTemplateRef } from 'vue'

const state = reactive<any>({})
const form = useTemplateRef('form')
</script>

<template>
  <UForm ref="form" :state>
    <UFormField name="field1">
      <UInput />
    </UFormField>
    <UFormField name="field2" />
    <UFormField />
  </UForm>
</template>
