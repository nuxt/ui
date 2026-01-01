<script setup lang="ts">
import { reactive, useTemplateRef } from 'vue'

const form = useTemplateRef('form')
const state = reactive<any>({})
function validate() {
  return [{ name: 'email.1', message: 'Error message' }]
}
</script>

<template>
  <UForm ref="form" :state="state" :validate="validate">
    <UFormField id="emailField" :error-pattern="/(email)\..*/">
      <UInput id="email" v-model="state.email" />
    </UFormField>
  </UForm>
</template>
