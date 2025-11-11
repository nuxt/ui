<script setup lang="ts">
const value = ref(1024)

function increment() {
  value.value++
}

function decrement() {
  value.value--
}

function random() {
  value.value = Math.floor(Math.random() * 10000)
}
</script>

<template>
  <Navbar>
    <UButton label="Increment" icon="i-lucide-plus" color="neutral" variant="outline" @click="increment" />
    <UButton label="Decrement" icon="i-lucide-minus" color="neutral" variant="outline" @click="decrement" />
    <UButton label="Random" icon="i-lucide-shuffle" color="neutral" variant="outline" @click="random" />
  </Navbar>

  <div>
    <UNumberCounter :value="value" />
  </div>
</template>
