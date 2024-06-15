<script setup lang="ts">
const options = ref([
  { id: 1, name: 'bug' },
  { id: 2, name: 'documentation' },
  { id: 3, name: 'duplicate' },
  { id: 4, name: 'enhancement' },
  { id: 5, name: 'good first issue' },
  { id: 6, name: 'help wanted' },
  { id: 7, name: 'invalid' },
  { id: 8, name: 'question' },
  { id: 9, name: 'wontfix' }
])

const selected = ref([])

const labels = computed({
  get: () => selected.value,
  set: async (labels) => {
    const promises = labels.map(async (label) => {
      if (label.id) {
        return label
      }

      // In a real app, you would make an API call to create the label
      const response = {
        id: options.value.length + 1,
        name: label.name
      }

      options.value.push(response)

      return response
    })

    selected.value = await Promise.all(promises)
  }
})
</script>

<template>
  <USelectMenu
    v-model="labels"
    by="id"
    name="labels"
    :options="options"
    option-attribute="name"
    multiple
    searchable
    creatable
    show-create-option-when="always"
    placeholder="Select labels"
  />
</template>
