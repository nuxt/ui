<script setup lang="ts">
const slots = defineSlots()

const target = useTemplateRef('target')

const tree = inject<Ref<Record<string, Node>>>('tree', ref({}))

const children = computed(() => slots.default?.().map(transformSlot))

function transformSlot(slot: any, index: number) {
  if (typeof slot.type === 'symbol') {
    return slot.children?.map(transformSlot)
  }

  return {
    label: slot.props?.filename || slot.props?.label || `${index}`,
    icon: slot.props?.icon,
    component: slot
  }
}

const { stop } = useIntersectionObserver(
  target,
  ([entry]) => {
    if (entry?.isIntersecting) {
      for (const child of children.value) {
        tree.value[child.label] = child.component
      }
      stop()
    }
  }
)
</script>

<template>
  <div ref="target">
    <slot />
  </div>
</template>
