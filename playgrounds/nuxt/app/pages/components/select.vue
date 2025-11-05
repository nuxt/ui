<script setup lang="ts">
import type { SelectItem, AvatarProps } from '@nuxt/ui'
import theme from '#build/ui/select'
import type { User } from '~/types'

const colors = Object.keys(theme.variants.color)
const sizes = Object.keys(theme.variants.size)
const variants = Object.keys(theme.variants.variant)

const attrs = reactive({
  color: [theme.defaultVariants.color],
  size: [theme.defaultVariants.size],
  variant: [theme.defaultVariants.variant]
})

const fruits = ['Apple', 'Banana', 'Blueberry', 'Grapes', 'Pineapple']
const vegetables = ['Aubergine', 'Broccoli', 'Carrot', 'Courgette', 'Leek']

const items = [[{ label: 'Fruits', type: 'label' as const }, ...fruits], [{ label: 'Vegetables', type: 'label' as const }, ...vegetables]]

const statuses = [{
  label: 'Backlog',
  value: 'backlog',
  description: 'Issues that have been identified but not yet prioritized',
  icon: 'i-lucide-circle-help'
}, {
  label: 'Todo',
  value: 'todo',
  description: 'Issues that are ready to be worked on',
  icon: 'i-lucide-circle-plus'
}, {
  label: 'In Progress',
  value: 'in_progress',
  description: 'Issues that are currently being worked on',
  icon: 'i-lucide-circle-arrow-up'
}, {
  label: 'Done',
  value: 'done',
  description: 'Issues that have been completed successfully',
  icon: 'i-lucide-circle-check'
}, {
  label: 'Canceled',
  value: 'canceled',
  description: 'Issues that have been cancelled or rejected',
  icon: 'i-lucide-circle-x'
}] satisfies SelectItem[]

const { data: users, status } = await useFetch('https://jsonplaceholder.typicode.com/users', {
  transform: (data: User[]) => {
    return data?.map(user => ({ label: user.name, value: String(user.id), avatar: { src: `https://i.pravatar.cc/120?img=${user.id}` } })) || []
  },
  lazy: true
})

function getStatusIcon(value: string) {
  return statuses.find(status => status.value === value)?.icon || 'i-lucide-user'
}

function getUserAvatar(value: string) {
  return users.value?.find(user => user.value === value)?.avatar || {}
}

const value = ref('Apple')
const valueMultiple = ref([fruits[0]!, vegetables[0]!])
</script>

<template>
  <Navbar>
    <USelect v-model="attrs.color" :items="colors" multiple />
    <USelect v-model="attrs.size" :items="sizes" multiple />
    <USelect v-model="attrs.variant" :items="variants" multiple />
  </Navbar>

  <Matrix v-slot="props" :attrs="attrs">
    <USelect v-model="value" :items="items" autofocus v-bind="props" />
    <USelect :default-value="value" :items="items" v-bind="props" />
    <USelect v-model="valueMultiple" multiple placeholder="Multiple" :items="items" v-bind="props" />
    <USelect :default-value="valueMultiple" multiple placeholder="Multiple" :items="items" v-bind="props" />
    <USelect placeholder="Highlight" highlight :items="items" v-bind="props" />
    <USelect placeholder="Disabled" disabled :items="items" v-bind="props" />
    <USelect placeholder="Required" required :items="items" v-bind="props" />
    <USelect placeholder="Search..." icon="i-lucide-search" :items="items" v-bind="props" />
    <USelect placeholder="Search..." trailing-icon="i-lucide-search" :items="items" v-bind="props" />
    <USelect placeholder="Search..." :avatar="{ src: 'https://github.com/benjamincanac.png' }" :items="items" v-bind="props" />
    <USelect placeholder="Loading..." loading :items="items" v-bind="props" />
    <USelect placeholder="Loading..." loading trailing :items="items" v-bind="props" />
    <USelect
      placeholder="Loading..."
      loading
      icon="i-lucide-search"
      trailing-icon="i-lucide-arrow-right"
      :items="items"
      v-bind="props"
    />
    <USelect
      placeholder="Search status..."
      icon="i-lucide-search"
      trailing-icon="i-lucide-chevrons-up-down"
      :items="statuses"
      v-bind="props"
    >
      <template #leading="{ modelValue, ui }">
        <UIcon v-if="modelValue" :name="getStatusIcon(modelValue)" :class="ui.leadingIcon()" />
      </template>
    </USelect>
    <USelect
      placeholder="Search users..."
      icon="i-lucide-user"
      :loading="status === 'pending'"
      :items="users"
      v-bind="props"
    >
      <template #leading="{ modelValue, ui }">
        <UAvatar v-if="modelValue" :size="(ui.itemLeadingAvatarSize() as AvatarProps['size'])" v-bind="getUserAvatar(modelValue)" />
      </template>
    </USelect>
  </Matrix>
</template>
