<template>
  <UProgress class="progress">
    <template #indicator>
      <div class="text-right text-amber-500">
        🔥 This is too hot!
      </div>
    </template>
  </UProgress>
</template>

<style scoped>
.progress:deep(progress:indeterminate.animation-default) {
  &:after {
    @apply w-full text-red-500;
    animation: my-glow-animation 3s ease-in-out infinite;
  }

  &::-webkit-progress-value {
    @apply w-full text-red-500;
    animation: my-glow-animation 3s ease-in-out infinite;
  }

  &::-moz-progress-bar {
    @apply w-full text-red-500;
    animation: my-glow-animation 3s ease-in-out infinite;
  }
}

@keyframes my-glow-animation {
  50% {
    @apply text-amber-400;
  }
}
</style>
