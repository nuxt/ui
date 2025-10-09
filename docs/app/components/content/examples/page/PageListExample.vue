<script setup lang="ts">
const users = ref([
  {
    name: 'Benjamin Canac',
    description: 'benjamincanac',
    to: 'https://github.com/benjamincanac',
    target: '_blank',
    avatar: {
      src: 'https://github.com/benjamincanac.png',
      alt: 'benjamincanac'
    }
  },
  {
    name: 'Romain Hamel',
    description: 'romhml',
    to: 'https://github.com/romhml',
    target: '_blank',
    avatar: {
      src: 'https://github.com/romhml.png',
      alt: 'romhml'
    }
  },
  {
    name: 'Sébastien Chopin',
    description: 'atinux',
    to: 'https://github.com/atinux',
    target: '_blank',
    avatar: {
      src: 'https://github.com/atinux.png',
      alt: 'atinux'
    }
  },
  {
    name: 'Hugo Richard',
    description: 'HugoRCD',
    to: 'https://github.com/HugoRCD',
    target: '_blank',
    avatar: {
      src: 'https://github.com/HugoRCD.png',
      alt: 'HugoRCD'
    }
  },
  {
    name: 'Sandro Circi',
    description: 'sandros94',
    to: 'https://github.com/sandros94',
    target: '_blank',
    avatar: {
      src: 'https://github.com/sandros94.png',
      alt: 'sandros94'
    }
  },
  {
    name: 'Daniel Roe',
    description: 'danielroe',
    to: 'https://github.com/danielroe',
    target: '_blank',
    avatar: {
      src: 'https://github.com/danielroe.png',
      alt: 'danielroe'
    }
  },
  {
    name: 'Jakub Michálek',
    description: 'J-Michalek',
    to: 'https://github.com/J-Michalek',
    target: '_blank',
    avatar: {
      src: 'https://github.com/J-Michalek.png',
      alt: 'J-Michalek'
    }
  },
  {
    name: 'Eugen Istoc',
    description: 'genu',
    to: 'https://github.com/genu',
    target: '_blank',
    avatar: {
      src: 'https://github.com/genu.png',
      alt: 'genu'
    }
  }
])
</script>

<template>
  <UPageList>
    <UPageCard
      v-for="(user, index) in users"
      :key="index"
      variant="ghost"
      :to="user.to"
      :target="user.target"
    >
      <template #body>
        <UUser :name="user.name" :description="user.description" :avatar="user.avatar" size="xl" class="relative" />
      </template>
    </UPageCard>
  </UPageList>
</template>
