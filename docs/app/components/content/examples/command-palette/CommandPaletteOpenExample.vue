<script setup lang="ts">
const open = ref(false)

const users = [
  {
    label: 'Benjamin Canac',
    suffix: 'benjamincanac',
    avatar: {
      src: 'https://github.com/benjamincanac.png'
    }
  },
  {
    label: 'Sylvain Marroufin',
    suffix: 'smarroufin',
    avatar: {
      src: 'https://github.com/smarroufin.png'
    }
  },
  {
    label: 'Sébastien Chopin',
    suffix: 'atinux',
    avatar: {
      src: 'https://github.com/atinux.png'
    }
  },
  {
    label: 'Romain Hamel',
    suffix: 'romhml',
    avatar: {
      src: 'https://github.com/romhml.png'
    }
  },
  {
    label: 'Haytham A. Salama',
    suffix: 'Haythamasalama',
    avatar: {
      src: 'https://github.com/Haythamasalama.png'
    }
  },
  {
    label: 'Daniel Roe',
    suffix: 'danielroe',
    avatar: {
      src: 'https://github.com/danielroe.png'
    }
  },
  {
    label: 'Neil Richter',
    suffix: 'noook',
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
