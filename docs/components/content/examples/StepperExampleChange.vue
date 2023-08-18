<script setup>
const items = [{
  label: 'Step1'
}, {
  label: 'Step2'
}, {
  label: 'Step3'
}]

function onChange (index) {
  const item = items[index]

  alert(`${item.label} was clicked!`)
}
</script>

<template>
  <UStepper :items="items" @change="onChange" />
</template>