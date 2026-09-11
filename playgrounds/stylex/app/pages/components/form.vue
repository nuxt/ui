<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import FormExampleElements from '../../components/form/FormExampleElements.vue'
import FormExampleNestedList from '../../components/form/FormExampleNestedList.vue'
import FormExampleNested from '../../components/form/FormExampleNested.vue'

const pg = usePg()

const schema = z.object({
  email: z.email(),
  password: z.string('Password is required').min(8),
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
  <Navbar />

  <div :class="pg.flex_flex_col_gap_8_min_h_0_mt_16_pb_8">
    <div :class="pg.flex_gap_4">
      <UForm
        :state="state"
        :schema="schema"
        :class="pg.gap_4_flex_flex_col_w_60"
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

    <div :class="pg.border_border_default_rounded_lg">
      <div :class="pg.py_2_px_4_flex_gap_4_items_center">
        <UFormField label="Validate on" :class="pg.flex_items_center_gap_2">
          <USelectMenu v-model="validateOn" :items="['input', 'change', 'blur']" multiple :class="pg.w_48" />
        </UFormField>
        <UCheckbox v-model="disabled" label="Disabled" />
      </div>

      <FormExampleElements :validate-on="validateOn" :disabled="disabled" :class="pg.border_t_border_default_p_4" />
    </div>
  </div>
</template>
