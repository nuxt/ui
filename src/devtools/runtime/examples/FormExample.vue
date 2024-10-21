<script setup lang="ts">
import { reactive } from 'vue'

const state = reactive({ email: undefined, password: undefined })

function validate(data: Partial<typeof state>) {
  const errors: Array<{ name: string, message: string }> = []
  if (!data.email) errors.push({ name: 'email', message: 'Required' })
  if (!data.password) errors.push({ name: 'password', message: 'Required' })
  return errors
}
</script>

<template>
  <UForm
    :validate="validate"
    :state="state"
    class="space-y-4"
  >
    <UFormField name="email" label="Email">
      <UInput v-model="state.email" />
    </UFormField>
    <UFormField name="password" label="Password">
      <UInput v-model="state.password" />
    </UFormField>
    <UButton type="submit">
      Submit
    </UButton>
  </UForm>
</template>
