<script setup lang="ts">
const props = defineProps<{
  open: boolean
}>()

// UHeader renders a second toggle in its menu overlay, mounted already open. Draw it closed for its
// first frame so the lines transition into the cross instead of appearing as one.
const ready = ref(false)
onMounted(() => requestAnimationFrame(() => requestAnimationFrame(() => {
  ready.value = true
})))
const crossed = computed(() => props.open && ready.value)

// Each line turns around its own center; the overshoot approximates the spring the toggle used to have.
const line = 'origin-center [transform-box:fill-box] transition-[translate,rotate,opacity] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none'
</script>

<template>
  <UButton
    size="sm"
    variant="ghost"
    color="neutral"
    square
    :aria-label="open ? 'Close menu' : 'Open menu'"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="size-(--ui-control-icon-size)"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <line
        x1="4"
        y1="6"
        x2="20"
        y2="6"
        :class="[line, crossed && 'translate-y-1.5 rotate-45']"
      />
      <line
        x1="4"
        y1="12"
        x2="20"
        y2="12"
        :class="[line, crossed && 'opacity-0']"
      />
      <line
        x1="4"
        y1="18"
        x2="20"
        y2="18"
        :class="[line, crossed && '-translate-y-1.5 -rotate-45']"
      />
    </svg>
  </UButton>
</template>
