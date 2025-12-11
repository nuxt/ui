<script setup lang="ts">
const slots = defineSlots()

const target = useTemplateRef('target')

const tree = inject<Ref<Record<string, Node>>>('tree', ref({}))
const activePath = inject<Ref<string>>('activePath', ref(''))

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

useIntersectionObserver(target, ([entry]) => {
  if (entry?.isIntersecting) {
    for (const child of children.value) {
      tree.value[child.label] = child.component
      activePath.value = child.label
    }
  }
})
</script>

<template>
  <div ref="target">
    <slot />
  </div>
</template>
