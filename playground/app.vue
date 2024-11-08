<script setup lang="ts">
const people = ['Wade Cooper', 'Arlene Mccoy', 'Devon Webb', 'Tom Cook', 'Tanya Fox', 'Hellen Schmidt', 'Caroline Schultz', 'Mason Heaney', 'Claudie Smitham', 'Emil Schaefer']

const selected = ref()

const handleClose = () => {
}
</script>

<template>
  <UContainer>
    <USelectMenu
      v-model="selected"
      multiple
      clearable
      :options="people"
      placeholder="Select people"
      @clear="handleClose"
    />
  </UContainer>
</template>
