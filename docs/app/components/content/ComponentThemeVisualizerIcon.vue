<script setup lang="ts">
withDefaults(defineProps<{
  size?: number
  open?: boolean
}>(), {
  size: 16,
  open: false
})
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    :data-open="open || undefined"
  >
    <!-- X icon (two lines) -->
    <line
      x1="4"
      y1="12"
      x2="20"
      y2="12"
    />
    <line
      x1="4"
      y1="12"
      x2="20"
      y2="12"
    />

    <!-- Eye shape (with blink) -->
    <path
      d="M2.062 12.348a1 1 0 0 1 0-.696a10.75 10.75 0 0 1 19.876 0a1 1 0 0 1 0 .696a10.75 10.75 0 0 1-19.876 0"
      fill="none"
    />

    <!-- Pupil -->
    <circle
      cx="12"
      cy="12"
      r="3"
      fill="none"
    />
  </svg>
</template>

<style scoped>
line,
path,
circle {
  transform-box: fill-box;
  transform-origin: center;
}

/* Closed: the X lines shrink away while the eye and pupil come back, then blink every 3s. */
line {
  scale: 0;
  opacity: 0;
  transition: rotate 0.2s ease-in, scale 0.2s ease-in, opacity 0.2s ease-in;
}

path,
circle {
  transition: scale 0.25s ease-out 0.1s, opacity 0.2s ease-out 0.1s;
}

/* The blink runs on `transform`, so it stacks on the `scale` the transitions move. */
path {
  animation: eye-blink 3s ease-in-out 0.5s infinite;
}

circle {
  animation: pupil-blink 3s ease-in-out 0.5s infinite;
}

/* Open: the eye and pupil shrink away and the lines turn into an X. */
[data-open] line {
  scale: 1;
  opacity: 1;
  transition: rotate 0.25s ease-out, scale 0.25s ease-out, opacity 0.25s ease-out;
}

[data-open] line:first-of-type {
  rotate: 45deg;
}

[data-open] line:last-of-type {
  rotate: -45deg;
}

[data-open] path,
[data-open] circle {
  scale: 0;
  opacity: 0;
  animation: none;
  transition: scale 0.15s ease-in, opacity 0.15s ease-in;
}

@keyframes eye-blink {
  0%, 45%, 55%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(0.1); }
}

@keyframes pupil-blink {
  0%, 45%, 55%, 100% { transform: scale(1); }
  50% { transform: scale(0); }
}

@media (prefers-reduced-motion: reduce) {
  path,
  circle {
    animation: none;
  }
}
</style>
