<template>
  <ThemeStudioButton>
    <template #default="{ dirty }">
      <UButton
        :label="dirty ? 'Edit your theme' : 'Customize'"
        icon="i-lucide-paintbrush"
        color="neutral"
        variant="outline"
      />
    </template>
  </ThemeStudioButton>
</template>
