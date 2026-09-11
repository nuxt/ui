<script setup lang="ts">
const links = [{
  label: 'Documentation',
  icon: 'i-lucide-book-open'
}, {
  label: 'Components',
  icon: 'i-lucide-box',
  active: true
}, {
  label: 'Templates',
  icon: 'i-lucide-presentation'
}]
</script>

<template>
  <Navbar />

  <UPageAnchors :links="links" />
</template>
