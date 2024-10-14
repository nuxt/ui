<template>
  <UForm
    :validate="validate"
    :state="formState"
    class="space-y-4"
  >
    <UFormField name="email" label="Email">
      <UInput v-model="formState.email" />
    </UFormField>
    <UFormField name="password" label="Password">
      <UInput v-model="formState.password" />
    </UFormField>

    <UButton type="submit">
      Submit
    </UButton>
  </UForm>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const formState = reactive({ email: undefined, password: undefined })
function validate(data: Partial<typeof formState>) {
  const errors: Array<{ name: string, message: string }> = []
  if (!data.email) errors.push({ name: 'email', message: 'Required' })
  if (!data.password) errors.push({ name: 'password', message: 'Required' })
  return errors
}
</script>
