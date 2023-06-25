<script setup>
const items = ref([
  {
    title: 'Getting Started',
    leadingIcon: 'i-heroicons-information-circle',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
  },
  {
    title: 'Installation',
    leadingIcon: 'i-heroicons-arrow-down-tray',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
  },
  {
    title: 'Theming',
    leadingIcon: 'i-heroicons-eye-dropper',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
  },
  {
    title: 'Components',
    leadingIcon: 'i-heroicons-square-3-stack-3d',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
  },
  {
    title: 'Utilities',
    leadingIcon: 'i-heroicons-wrench-screwdriver',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
  }
])
</script>

<template>
  <UAccordion :items="items">
    <template #button="{ title, index, leadingIcon, isOpen }">
      <div class="flex justify-start items-center border-b w-full pt-1 pb-3">
        <span
          class="bg-primary-200 rounded-full text-primary-800 p-[8px] mr-4 flex justify-center"
        >
          <UIcon v-if="leadingIcon" :name="leadingIcon" class="w-5 h-5" />
        </span>
        <div class="flex justify-between items-center w-full">
          <div>{{ index + 1 }}. {{ title }}</div>
          <div>
            <UIcon :name="isOpen ? 'i-heroicons-minus' : 'i-heroicons-plus'" />
          </div>
        </div>
      </div>
    </template>
  </UAccordion>
</template>
