<script setup>
const items = [{
  label: 'Basic Information',
  icon: 'i-heroicons-user',
  content: 'This is the content shown for Basic Information'
}, {
  label: 'Upload Documents',
  icon: 'i-heroicons-folder-open',
  content: 'And, this is the content for Upload Documents'
}, {
  label: 'Review & Submit',
  icon: 'i-heroicons-check-circle',
  content: 'Finally, this is the content for Review & Submit'
}]

const selectedIndex = ref(0)
</script>

<template>
  <div class="w-full">
    <UTabs
      v-model="selectedIndex"
      :items="items"
      :ui="{ list: { background: '', marker: { shadow: '' } }, container: '' }"
    >
      <template #default="{ item, index, selected }">
        <UButton
          class="z-40 bg-white dark:bg-gray-900"
          variant="text"
          :label="item.label"
          :disabled="item.disabled"
        >
          <UAvatar
            :alt="(index + 1 ).toString()"
            :ui="{
              background: selected ? 'bg-primary-500 dark:bg-primary-800' : 'bg-primary-100 dark:bg-primary-800',
              icon: { base: selected ? 'text-white ' : 'text-primary-500 dark:text-primary-400' }
            }"
            :icon="item.icon ? item.icon : selectedIndex > index || selected ? 'i-heroicons-check-circle' : 'i-heroicons-information-circle'"
            size="sm"
          />
          {{ item.label }}
        </UButton>

        <span class="before:content-[''] before:z-0 before:border-t before:block before:absolute before:w-full before:top-1/2 before:left-0" />
      </template>
    </UTabs>
  </div>
</template>
