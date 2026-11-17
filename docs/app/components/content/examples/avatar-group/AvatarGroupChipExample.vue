<template>
  <UAvatarGroup>
    <UAvatar
      src="https://github.com/benjamincanac.png"
      alt="Benjamin Canac"
      loading="lazy"
      :chip="{ inset: true, color: 'success' }"
    />

    <UAvatar
      src="https://github.com/HugoRCD.png"
      alt="Hugo Richard"
      loading="lazy"
      :chip="{ inset: true, color: 'warning' }"
    />

    <UAvatar
      src="https://github.com/atinux.png"
      alt="Sébastien Chopin"
      loading="lazy"
      :chip="{ inset: true, color: 'error' }"
    />
  </UAvatarGroup>
</template>
