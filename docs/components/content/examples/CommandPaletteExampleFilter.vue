<script setup lang="ts">
const people = [
  { id: 1, label: 'Wade Cooper', child: true },
  { id: 2, label: 'Arlene Mccoy' },
  { id: 3, label: 'Devon Webb', child: true },
  { id: 4, label: 'Tom Cook' },
  { id: 5, label: 'Tanya Fox', child: true },
  { id: 6, label: 'Hellen Schmidt' },
  { id: 7, label: 'Caroline Schultz', child: true },
  { id: 8, label: 'Mason Heaney' },
  { id: 9, label: 'Claudie Smitham', child: true },
  { id: 10, label: 'Emil Schaefer' }
]

const groups = [{
  key: 'users',
  commands: people,
  filter: (q, commands) => {
    if (!q) {
      return commands?.filter(command => !command.child)
    }

    return commands
  }
}]
</script>

<template>
  <UCommandPalette :groups="groups" :autoselect="false" />
</template>
