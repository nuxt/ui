<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  tos: z.literal(true)
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({})
const state2 = reactive<Partial<Schema>>({})

function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log(event.data)
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex gap-4">
      <UForm
        :state="state"
        :schema="schema"
        class="gap-4 flex flex-col w-60"
        @submit="(event) => onSubmit(event)"
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
          <UButton color="gray" type="submit">
            Submit
          </UButton>
        </div>
      </UForm>

      <UForm
        :state="state2"
        :schema="schema"
        class="gap-4 flex flex-col w-60"
        :validate-on-input-delay="2000"
        @submit="(event) => onSubmit(event)"
      >
        <UFormField label="Email" name="email">
          <UInput v-model="state2.email" placeholder="john@lennon.com" />
        </UFormField>

        <UFormField
          label="Password"
          name="password"
          :validate-on-input-delay="50"
          eager-validation
        >
          <UInput v-model="state2.password" type="password" />
        </UFormField>

        <div>
          <UButton color="gray" type="submit">
            Submit
          </UButton>
        </div>
      </UForm>
      <FormNestedExample />
      <FormNestedListExample />
    </div>

    <USeparator class="my-8" />

    <div class="flex gap-4 flex-wrap">
      <div>
        <p class="text-lg font-bold underline mb-4">
          Validate on input
        </p>
        <FormElementsExample :validate-on="['input']" />
      </div>
      <div>
        <p class="text-lg font-bold underline mb-4">
          Validate on change
        </p>
        <FormElementsExample :validate-on="['change']" />
      </div>
      <div>
        <p class="text-lg font-bold underline mb-4">
          Validate on blur
        </p>
        <FormElementsExample :validate-on="['blur']" />
      </div>
      <div>
        <p class="text-lg font-bold underline mb-4">
          Default
        </p>
        <FormElementsExample />
      </div>
      <div>
        <p class="text-lg font-bold underline mb-4">
          Disabled
        </p>
        <FormElementsExample disabled />
      </div>
    </div>
  </div>
</template>
