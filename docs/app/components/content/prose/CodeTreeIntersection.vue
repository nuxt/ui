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

function addToTree() {
  for (const child of children.value) {
    tree.value[child.label] = child.component
    activePath.value = child.label
  }
}

onMounted(() => {
  if (props.default) {
    addToTree()
  }
})

useIntersectionObserver(target, ([entry]) => {
  if (entry?.isIntersecting) {
    addToTree()
  }
})
</script>

<template>
  <div v-if="!props.default" ref="target">
    <slot />
  </div>
</template>
