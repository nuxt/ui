<script setup lang="ts">
const users = [
  {
    label: 'Benjamin Canac',
    suffix: 'benjamincanac',
    to: 'https://github.com/benjamincanac',
    target: '_blank',
    avatar: {
      src: 'https://github.com/benjamincanac.png',
      alt: 'benjamincanac'
    }
  },
  {
    label: 'Sylvain Marroufin',
    suffix: 'smarroufin',
    to: 'https://github.com/smarroufin',
    target: '_blank',
    avatar: {
      src: 'https://github.com/smarroufin.png',
      alt: 'smarroufin'
    }
  },
  {
    label: 'Sébastien Chopin',
    suffix: 'atinux',
    to: 'https://github.com/atinux',
    target: '_blank',
    avatar: {
      src: 'https://github.com/atinux.png',
      alt: 'atinux'
    }
  },
  {
    label: 'Romain Hamel',
    suffix: 'romhml',
    to: 'https://github.com/romhml',
    target: '_blank',
    avatar: {
      src: 'https://github.com/romhml.png',
      alt: 'romhml'
    }
  },
  {
    label: 'Haytham A. Salama',
    suffix: 'Haythamasalama',
    to: 'https://github.com/Haythamasalama',
    target: '_blank',
    avatar: {
      src: 'https://github.com/Haythamasalama.png',
      alt: 'Haythamasalama'
    }
  },
  {
    label: 'Daniel Roe',
    suffix: 'danielroe',
    to: 'https://github.com/danielroe',
    target: '_blank',
    avatar: {
      src: 'https://github.com/danielroe.png',
      alt: 'danielroe'
    }
  },
  {
    label: 'Neil Richter',
    suffix: 'noook',
    to: 'https://github.com/noook',
    target: '_blank',
    avatar: {
      src: 'https://github.com/noook.png',
      alt: 'noook'
    }
  }
]

const searchTerm = ref('B')

function onSelect() {
  searchTerm.value = ''
}
</script>

<template>
  <UCommandPalette
    v-model:search-term="searchTerm"
    :groups="[{ id: 'users', items: users }]"
    class="flex-1"
    @update:model-value="onSelect"
  />
</template>
