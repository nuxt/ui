<script setup lang="ts">
import { z } from 'zod'
import type { Form, FormSubmitEvent } from '#ui/types/form'

type User = {
  email: string
  password: string
}

const state = ref<User>({ email: '', password: '' })
const state2 = ref<User>({ email: '', password: '' })
const state3 = ref<User>({ email: '', password: '' })

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

const disabledForm = ref<Form<User>>()

function onSubmit (event: FormSubmitEvent<User>) {
  console.log(event.data)
}
</script>

<template>
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
        <UButton color="gray" type="submit" :disabled="disabledForm?.disabled">
          Submit
        </UButton>
      </div>
    </UForm>
  </div>
</template>
