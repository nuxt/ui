import { computed, ref, provide, inject, onMounted, onUnmounted, getCurrentInstance } from 'vue'
import type { Ref, ComponentInternalInstance } from 'vue'
import { button, buttonGroup } from '#ui/ui.config'

type ButtonGroupProps = {
  orientation?: 'horizontal' | 'vertical'
  size?: string
  ui?: Partial<typeof buttonGroup>
  rounded?: { start: string, end: string }
}

// make a ButtonGroupContext type for injection. Should include ButtonGroupProps
type ButtonGroupContext = ButtonGroupProps & {
  children: ComponentInternalInstance[]
  register(child: ComponentInternalInstance): void
  unregister(child: ComponentInternalInstance): void
  rounded: { start: string, end: string }
}

export function useProvideButtonGroup(buttonGroupProps: ButtonGroupProps) {
  const instance = getCurrentInstance()
  const groupKey = `group-${instance.uid}`
  const state = ref({
    children: [],
    register(child) {
      this.children.push(child)
    },
    unregister(child) {
      const index = this.children.indexOf(child)
      if (index > -1) {
        this.children.splice(index, 1)
      }
    },
    rounded: buttonGroup.rounded,
    ...buttonGroupProps
  })
  provide(groupKey, state as Ref<ButtonGroupContext>)
}

export function useInjectButtonGroup({ ui, props }: { ui: any, props: any }) {
  const instance = getCurrentInstance()

  let parent = instance.parent
  let groupContext: Ref<ButtonGroupContext> | undefined

  // Traverse up the parent chain to find the nearest ButtonGroup
  while (parent && !groupContext) {
    if (parent.type.name === 'ButtonGroup') {
      groupContext = inject(`group-${parent.uid}`)
      break;
    }
    parent = parent.parent;
  }

  const positionInGroup = computed(() => {
    return groupContext?.value.children.indexOf(instance)
  })
  onMounted(() => {
    groupContext?.value.register(instance)
  })
  onUnmounted(() => {
    groupContext?.value.unregister(instance)
  })
  return {
    size: computed(() => groupContext?.value.size || props.size),
    rounded: computed(() => {
      if (!groupContext) return ui.value.rounded
      if (groupContext.value.children.length === 1) {
        return groupContext.value.ui.rounded
      } else if (positionInGroup.value === 0 || positionInGroup.value === -1) {
        return groupContext.value.rounded.start
      } else if (positionInGroup.value === groupContext.value.children.length - 1) {
        return groupContext.value.rounded.end
      } else {
        return 'rounded-none'
      }
    })
  }
}
