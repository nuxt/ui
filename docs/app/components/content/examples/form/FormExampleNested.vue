<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const schema = z.object({
  name: z.string().min(2),
  news: z.boolean()
})

type Schema = z.output<typeof schema>

const nestedSchema = z.object({
  email: z.string().email()
})

type NestedSchema = z.output<typeof nestedSchema>

const state = reactive<Partial<Schema & NestedSchema>>({ })

const toast = useToast()
async function onSubmit(event: FormSubmitEvent<any>) {
  toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' })
  console.log(event.data)
}
</script>

<template>
  <UForm
    :state="state"
    :schema="schema"
    class="gap-4 flex flex-col w-60"
    @submit="onSubmit"
  >
    <UFormField label="Name" name="name">
      <UInput v-model="state.name" placeholder="John Lennon" />
    </UFormField>

    <div>
      <UCheckbox v-model="state.news" name="news" label="Register to our newsletter" />
    </div>

    <UForm v-if="state.news" :state="state" :schema="nestedSchema">
      <UFormField label="Email" name="email">
        <UInput v-model="state.email" placeholder="john@lennon.com" />
      </UFormField>
    </UForm>

    <div>
      <UButton type="submit">
        Submit
      </UButton>
    </div>
  </UForm>
</template>
