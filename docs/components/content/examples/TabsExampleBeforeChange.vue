<script setup lang="ts">
const items = [{
  label: 'Tab1',
  icon: 'i-heroicons-information-circle',
  content: 'This is the content shown for Tab1'
}, {
  label: 'Tab2',
  icon: 'i-heroicons-arrow-down-tray',
  content: 'And, this is the content for Tab2'
}, {
  label: 'Tab3',
  icon: 'i-heroicons-eye-dropper',
  content: 'Finally, this is the content for Tab3'
}]

function onBeforeChange(prevIndex, next) {
  if (window.confirm('Do you want to change tab?')) {
    const prevItem = items[prevIndex]
    alert(`Tab was changed! Previous tab is ${prevItem.label}`)
    return next()
  }
  alert('Tab was not changed!')
}
</script>

<template>
  <UTabs :items="items" @before-change="onBeforeChange" />
</template>
