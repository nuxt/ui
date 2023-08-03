<script setup lang="ts">
import { ref } from 'vue'
import { z } from 'zod'

const schema = z.object({
  emailZod: z.string().email('Invalid email'),
  passwordZod: z.string().min(8, 'Must be at least 8 characters')
})

type Schema = z.output<typeof schema>

const state = ref({
  emailZod: undefined,
  passwordZod: undefined
})

const form = ref()
async function submit (data: Schema) {
  // Do something with data
  console.log(data)
}
</script>

<template>
  <UForm
    ref="form"
    :schema="schema"
    :state="state"
    @submit="(value) => submit(value)"
  >
    <UFormGroup label="Email" name="emailZod">
      <UInput v-model="state.emailZod" />
    </UFormGroup>

    <UFormGroup label="Password" name="passwordZod">
      <UInput v-model="state.passwordZod" type="password" />
    </UFormGroup>

    <UButton type="submit">
      Submit
    </UButton>
  </UForm>
</template>
