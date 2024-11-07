<script setup lang="ts">
const people = [{
  id: 1,
  name: 'Lindsay Walton',
  title: 'Front-end Developer',
  email: 'lindsay.walton@example.com',
  role: 'Member'
}, {
  id: 2,
  name: 'Courtney Henry',
  title: 'Designer',
  email: 'courtney.henry@example.com',
  role: 'Admin'
}, {
  id: 3,
  name: 'Tom Cook',
  title: 'Director of Product',
  email: 'tom.cook@example.com',
  role: 'Member'
}, {
  id: 4,
  name: 'Whitney Francis',
  title: 'Copywriter',
  email: 'whitney.francis@example.com',
  role: 'Admin'
}, {
  id: 5,
  name: 'Leonard Krasner',
  title: 'Senior Designer',
  email: 'leonard.krasner@example.com',
  role: 'Owner'
}]

const virtualElement = ref({ getBoundingClientRect: () => ({}) })
const contextMenuRow = ref()

function contextmenu(event: MouseEvent, row: any) {
  // Prevent the default context menu
  event.preventDefault()

  virtualElement.value.getBoundingClientRect = () => ({
    width: 0,
    height: 0,
    top: event.clientY,
    left: event.clientX
  })

  contextMenuRow.value = row
}
</script>

<template>
  <div>
    <UTable :rows="people" @contextmenu.stop="contextmenu" />

    <UContextMenu
      :virtual-element="virtualElement"
      :model-value="!!contextMenuRow"
      @update:model-value="contextMenuRow = null"
    >
      <div class="p-4">
        {{ contextMenuRow.id }} - {{ contextMenuRow.name }}
      </div>
    </UContextMenu>
  </div>
</template>
