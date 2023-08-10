<script setup lang="ts">
import { ref } from 'vue'
import { object, string, InferType } from 'yup'
import type { Form } from '@nuxthq/ui/dist/runtime/types'

const schema = object({
  emailYup: string().email('Invalid email').required('Required'),
  passwordYup: string()
    .min(8, 'Must be at least 8 characters')
    .required('Required')
})

type Schema = InferType<typeof schema>

const state = ref({
  emailYup: undefined,
  passwordYup: undefined
})

const form = ref<Form<Schema>>()

async function submit () {
  await form.value!.validate()
  // Do something with state.value
}
</script>

<template>
  <UForm
    ref="form"
    :schema="schema"
    :state="state"
    @submit.prevent="submit"
  >
    <UFormGroup label="Email" name="emailYup">
      <UInput v-model="state.emailYup" />
    </UFormGroup>

    <UFormGroup label="Password" name="passwordYup">
      <UInput v-model="state.passwordYup" type="password" />
    </UFormGroup>

    <UButton type="submit">
      Submit
    </UButton>
  </UForm>
</template>
