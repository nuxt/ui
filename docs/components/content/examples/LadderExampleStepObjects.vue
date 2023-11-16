<template>
  <ULadder :steps="steps" />
</template>

<script setup>
const steps = [
  { label: 'Address', icon: 'i-heroicons-home' },
  { label: 'Shipping', icon: 'i-heroicons-truck' },
  { label: 'Trade-in', icon: 'i-heroicons-arrow-path', disabled: true },
  { label: 'Payment', icon: 'i-heroicons-banknotes', click: () => alert('You clicked Payment!') },
  { label: 'Checkout', icon: 'i-heroicons-check' }
]
</script>
