<script setup lang="ts">
const open = ref(false)

const users = [
  {
    label: 'Benjamin Canac',
    suffix: 'benjamincanac',
    to: 'https://github.com/benjamincanac',
    target: '_blank',
    avatar: {
      src: 'https://github.com/benjamincanac.png',
      loading: 'lazy' as const
    }
  },
  {
    label: 'Hugo Richard',
    suffix: 'HugoRCD',
    to: 'https://github.com/HugoRCD',
    target: '_blank',
    avatar: {
      src: 'https://github.com/HugoRCD.png',
      loading: 'lazy' as const
    }
  },
  {
    label: 'Sébastien Chopin',
    suffix: 'atinux',
    to: 'https://github.com/atinux',
    target: '_blank',
    avatar: {
      src: 'https://github.com/atinux.png',
      loading: 'lazy' as const
    }
  },
  {
    label: 'Romain Hamel',
    suffix: 'romhml',
    to: 'https://github.com/romhml',
    target: '_blank',
    avatar: {
      src: 'https://github.com/romhml.png',
      loading: 'lazy' as const
    }
  },
  {
    label: 'Sandro Circi',
    suffix: 'sandros94',
    to: 'https://github.com/sandros94',
    target: '_blank',
    avatar: {
      src: 'https://github.com/sandros94.png',
      loading: 'lazy' as const
    }
  },
  {
    label: 'Jakub Michálek',
    suffix: 'J-Michalek',
    to: 'https://github.com/J-Michalek',
    target: '_blank',
    avatar: {
      src: 'https://github.com/J-Michalek.png',
      loading: 'lazy' as const
    }
  },
  {
    label: 'Alex',
    suffix: 'hywax',
    to: 'https://github.com/hywax',
    target: '_blank',
    avatar: {
      src: 'https://github.com/hywax.png',
      loading: 'lazy' as const
    }
  },
  {
    label: 'Maxime Pauvert',
    suffix: 'maximepvrt',
    to: 'https://github.com/maximepvrt',
    target: '_blank',
    avatar: {
      src: 'https://github.com/maximepvrt.png',
      loading: 'lazy' as const
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
