<template>
  <ol :class="[ui.base]">
    <li
      v-for="(item, index) of items"
      :key="index"
      ref="itemRefs"
      :class="[ui.list.base]"
    >
      <div
        v-if="displayDivider"
        :class="[index > 0 ? 'visible' : 'invisible', ui.list.step.divider]"
      />
      <UButton
        color="white"
        variant="ghost"
        :disabled="item.disabled"
        :class="[
          ui.list.step.base,
          ui.list.step.background,
          ui.list.step.padding,
          ui.list.step.size,
          ui.list.step.font,
          selectedIndex === index ? ui.list.step.active : ui.list.step.inactive
        ]"
        @click="onChange(index)"
      >
        <div :class="[ui.list.step.leading.wrapper]">
          <UIcon
            v-if="(selectedIndex > index && completedIcon)"
            :name="completedIcon"
            :class="[ui.list.step.leading.icon]"
          />
          <UIcon
            v-else-if="(selectedIndex === index && activeIcon)"
            :name="activeIcon"
            :class="[ui.list.step.leading.icon]"
          />
          <UIcon
            v-else-if="(selectedIndex < index && pendingIcon)"
            :name="pendingIcon"
            :class="[ui.list.step.leading.icon]"
          />
          <UAvatar
            v-else
            :alt="(index + 1).toString()"
            :size="ui.list.step.leading.size"
          />
        </div>
        {{ item?.label }}
      </UButton>
      <div
        v-if="displayDivider"
        :class="[index + 1 < items.length ? 'visible' : 'invisible', ui.list.step.divider]"
      />
    </li>
  </ol>
</template>

<script lang="ts">
import type { StepItem } from '../../types/stepper'
import { defuTwMerge } from '../../utils'
// TODO: Remove
// @ts-expect-error
import appConfig from '#build/app.config'

// const appConfig = useAppConfig()

export default defineComponent({
  inheritAttrs: false,
  props: {
    modelValue: {
      type: Number,
      default: undefined
    },
    defaultIndex: {
      type: Number,
      default: 0
    },
    items: {
      type: Array as PropType<StepItem[]>,
      default: () => []
    },
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.stepper>>,
      default: () => ({})
    },
    completedIcon: {
      type: String,
      default: null
    },
    activeIcon: {
      type: String,
      default: null
    },
    pendingIcon: {
      type: String,
      default: null
    },
    displayDivider: {
      type: Boolean,
      default: true
    }
  },
  emits: ['update:modelValue', 'change'],
  setup (props, { emit }) {
    // TODO: Remove
    const appConfig = useAppConfig()

    const ui = computed<Partial<typeof appConfig.ui.stepper>>(() => defuTwMerge({}, props.ui, appConfig.ui.stepper))

    const selectedIndex = ref(props.modelValue || props.defaultIndex)

    function onChange (index: number) {
      selectedIndex.value = index

      emit('change', index)

      if (props.modelValue !== undefined) {
        emit('update:modelValue', index)
      }
    }

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      selectedIndex,
      onChange
    }
  }
})
</script>