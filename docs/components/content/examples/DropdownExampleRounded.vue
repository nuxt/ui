<script setup>
const items = [
  [{
    label: 'Profile',
    avatar: {
      src: 'https://avatars.githubusercontent.com/u/739984?v=4'
    }
  }]
]

const rounded = ref('lg');
const roundedOptions = ['none', 'sm', 'rounded', 'md', 'lg', 'xl', '2xl', '3xl', 'full'];
</script>

<template>
  <div>
    <UFormGroup name="rounded" label="rounded" class="mb-4">
      <USelect v-model="rounded" :options="roundedOptions" />
    </UFormGroup>

    <UDropdown :items="items" mode="hover" :popper="{ placement: 'bottom-start' }" :rounded="rounded">
      <UButton color="white" label="Options" trailing-icon="i-heroicons-chevron-down-20-solid" />
    </UDropdown>
  </div>
</template>
