<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const collapsed = ref(true)
const wrapper = ref<HTMLElement | null>(null)
const content = ref<HTMLElement | null>(null)

const overflow = computed(() => {
  if (!content.value || !wrapper.value) return false
  return content.value.scrollHeight > 48 * 4
})

onMounted(() => {
  if (wrapper.value) {
    wrapper.value.style.transition = 'max-height 0.3s ease' // Set transition for max-height
  }
})
</script>

<template>
  <div class="border rounded-[var(--ui-radius)] border-[var(--ui-border)]">
    <div
      ref="wrapper"
      :class="['overflow-hidden', collapsed && overflow ? 'max-h-48' : 'max-h-none']"
    >
      <div ref="content">
        <slot />
      </div>
    </div>
    <UButton
      v-if="overflow"
      class="bg-[var(--ui-bg)] group w-full flex justify-center my-1 border-t border-[var(--ui-border)] rounded-t-none"
      variant="link"
      color="neutral"
      trailing-icon="i-lucide-chevron-down"
      :data-state="collapsed ? 'closed' : 'open'"
      :ui="{ trailingIcon: 'transition group-data-[state=open]:rotate-180' }"
      @click="collapsed = !collapsed"
    >
      {{ collapsed ? 'Expand' : 'Collapse' }}
    </UButton>
  </div>
</template>
