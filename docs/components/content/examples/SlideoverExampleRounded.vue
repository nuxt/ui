<script setup>
const isOpen = ref(false)
const rounded = ref('lg');
const roundedOptions = ['none', 'sm', 'rounded', 'md', 'lg', 'xl', '2xl', '3xl', 'full'];
</script>

<template>
  <div>
    <UFormGroup name="rounded" label="rounded" class="mb-4">
      <USelect v-model="rounded" :options="roundedOptions" />
    </UFormGroup>

    <UButton label="Open" @click="isOpen = true" />

    <USlideover v-model="isOpen" :rounded="rounded">
      <div class="p-4 sm:p-6 flex flex-col flex-1 gap-4 sm:gap-6">
        <div class="flex items-center justify-between">
          <h2 class="font-semibold text-gray-900 dark:text-white">
            Title
          </h2>

          <UButton
            icon="i-heroicons-x-mark-20-solid"
            color="gray"
            variant="link"
            size="md"
            :padded="false"
            @click="isOpen = false"
          />
        </div>

        <Placeholder class="flex-1 w-full" />
      </div>
    </USlideover>
  </div>
</template>
