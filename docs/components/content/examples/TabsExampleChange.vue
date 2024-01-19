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

function onChange (index) {
  const item = items[index]

  alert(`${item.label} was clicked!`)
}
</script>

<template>
  <UTabs :items="items" @change="onChange" />
</template>
