<template>
  <UContainer class="min-h-screen flex items-center">

      <UButtonGroup rounded="full">
        <UButton icon="i-heroicons-academic-cap-solid" color="white" />
        <UButton icon="i-heroicons-academic-cap-solid" color="white" />
        <UDropdown
          :items="[
            [
              {
                label: 'Edit',
                icon: 'i-heroicons-academic-cap-solid',
              },
              {
                label: 'Remove',
                icon: 'i-heroicons-academic-cap-solid',
              },
            ],
          ]"
          :popper="{ placement: 'bottom-start' }"
        >
          <UButton icon="i-heroicons-adjustments-horizontal-solid" color="white" />
        </UDropdown>
        <!-- <USelectMenu v-model="selected" :options="people" /> -->
        <!-- <UButton icon="i-heroicons-academic-cap-solid" color="white" /> -->
      </UButtonGroup>

      <br/>

      <div class="flex [&>*:first-child_button]:rounded-s-md [&>*:first-child_input]:rounded-s-md [&>*:first-child:not(.popper)]:rounded-s-md [&_:not(.popper)]:rounded-none [&>*:last-child_button]:rounded-e-md [&>*:last-child:not(.popper)]:rounded-e-md">
        <UInput />
        <UButton icon="i-heroicons-clipboard-document" color="gray" />
      </div>
  </UContainer>
</template>

<script setup>
const people = ['Wade Cooper', 'Arlene Mccoy', 'Devon Webb', 'Tom Cook', 'Tanya Fox', 'Hellen Schmidt', 'Caroline Schultz', 'Mason Heaney', 'Claudie Smitham', 'Emil Schaefer']

const selected = ref(people[0])
</script>

<style>
body {
  @apply antialiased font-sans text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900;
}
</style>
