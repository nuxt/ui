<script setup>
const items = [{
  label: 'Basic Information',
  content: 'This is the content shown for Basic Information'
}, {
  label: 'Upload Documents',
  disabled: true,
  content: 'And, this is the content for Upload Documents'
}, {
  label: 'Review & Submit',
  content: 'Finally, this is the content for Review & Submit'
}]

const selectedIndex = ref(0)
</script>

<template>
  <div class="w-full">
    <UTabs
      v-model="selectedIndex"
      :items="items"
      class="w-full"
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
              placeholder: selected ? 'text-white ' : 'text-primary-500 dark:text-primary-400',
            }"
            size="sm"
          />
          {{ item.label }}
        </UButton>

        <span class="before:content-[''] before:z-0 before:border-t before:block before:absolute before:w-full before:top-1/2 before:left-0" />
      </template>
    </UTabs>
  </div>
</template>
