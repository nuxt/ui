<script setup lang="ts">
const getOverflowTooltip = (hiddenCount: number) => `${hiddenCount} more teammates`
</script>

<template>
  <UAvatarGroup :max="2">
    <UAvatar
      src="https://github.com/benjamincanac.png"
      alt="Benjamin Canac"
      loading="lazy"
    />

    <UAvatar
      src="https://github.com/romhml.png"
      alt="Romain Hamel"
      loading="lazy"
    />

    <UAvatar
      src="https://github.com/noook.png"
      alt="Neil Richter"
      loading="lazy"
    />

    <template #overflow="{ hiddenCount, avatarProps }">
      <UTooltip :text="getOverflowTooltip(hiddenCount)">
        <UAvatar v-bind="avatarProps" />
      </UTooltip>
    </template>
  </UAvatarGroup>
</template>
