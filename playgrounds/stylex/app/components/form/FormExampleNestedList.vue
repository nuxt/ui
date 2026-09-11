<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
const pg = usePg()


const schema = z.object({
  customer: z.string().min(2)
})

type Schema = z.output<typeof schema>

const itemSchema = z.object({
  description: z.string().min(1),
  price: z.number().min(0)
})

type ItemSchema = z.output<typeof itemSchema>

const state = reactive<Partial<Schema & { items: Partial<ItemSchema>[] }>>({ })

function addItem() {
  if (!state.items) {
    state.items = []
  }
  state.items.push({})
}

function removeItem() {
  if (state.items) {
    state.items.pop()
  }
}

const toast = useToast()

async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' })
  console.log(event.data)
}
</script>

<template>
  <UForm
    :state="state"
    :schema="schema"
    :class="pg.gap_4_flex_flex_col_w_60"
    @submit="onSubmit"
  >
    <UFormField label="Customer" name="customer">
      <UInput v-model="state.customer" placeholder="Wonka Industries" />
    </UFormField>

    <UForm
      v-for="item, count in state.items"
      :key="count"
      :name="`items.${count}`"
      :schema="itemSchema"
      :class="pg.flex_gap_2"
      nested
    >
      <UFormField :label="!count ? 'Description' : undefined" name="description">
        <UInput v-model="item.description" />
      </UFormField>
      <UFormField :label="!count ? 'Price' : undefined" name="price" :class="pg.w_20">
        <UInput v-model="item.price" type="number" />
      </UFormField>
    </UForm>

    <div :class="pg.flex_gap_2">
      <UButton color="neutral" variant="subtle" size="sm" @click="addItem()">
        Add Item
      </UButton>

      <UButton color="neutral" variant="ghost" size="sm" @click="removeItem()">
        Remove Item
      </UButton>
    </div>
    <div>
      <UButton type="submit">
        Submit
      </UButton>
    </div>
  </UForm>
</template>
