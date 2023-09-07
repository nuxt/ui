<script setup lang="ts">
import { ref } from 'vue'
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui/dist/runtime/types'

const options = [
  { label: 'Option 1', value: 'option-1' },
  { label: 'Option 2', value: 'option-2' },
  { label: 'Option 3', value: 'option-3' }
]

const state = ref({
  input: undefined,
  textarea: undefined,
  select: undefined,
  selectMenu: undefined,
  checkbox: undefined,
  toggle: undefined,
  radio: undefined,
  switch: undefined,
  range: undefined
})

const schema = z.object({
  input: z.string().min(10),
  textarea: z.string().min(10),
  select: z.string().refine(value => value === 'option-2', {
    message: 'Select Option 2'
  }),
  selectMenu: z.any().refine(option => option?.value === 'option-2', {
    message: 'Select Option 2'
  }),
  toggle: z.boolean().refine(value => value === true, {
    message: 'Toggle me'
  }),
  checkbox: z.boolean().refine(value => value === true, {
    message: 'Check me'
  }),
  radio: z.string().refine(value => value === 'option-2', {
    message: 'Select Option 2'
  }),
  range: z.number().max(20, { message: 'Must be less than 20' })
})

type Schema = z.infer<typeof schema>

const form = ref()

async function submit (event: FormSubmitEvent<Schema>) {
  // Do something with event.data
  console.log(event.data)
}
</script>

<template>
  <UForm
    ref="form"
    :schema="schema"
    :state="state"
    @submit="submit"
  >
    <UFormGroup name="input" label="Input">
      <UInput v-model="state.input" />
    </UFormGroup>

    <UFormGroup name="textarea" label="Textarea">
      <UTextarea v-model="state.textarea" />
    </UFormGroup>

    <UFormGroup name="select" label="Select">
      <USelect v-model="state.select" placeholder="Select..." :options="options" />
    </UFormGroup>

    <UFormGroup name="selectMenu" label="Select Menu">
      <USelectMenu v-model="state.selectMenu" placeholder="Select..." :options="options" />
    </UFormGroup>

    <UFormGroup name="toggle" label="Toggle">
      <UToggle v-model="state.toggle" />
    </UFormGroup>

    <UFormGroup name="checkbox" label="Checkbox">
      <UCheckbox v-model="state.checkbox" />
    </UFormGroup>

    <UFormGroup name="radio" label="Radio">
      <URadio v-for="option in options" :key="option.value" v-model="state.radio" v-bind="option">
        {{ option.label }}
      </URadio>
    </UFormGroup>

    <UFormGroup name="range" label="Range">
      <URange v-model="state.range" />
    </UFormGroup>

    <UButton type="submit">
      Submit
    </UButton>

    <UButton variant="outline" class="ml-2" @click="form.clear()">
      Clear
    </UButton>
  </UForm>
</template>
