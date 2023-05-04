<template>
  <NuxtLink
    v-slot="{ href, navigate, exact, isActive, isExactActive }"
    custom
  >
    <a
      v-bind="$attrs"
      :href="href"
      :class="resolveLinkClass({ isActive, isExactActive })"
      @click="navigate"
    >
      <slot v-bind="{ isActive: exact ? isExactActive : isActive }" />
    </a>
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps({
  activeClass: {
    type: String,
    default: ''
  },
  inactiveClass: {
    type: String,
    default: ''
  }
})

function resolveLinkClass ({ isActive, isExactActive }: { isActive: boolean, isExactActive: boolean }) {
  if (isActive || isExactActive) {
    return props.activeClass
  }

  return props.inactiveClass
}
</script>
