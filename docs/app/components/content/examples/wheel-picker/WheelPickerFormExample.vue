<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const schema = z.object({
  size: z.enum(['S', 'M', 'L', 'XL'], { message: 'Select a valid size' })
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  size: undefined
})

const toast = useToast()

function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({ title: 'Success', description: `Size: ${event.data.size}`, color: 'success' })
}
</script>

<template>
  <UForm :schema="schema" :state="state" class="flex flex-col items-center gap-4" @submit="onSubmit">
    <UFormField name="size" label="Size">
      <UWheelPicker v-model="state.size" :items="['S', 'M', 'L', 'XL']" class="w-24" />
    </UFormField>

    <UButton type="submit" label="Submit" />
  </UForm>
</template>
