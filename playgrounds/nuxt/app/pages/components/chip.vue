<script setup lang="ts">
import theme from '#build/ui/chip'

const sizes = Object.keys(theme.variants.size)
const positions = Object.keys(theme.variants.position)

const attrs = reactive({
  size: [theme.defaultVariants.size],
  position: [theme.defaultVariants.position]
})

const items = [{
  name: 'messages',
  icon: 'i-lucide-message-circle',
  count: 3
}, {
  name: 'notifications',
  icon: 'i-lucide-bell',
  count: 0
}]
</script>

<template>
  <Navbar>
    <USelect v-model="attrs.size" :items="sizes" multiple />
    <USelect v-model="attrs.position" :items="positions" multiple />
  </Navbar>
  <Matrix v-slot="props" :attrs="attrs">
    <UChip color="neutral" v-bind="props">
      <UButton icon="i-lucide-inbox" color="neutral" variant="subtle" />
    </UChip>

    <UChip v-for="{ name, icon, count } in items" :key="name" :text="count" :show="count > 0" v-bind="props">
      <UButton :icon="icon" color="neutral" variant="subtle" />
    </UChip>

    <UChip inset text="1" v-bind="props">
      <UAvatar src="https://github.com/benjamincanac.png" />
    </UChip>
  </Matrix>
</template>
