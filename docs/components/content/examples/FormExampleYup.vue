<script setup lang="ts">
import { ref } from 'vue'
import { object, string, InferType } from 'yup'
import { Form } from '#ui'

const schema = object({
  email: string().email('Invalid email').required('Required'),
  password: string()
    .min(8, 'Must be at least 8 characters')
    .required('Required')
})

type Schema = InferType<typeof schema>

const state = ref({
  email: undefined,
  password: undefined
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
    class="space-y-2"
    @submit.prevent="submit"
  >
    <UFormGroup label="Email" path="email">
      <UInput v-model="state.email" />
    </UFormGroup>

    <UFormGroup label="Password" path="password">
      <UInput v-model="state.password" type="password" />
    </UFormGroup>

    <UButton block type="submit">
      Submit
    </UButton>
  </UForm>
</template>
