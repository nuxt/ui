<script setup lang="ts">
import { ref } from 'vue'
import type { Form, FormError } from '@nuxthq/ui/dist/runtime/types'

const state = ref({
  email: undefined,
  password: undefined
})

const rules = {
  email: (v: string) => {
    if (!v) return 'Required'
    if (!v.includes('@')) return 'Invalid email'
  },

  password: (v: string) => {
    if (!v) return 'Required'
    if (v.length < 8) return 'Must be at least 8 characters'
  }
}

const validate = async (state: any): Promise<FormError[]> => {
  return Object.entries(state)
    .map(([key, value]) => {
      const result = rules[key](value)
      if (result) return { path: key, message: result }
    })
    .filter(Boolean)
}

const form = ref<Form<any>>()

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
    class="space-y-4 w-full"
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
