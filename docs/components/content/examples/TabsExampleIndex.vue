<script setup lang="ts">
const items = [{
  label: 'Tab1',
  content: 'This is the content shown for Tab1'
}, {
  label: 'Tab2',
  content: 'And, this is the content for Tab2'
}, {
  label: 'Tab3',
  content: 'Finally, this is the content for Tab3'
}]
</script>

<template>
  <UTabs :items="items" :default-index="2" />
</template>
