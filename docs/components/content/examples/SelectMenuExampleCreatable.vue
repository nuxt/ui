<script setup lang="ts">
const options = ref([
  { id: 1, name: 'bug', color: 'd73a4a' },
  { id: 2, name: 'documentation', color: '0075ca' },
  { id: 3, name: 'duplicate', color: 'cfd3d7' },
  { id: 4, name: 'enhancement', color: 'a2eeef' },
  { id: 5, name: 'good first issue', color: '7057ff' },
  { id: 6, name: 'help wanted', color: '008672' },
  { id: 7, name: 'invalid', color: 'e4e669' },
  { id: 8, name: 'question', color: 'd876e3' },
  { id: 9, name: 'wontfix', color: 'ffffff' }
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
        name: label.name,
        color: generateColorFromString(label.name)
      }

      options.value.push(response)

      return response
    })

    selected.value = await Promise.all(promises)
  }
})

function hashCode(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return hash
}

function intToRGB(i) {
  const c = (i & 0x00FFFFFF)
    .toString(16)
    .toUpperCase()

  return '00000'.substring(0, 6 - c.length) + c
}

function generateColorFromString(str) {
  return intToRGB(hashCode(str))
}
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
  >
    <template #label>
      <template v-if="labels.length">
        <span class="flex items-center -space-x-1">
          <span v-for="label of labels" :key="label.id" class="flex-shrink-0 w-2 h-2 mt-px rounded-full" :style="{ background: `#${label.color}` }" />
        </span>
        <span>{{ labels.length }} label{{ labels.length > 1 ? 's' : '' }}</span>
      </template>
      <template v-else>
        <span class="text-gray-500 dark:text-gray-400 truncate">Select labels</span>
      </template>
    </template>

    <template #option="{ option }">
      <span
        class="flex-shrink-0 w-2 h-2 mt-px rounded-full"
        :style="{ background: `#${option.color}` }"
      />
      <span class="truncate">{{ option.name }}</span>
    </template>

    <template #option-create="{ option }">
      <span class="flex-shrink-0">New label:</span>
      <span
        class="flex-shrink-0 w-2 h-2 mt-px rounded-full -mx-1"
        :style="{ background: `#${generateColorFromString(option.name)}` }"
      />
      <span class="block truncate">{{ option.name }}</span>
    </template>
  </USelectMenu>
</template>
