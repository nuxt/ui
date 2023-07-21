
<script setup lang="ts">
import { ref } from 'vue'
import { z } from 'zod'
import { Form } from '#ui'

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
  check: undefined,
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
  check: z.boolean().refine(value => value === true, {
    message: 'Check me'
  }),
  radio: z.string().refine(value => value === 'option-2', {
    message: 'Select Option 2'
  }),
  range: z.number().max(20, { message: 'Must be less than 20' })
})

type Schema = z.infer<typeof schema>

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
    class="space-y-4"
    @submit.prevent="submit"
  >
    <UFormGroup path="input" label="Input">
      <UInput v-model="state.input" />
    </UFormGroup>

    <UFormGroup path="textarea" label="Text Area">
      <UTextarea v-model="state.textarea" />
    </UFormGroup>

    <UFormGroup path="select" label="Select">
      <USelect v-model="state.select" placeholder="Select..." :options="options" />
    </UFormGroup>

    <UFormGroup path="selectMenu" label="Select Menu">
      <USelectMenu v-model="state.selectMenu" placeholder="Select..." :options="options" />
    </UFormGroup>

    <UFormGroup path="toggle" label="Toggle">
      <UToggle v-model="state.toggle" />
    </UFormGroup>

    <UFormGroup path="check" label="Checkbox">
      <UCheckbox v-model="state.check" />
    </UFormGroup>

    <UFormGroup path="radio" label="Radio">
      <URadio v-for="option in options" :key="option.value" v-model="state.radio" v-bind="option">
        {{ option.label }}
      </URadio>
    </UFormGroup>

    <UFormGroup path="range" label="Range">
      <URange v-model="state.range" />
    </UFormGroup>

    <UButton block type="submit">
      Submit
    </UButton>
  </UForm>
</template>
