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

    <template #overflow="{ hiddenCount }">
      <UTooltip :text="`${hiddenCount} more teammate${hiddenCount === 1 ? '' : 's'}`">
        <UAvatar :text="`+${hiddenCount}`" />
      </UTooltip>
    </template>
  </UAvatarGroup>
</template>
