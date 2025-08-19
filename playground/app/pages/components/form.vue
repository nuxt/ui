<script setup lang="ts">
import * as z from 'zod'
import FormExampleElements from '../../../../docs/app/components/content/examples/form/FormExampleElements.vue'
import FormExampleNestedList from '../../../../docs/app/components/content/examples/form/FormExampleNestedList.vue'
import FormExampleNested from '../../../../docs/app/components/content/examples/form/FormExampleNested.vue'

const schema = z.object({
  email: z.string()
})

const { state, bind, watch } = useForm({
  schema,
  defaultValues: {
    email: undefined
  }
})

const validateOn = ref(['input', 'change', 'blur'])
const disabled = ref(false)

watch('email', v => console.log(v))
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="flex gap-4">
      {{ state }}
      <UFormField label="Email" name="testing.l.0.m">
        <UInput v-bind="bind('email')" placeholder="john@lennon.com" />
      </UFormField>

      <div>
        <UButton type="submit">
          Submit
        </UButton>
      </div>
      <FormExampleNested />
      <FormExampleNestedList />
    </div>

    <div class="border border-default rounded-lg">
      <div class="py-2 px-4 flex gap-4 items-center">
        <UFormField label="Validate on" class="flex items-center gap-2">
          <USelectMenu v-model="validateOn" :items="['input', 'change', 'blur']" multiple class="w-48" />
        </UFormField>
        <UCheckbox v-model="disabled" label="Disabled" />
      </div>

      <FormExampleElements :validate-on="validateOn" :disabled="disabled" class="border-t border-default p-4" />
    </div>
  </div>
</template>
