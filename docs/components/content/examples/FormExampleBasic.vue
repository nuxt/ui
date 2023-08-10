<script setup lang="ts">
import { ref } from 'vue'
import type { FormError } from '@nuxthq/ui/dist/runtime/types'

const state = ref({
  email: undefined,
  password: undefined
})

const validate = (state: any): FormError[] => {
  const errors = []
  if (!state.email) errors.push({ path: 'email', message: 'Required' })
  if (!state.password) errors.push({ path: 'password', message: 'Required' })
  return errors
}

const form = ref()

async function submit () {
  await form.value!.validate()
  // Do something with state.value
}
</script>

<template>
  <UForm
    ref="form"
    :validate="validate"
    :state="state"
    @submit.prevent="submit"
  >
    <UFormGroup label="Email" name="email">
      <UInput v-model="state.email" />
    </UFormGroup>

    <UFormGroup label="Password" name="password">
      <UInput v-model="state.password" type="password" />
    </UFormGroup>

    <UButton type="submit">
      Submit
    </UButton>
  </UForm>
</template>
