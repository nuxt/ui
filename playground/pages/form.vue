<script setup lang="ts">
import { z } from 'zod'
import type { Form, FormSubmitEvent } from '#ui/types/form'

type User = {
  email: string
  password: string
  tos: boolean
}

const state = reactive<Partial<User>>({})
const state2 = reactive<Partial<User>>({})
const state3 = reactive<Partial<User>>({})

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  tos: z.literal(true)
})

const disabledForm = ref<Form<User>>()

function onSubmit (event: FormSubmitEvent<User>) {
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

      <UForm
        ref="disabledForm"
        :state="state3"
        :schema="schema"
        class="gap-4 flex flex-col w-60"
        disabled
        @submit="(event) => onSubmit(event)"
      >
        <UFormField label="Email" name="email">
          <UInput v-model="state3.email" placeholder="john@lennon.com" />
        </UFormField>

        <UFormField
          label="Password"
          name="password"
          :validate-on-input-delay="50"
          eager-validation
        >
          <UInput v-model="state3.password" type="password" />
        </UFormField>

        <UFormField name="tos">
          <UCheckbox v-model="state3.tos" label="I accept the terms and conditions" />
        </UFormField>

        <div>
          <UButton color="gray" type="submit" :disabled="disabledForm?.disabled">
            Submit
          </UButton>
        </div>
      </UForm>
    </div>

    <div class="flex gap-4">
      <FormNestedExample />
      <FormNestedListExample />
      <FormElementsExample />
    </div>
  </div>
</template>
