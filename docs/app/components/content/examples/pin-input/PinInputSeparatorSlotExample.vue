<template>
  <UPinInput :length="6" :separator="3" placeholder="○">
    <template #separator>
      <UIcon name="i-lucide-minus" class="size-4" />
    </template>
  </UPinInput>
</template>
