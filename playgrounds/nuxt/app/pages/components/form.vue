<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, FormErrorEvent } from '@nuxt/ui'

const schema = z.object({
  email: z.email(),
  password: z.string('Password is required').min(8),
  tos: z.literal(true)
})

type Schema = z.input<typeof schema>

const state = reactive<Partial<Schema>>({})

function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log('submit', event.data)
}

function onError(event: FormErrorEvent) {
  console.log('error', event.errors)
}
</script>

<template>
  <div class="flex gap-4">
    <UForm
      :state="state"
      :schema="schema"
      class="gap-4 flex flex-col w-60"
      @submit="onSubmit"
      @error="onError"
    >
      <UFormField label="Email" name="email">
        <UInput v-model="state.email" placeholder="john@lennon.com" />
      </UFormField>

      <UFormField label="Password" name="password">
        <UInput v-model="state.password" type="password" />
      </UFormField>

      <UFormField name="tos">
        <UCheckbox v-model="state.tos" label="I accept the terms and conditions" />
      </UFormField>

      <div>
        <UButton type="submit">
          Submit
        </UButton>
      </div>
    </UForm>
  </div>
</template>
