<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const schema = z.object({
  input: z.string().min(10),
  inputNumber: z.number().min(10),
  inputMenu: z.any().refine(option => option?.value === 'option-2', {
    message: 'Select Option 2'
  }),
  inputMenuMultiple: z.any().refine(values => !!values?.find((option: any) => option.value === 'option-2'), {
    message: 'Include Option 2'
  }),
  textarea: z.string().min(10),
  select: z.string().refine(value => value === 'option-2', {
    message: 'Select Option 2'
  }),
  selectMenu: z.any().refine(option => option?.value === 'option-2', {
    message: 'Select Option 2'
  }),
  selectMenuMultiple: z.any().refine(values => !!values?.find((option: any) => option.value === 'option-2'), {
    message: 'Include Option 2'
  }),
  switch: z.boolean().refine(value => value === true, {
    message: 'Toggle me'
  }),
  checkbox: z.boolean().refine(value => value === true, {
    message: 'Check me'
  }),
  radioGroup: z.string().refine(value => value === 'option-2', {
    message: 'Select Option 2'
  }),
  slider: z.number().max(20, { message: 'Must be less than 20' }),
  pin: z.string().regex(/^\d$/).array().length(5)
})

type Schema = z.input<typeof schema>

const state = reactive<Partial<Schema>>({})

const form = useTemplateRef('form')

const items = [
  { label: 'Option 1', value: 'option-1' },
  { label: 'Option 2', value: 'option-2' },
  { label: 'Option 3', value: 'option-3' }
]

const toast = useToast()
async function onSubmit(event: FormSubmitEvent<any>) {
  toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' })
  console.log(event.data)
}
</script>

<template>
  <UForm ref="form" :state="state" :schema="schema" class="w-full" @submit="onSubmit">
    <div class="grid grid-cols-3 gap-4">
      <UFormField label="Input" name="input">
        <UInput v-model="state.input" placeholder="john@lennon.com" class="w-full" />
      </UFormField>

      <div class="flex flex-col gap-4">
        <UFormField name="switch">
          <USwitch v-model="state.switch" label="Switch me" />
        </UFormField>

        <UFormField name="checkbox">
          <UCheckbox v-model="state.checkbox" label="Check me" />
        </UFormField>
      </div>

      <UFormField name="slider" label="Slider">
        <USlider v-model="state.slider" />
      </UFormField>

      <UFormField name="select" label="Select">
        <USelect v-model="state.select" :items="items" class="w-full" />
      </UFormField>

      <UFormField name="selectMenu" label="Select Menu">
        <USelectMenu v-model="state.selectMenu" :items="items" class="w-full" />
      </UFormField>

      <UFormField name="selectMenuMultiple" label="Select Menu (Multiple)">
        <USelectMenu v-model="state.selectMenuMultiple" multiple :items="items" class="w-full" />
      </UFormField>

      <UFormField name="inputMenu" label="Input Menu">
        <UInputMenu v-model="state.inputMenu" :items="items" class="w-full" />
      </UFormField>

      <UFormField name="inputMenuMultiple" label="Input Menu (Multiple)">
        <UInputMenu v-model="state.inputMenuMultiple" multiple :items="items" class="w-full" />
      </UFormField>

      <UFormField name="inputNumber" label="Input Number">
        <UInputNumber v-model="state.inputNumber" class="w-full" />
      </UFormField>

      <UFormField label="Textarea" name="textarea">
        <UTextarea v-model="state.textarea" class="w-full" />
      </UFormField>

      <UFormField name="radioGroup">
        <URadioGroup v-model="state.radioGroup" legend="Radio group" :items="items" />
      </UFormField>

      <UFormField name="pin" label="Pin Input" :error-pattern="/(pin)\..*/">
        <UPinInput v-model="state.pin" />
      </UFormField>
    </div>

    <div class="flex gap-2 mt-8">
      <UButton type="submit">
        Submit
      </UButton>

      <UButton variant="outline" @click="form?.clear()">
        Clear
      </UButton>
    </div>
  </UForm>
</template>
