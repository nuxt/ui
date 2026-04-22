<template>
  <UAvatarGroup>
    <UAvatar
      src="https://github.com/benjamincanac.png"
      alt="Benjamin Canac"
      loading="lazy"
      :chip="{ inset: true, color: 'success' }"
    />

    <UAvatar
      src="https://github.com/romhml.png"
      alt="Romain Hamel"
      loading="lazy"
      :chip="{ inset: true, color: 'warning' }"
    />

    <UAvatar
      src="https://github.com/noook.png"
      alt="Neil Richter"
      loading="lazy"
      :chip="{ inset: true, color: 'error' }"
    />
  </UAvatarGroup>
</template>
