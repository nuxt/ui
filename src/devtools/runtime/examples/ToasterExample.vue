<script setup>
import { useToast } from '#imports'

const toast = useToast()
</script>

<template>
  <UToaster>
    <UButton label="Open toast" @click="toast.add({ title: 'Heads up!' })" />
  </UToaster>
</template>
