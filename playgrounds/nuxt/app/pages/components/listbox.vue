<script setup lang="ts">
import theme from '#build/ui/listbox'
import type { User } from '~/types'

const sizes = Object.keys(theme.variants.size)

const attrs = reactive({
  size: [theme.defaultVariants.size]
})

const { data: users } = await useFetch('https://jsonplaceholder.typicode.com/users', {
  transform: (data: User[]) => {
    return data?.map(user => ({ id: user.id, label: user.name, avatar: { src: `https://i.pravatar.cc/120?img=${user.id}` } })) || []
  },
  lazy: true
})

type UserItem = NonNullable<typeof users.value>[number]

const singleValue = ref<UserItem>()
const multipleValue = ref<UserItem[]>([])

const filter = ref(false)
const disabled = ref(false)
const loading = ref(false)
const multiple = ref(false)
const virtualize = ref(false)

const virtualItems = Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  label: `Item ${i + 1}`,
  description: `Description for item ${i + 1}`
}))
</script>

<template>
  <Navbar>
    <USwitch v-model="filter" label="Filter" />
    <USwitch v-model="disabled" label="Disabled" />
    <USwitch v-model="loading" label="Loading" />
    <USwitch v-model="multiple" label="Multiple" />
    <USwitch v-model="virtualize" label="Virtualize" />
    <USelect v-model="attrs.size" :items="sizes" placeholder="Size" multiple />
  </Navbar>

  <Matrix v-slot="props" :attrs="attrs" container-class="w-[350px]">
    <UListbox
      v-if="virtualize"
      :items="virtualItems"
      :filter="filter"
      :disabled="disabled"
      :loading="loading"
      :multiple="multiple"
      virtualize
      by="id"
      v-bind="props"
      class="w-full"
    />
    <UListbox
      v-else-if="multiple"
      v-model="multipleValue"
      :items="users"
      :filter="filter"
      :disabled="disabled"
      :loading="loading"
      multiple
      by="id"
      v-bind="props"
      class="w-full"
    />
    <UListbox
      v-else
      v-model="singleValue"
      :items="users"
      :filter="filter"
      :disabled="disabled"
      :loading="loading"
      by="id"
      v-bind="props"
      class="w-full"
    />
  </Matrix>

  <div class="p-4 text-sm text-muted">
    Selected: {{ multiple ? (multipleValue.map(u => u.label).join(', ') || 'None') : (singleValue?.label || 'None') }}
  </div>
</template>
