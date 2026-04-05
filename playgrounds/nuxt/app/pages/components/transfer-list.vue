<script setup lang="ts">
import theme from '#build/ui/transfer-list'
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

const modelValue = ref<UserItem[]>([])

const searchable = ref(false)
const disabled = ref(false)
const loading = ref(false)
</script>

<template>
  <Navbar>
    <USwitch v-model="searchable" label="Searchable" />
    <USwitch v-model="disabled" label="Disabled" />
    <USwitch v-model="loading" label="Loading" />
    <USelect v-model="attrs.size" :items="sizes" placeholder="Size" multiple />
  </Navbar>

  <Matrix v-slot="props" :attrs="attrs" container-class="w-[600px]">
    <UTransferList
      v-model="modelValue"
      :items="users"
      :searchable="searchable"
      :disabled="disabled"
      :source-loading="loading"
      :target-loading="loading"
      source-title="All Users"
      target-title="Team Members"
      by="id"
      v-bind="props"
      class="w-full"
    />
  </Matrix>

  <div class="p-4 text-sm text-muted">
    Selected: {{ modelValue.map(u => u.label).join(', ') || 'None' }}
  </div>
</template>
