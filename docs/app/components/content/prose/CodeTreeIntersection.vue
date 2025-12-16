<script setup lang="ts">
const props = defineProps<{
  /**
   * Add files to the tree immediately on mount instead of waiting for intersection.
   * Useful for showing starter/base files at the beginning.
   */
  default?: boolean
}>()

const slots = defineSlots()

const target = useTemplateRef('target')

const tree = inject<Ref<Record<string, Node>>>('tree', ref({}))
const activePath = inject<Ref<string>>('activePath', ref(''))

const children = computed(() => slots.default?.().map(transformSlot).filter(Boolean))

function findCodeBlock(slot: any): any {
  // If this slot has filename/label, it's a code block
  if (slot.props?.filename || slot.props?.label) {
    return slot
  }

  // Check children (for CodeCollapse wrapper)
  if (slot.children?.default) {
    const defaultSlot = slot.children.default()
    for (const child of defaultSlot) {
      const found = findCodeBlock(child)
      if (found) return found
    }
  }

  return null
}

function transformSlot(slot: any, index: number) {
  if (typeof slot.type === 'symbol') {
    return slot.children?.map(transformSlot)
  }

  // Try to find the code block (handles CodeCollapse wrapper)
  const codeBlock = findCodeBlock(slot)

  // Skip if no code block found
  if (!codeBlock) {
    return null
  }

  return {
    label: codeBlock.props?.filename || codeBlock.props?.label || `${index}`,
    icon: codeBlock.props?.icon,
    component: codeBlock
  }
}

function addToTree() {
  for (const child of children.value) {
    tree.value[child.label] = child.component
    activePath.value = child.label
  }
}

onMounted(() => {
  if (props.default) {
    addToTree()
    return
  }

  // If element is already above or in the top 50% of the viewport (e.g., page refresh in the middle), add it to the tree immediately
  const rect = target.value?.getBoundingClientRect()
  if (rect && rect.top < window.innerHeight * 0.5) {
    addToTree()
  }
})

useIntersectionObserver(target, ([entry]) => {
  if (entry?.isIntersecting) {
    addToTree()
  }
}, {
  rootMargin: '-200px 0px -50% 0px'
})
</script>

<template>
  <div v-if="!props.default" ref="target">
    <slot />
  </div>
</template>
