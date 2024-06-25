<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const schema = z.object({
  email: z.string().min(2),
  password: z.string().min(8)
})

type Schema = z.output<typeof schema>

const itemSchema = z.object({
  name: z.string().min(1),
  price: z.string().min(1)
})

type ItemSchema = z.output<typeof itemSchema>

const state = reactive<Partial<Schema & { items: Partial<ItemSchema>[] }>>({})

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

function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log('Success', event.data)
}

function onError(event: any) {
  console.log('Error', event)
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
    <UFormField label="Email" name="email">
      <UInput v-model="state.email" placeholder="john@lennon.com" />
    </UFormField>

    <UFormField label="Password" name="password">
      <UInput v-model="state.password" type="password" />
    </UFormField>

    <UForm v-for="item, count in state.items" :key="count" :state="item" :schema="itemSchema" class="flex gap-2">
      <UFormField label="Name" name="name">
        <UInput v-model="item.name" />
      </UFormField>
      <UFormField label="Price" name="price">
        <UInput v-model="item.price" />
      </UFormField>
    </UForm>

    <div class="flex gap-2">
      <UButton color="black" @click="addItem()">
        Add Item
      </UButton>

      <UButton color="black" variant="ghost" @click="removeItem()">
        Remove Item
      </UButton>
    </div>
    <div>
      <UButton color="gray" type="submit">
        Submit
      </UButton>
    </div>
  </UForm>
</template>
