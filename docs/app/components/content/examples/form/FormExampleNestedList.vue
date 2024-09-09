<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const schema = z.object({
  customer: z.string().min(2)
})

type Schema = z.output<typeof schema>

const itemSchema = z.object({
  description: z.string().min(1),
  price: z.number().min(0)
})

type ItemSchema = z.output<typeof itemSchema>

const state = reactive<Partial<Schema & { items: Partial<ItemSchema>[] }>>({
  items: [{}]
})

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
const formItemRef = ref()

const toast = useToast()
async function onSubmit(event: FormSubmitEvent<any>) {
  toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'green' })
  console.log(event.data)
}

async function onError(e) {
  console.log(state)
  console.error(e.value)
}
</script>

<template>
  <UForm
    ref="formItemRef"
    :state="state"
    :schema="schema"
    class="gap-4 flex flex-col w-60"
    @submit="onSubmit"
    @error="onError"
  >
    <UFormField label="Customer" name="customer">
      <UInput v-model="state.customer" placeholder="Wonka Industries" />
    </UFormField>

    <UForm v-for="item, count in state.items" :key="count" :state="item" :schema="itemSchema" class="flex gap-2">
      <UFormField label="Description" name="description">
        <UInput v-model="item.description" />
      </UFormField>
      <UFormField label="Price" name="price" class="w-20">
        <UInput v-model="item.price" type="number" />
      </UFormField>
    </UForm>

    <div class="flex gap-2">
      <UButton color="gray" variant="subtle" size="sm" @click="addItem()">
        Add Item
      </UButton>

      <UButton color="gray" variant="ghost" size="sm" @click="removeItem()">
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
