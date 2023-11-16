<template>
  <UFeed :feed="feed" />
</template>

<script setup>
const feed = [
  {
    title: 'Cloned',
    description: 'Repository retrieved from GitHub',
    icon: 'i-heroicons-cloud-arrow-down',
    trailing: 'Oct 8 09:35:05',
    color: 'amber'
  },
  {
    title: 'Installed',
    description: 'Dependencies installed',
    icon: 'i-heroicons-clipboard-document-check',
    trailing: 'Oct 8 09:36:21',
    color: 'yellow'
  },
  {
    title: 'Configured',
    description: 'App configuration applied',
    icon: 'i-heroicons-wrench',
    trailing: 'Oct 8 09:36:32',
    color: 'lime'
  },
  {
    title: 'Deployed',
    description: 'App running',
    icon: 'i-heroicons-paper-airplane',
    trailing: 'Oct 8 09:36:38',
    color: 'green'
  }
]
</script>
