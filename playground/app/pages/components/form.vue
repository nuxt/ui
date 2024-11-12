<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import FormExampleElements from '../../../../docs/app/components/content/examples/form/FormExampleElements.vue'
import FormExampleNestedList from '../../../../docs/app/components/content/examples/form/FormExampleNestedList.vue'
import FormExampleNested from '../../../../docs/app/components/content/examples/form/FormExampleNested.vue'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  tos: z.literal(true)
})

type Schema = z.input<typeof schema>

const state = reactive<Partial<Schema>>({})

function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log(event.data)
}

const validateOn = ref(['input', 'change', 'blur'])
const disabled = ref(false)
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="flex gap-4">
      <UForm
        :state="state"
        :schema="schema"
        class="gap-4 flex flex-col w-60"
        @submit="onSubmit"
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
          <UButton type="submit">
            Submit
          </UButton>
        </div>
      </UForm>
      <FormExampleNested />
      <FormExampleNestedList />
    </div>

    <div class="border border-[var(--ui-border)] rounded-lg">
      <div class="py-2 px-4 flex gap-4 items-center">
        <UFormField label="Validate on" class="flex items-center gap-2">
          <USelectMenu v-model="validateOn" :items="['input', 'change', 'blur']" multiple class="w-48" />
        </UFormField>
        <UCheckbox v-model="disabled" label="Disabled" />
      </div>

      <FormExampleElements :validate-on="validateOn" :disabled="disabled" class="border-t border-[var(--ui-border)] p-4" />
    </div>
  </div>
</template>
