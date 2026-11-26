<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const schema = z.object({
  config: z.string().refine((value) => {
    try {
      JSON.parse(value)
      return true
    } catch {
      return false
    }
  }, 'Must be valid JSON')
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  config: '{\n  "theme": "dark",\n  "notifications": true\n}\n'
})

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({ title: 'Saved', description: `Configuration: ${JSON.stringify(JSON.parse(event.data.config))}`, color: 'success' })
}
</script>

<template>
  <UForm :schema="schema" :state="state" class="w-full max-w-md space-y-4" @submit="onSubmit">
    <UFormField label="Configuration" name="config" description="Edit the JSON and submit, invalid JSON is reported by the form.">
      <UCodeEditor v-model="state.config" lang="json" class="w-full" />
    </UFormField>

    <UButton type="submit" label="Save" />
  </UForm>
</template>
