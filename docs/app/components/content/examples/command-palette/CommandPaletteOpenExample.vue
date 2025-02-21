<script setup lang="ts">
const open = ref(false)

const users = [
  {
    label: 'Benjamin Canac',
    suffix: 'benjamincanac',
    to: 'https://github.com/benjamincanac',
    target: '_blank',
    avatar: {
      src: 'https://github.com/benjamincanac.png'
    }
  },
  {
    label: 'Sylvain Marroufin',
    suffix: 'smarroufin',
    to: 'https://github.com/smarroufin',
    target: '_blank',
    avatar: {
      src: 'https://github.com/smarroufin.png'
    }
  },
  {
    label: 'Sébastien Chopin',
    suffix: 'atinux',
    to: 'https://github.com/atinux',
    target: '_blank',
    avatar: {
      src: 'https://github.com/atinux.png'
    }
  },
  {
    label: 'Romain Hamel',
    suffix: 'romhml',
    to: 'https://github.com/romhml',
    target: '_blank',
    avatar: {
      src: 'https://github.com/romhml.png'
    }
  },
  {
    label: 'Haytham A. Salama',
    suffix: 'Haythamasalama',
    to: 'https://github.com/Haythamasalama',
    target: '_blank',
    avatar: {
      src: 'https://github.com/Haythamasalama.png'
    }
  },
  {
    label: 'Daniel Roe',
    suffix: 'danielroe',
    to: 'https://github.com/danielroe',
    target: '_blank',
    avatar: {
      src: 'https://github.com/danielroe.png'
    }
  },
  {
    label: 'Neil Richter',
    suffix: 'noook',
    to: 'https://github.com/noook',
    target: '_blank',
    avatar: {
      src: 'https://github.com/noook.png'
    }
  }
]
</script>

<template>
  <UModal v-model:open="open">
    <UButton
      label="Search users..."
      color="neutral"
      variant="subtle"
      icon="i-lucide-search"
    />

    <template #content>
      <UCommandPalette close :groups="[{ id: 'users', items: users }]" @update:open="open = $event" />
    </template>
  </UModal>
</template>
