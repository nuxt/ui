<template>
  <UAlert title="Customize Alert Icon" description="Insert custom content into the icon slot!" icon="i-heroicons-command-line">
    <template #icon="{ icon }">
      <UBadge size="sm">
        <UIcon :name="icon" />
      </UBadge>
    </template>
  </UAlert>
</template>
