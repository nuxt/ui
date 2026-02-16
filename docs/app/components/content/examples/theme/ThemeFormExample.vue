<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const schema = z.object({
  name: z.string().min(2, 'Too short'),
  email: z.email('Invalid email'),
  bio: z.string().optional()
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  name: 'John Doe',
  email: 'john@example.com',
  bio: undefined
})

const toast = useToast()
async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({ title: 'Saved', description: 'Your profile has been updated.', color: 'success' })
  console.log(event.data)
}
</script>

<template>
  <UTheme
    :ui="{
      formField: {
        root: 'flex max-sm:flex-col justify-between gap-4',
        wrapper: 'w-full sm:max-w-xs'
      }
    }"
  >
    <UForm :schema="schema" :state="state" class="space-y-4 w-full" @submit="onSubmit">
      <UFormField label="Name" name="name" description="Your public display name.">
        <UInput v-model="state.name" />
      </UFormField>

      <UFormField label="Email" name="email" description="Used for notifications.">
        <UInput v-model="state.email" type="email" />
      </UFormField>

      <UFormField label="Bio" name="bio" description="A short description about yourself.">
        <UTextarea v-model="state.bio" placeholder="Tell us about yourself" />
      </UFormField>

      <div class="flex justify-end">
        <UButton type="submit">
          Save changes
        </UButton>
      </div>
    </UForm>
  </UTheme>
</template>
