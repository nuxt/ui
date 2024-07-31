<template>
  <UCollapsible class="w-48 mx-auto">
    <UButton
      class="group"
      label="Open"
      color="gray"
      variant="subtle"
      trailing-icon="i-heroicons-chevron-down-20-solid"
      :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
      block
    />

    <template #content>
      <Placeholder class="h-48" />
    </template>
  </UCollapsible>
</template>
