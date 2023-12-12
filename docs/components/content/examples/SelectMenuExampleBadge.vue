<script setup>
const people = [{
  id: 'benjamincanac',
  label: 'Benjamincanac'
}, {
  id: 'atinux',
  label: 'Atinux'
}, {
  id: 'smarroufin',
  label: 'Smarroufin'
}, {
  id: 'nobody',
  label: 'Nobody'
}]

const selected = ref(people[0])
</script>

<template>
  <USelectMenu
    v-model="selected"
    :options="people"
    multiple
    badge
    placeholder="Select people"
    value-attribute="id"
    option-attribute="label"
    badge-color="gray"
  />
</template>
