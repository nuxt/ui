<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const schema = z.object({
  email: z.string().min(2),
  password: z.string().min(8)
})

type Schema = z.output<typeof schema>

const nestedSchema = z.object({
  phone: z.string().length(10)
})

type NestedSchema = z.output<typeof nestedSchema>

const state = reactive<Partial<Schema & { nested: Partial<NestedSchema> }>>({
  nested: {}
})

const checked = ref(false)

function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log('Success', event.data)
}

function onError(event: any) {
  console.log('Error', event)
}
</script>

<template>
  <UForm
    :state="state"
    :schema="schema"
    class="gap-4 flex flex-col w-60"
    @submit="(event) => onSubmit(event)"
    @error="(event) => onError(event)"
  >
    <UFormField label="Email" name="email">
      <UInput v-model="state.email" placeholder="john@lennon.com" />
    </UFormField>

    <UFormField label="Password" name="password">
      <UInput v-model="state.password" type="password" />
    </UFormField>

    <div>
      <UCheckbox v-model="checked" name="check" label="Check me" @change="state.nested = {}" />
    </div>

    <UForm v-if="checked && state.nested" :state="state.nested" :schema="nestedSchema">
      <UFormField label="Phone" name="phone">
        <UInput v-model="state.nested.phone" />
      </UFormField>
    </UForm>

    <div>
      <UButton color="gray" type="submit">
        Submit
      </UButton>
    </div>
  </UForm>
</template>
