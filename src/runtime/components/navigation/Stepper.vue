<template>
  <ol
    :class="wrapperClass"
    v-bind="attrs"
  >
    <li
      v-for="(item, index) of items"
      :key="index"
      ref="itemRefs"
      :class="[ui.base]"
    >
      <div
        v-if="displayDivider"
        :class="[index > 0 ? 'visible' : 'invisible', ui.step.divider]"
      />
      <UButton
        color="white"
        variant="ghost"
        :disabled="item.disabled"
        :class="[
          ui.step.base,
          ui.step.background,
          ui.step.padding,
          ui.step.size,
          ui.step.font,
          selectedIndex === index ? ui.step.active : ui.step.inactive,
        ]"
        @click="onChange(index)"
        :to="item.to"
      >
        <div :class="[ui.step.leading.wrapper]">
          <UIcon
            v-if="(selectedIndex > index && completedIcon)"
            :name="completedIcon"
            :class="[ui.step.leading.icon]"
          />
          <UIcon
            v-else-if="(selectedIndex === index && activeIcon)"
            :name="activeIcon"
            :class="[ui.step.leading.icon]"
          />
          <UIcon
            v-else-if="(selectedIndex < index && pendingIcon)"
            :name="pendingIcon"
            :class="[ui.step.leading.icon]"
          />
          <UAvatar
            v-else
            :alt="(index + 1).toString()"
            :size="ui.step.leading.size"
          />
        </div>
        {{ item?.label }}
      </UButton>
      <div
        v-if="displayDivider"
        :class="[index + 1 < items.length ? 'visible' : 'invisible', ui.step.divider]"
      />
    </li>
  </ol>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import type { PropType } from 'vue'
import UIcon from '../elements/Icon.vue'
import UAvatar from '../elements/Avatar.vue'
import UButton from '../elements/Button.vue'
import { omit } from 'lodash-es'
import { twMerge } from 'tailwind-merge'
import { defuTwMerge } from '../../utils'
import type { StepperItem } from '../../types/stepper'
// TODO: Remove
// @ts-expect-error
import appConfig from '#build/app.config'

// const appConfig = useAppConfig()

export default defineComponent({
  components: {
    UIcon,
    UAvatar,
    UButton
  },
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
      type: Array as PropType<StepperItem[]>,
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
  setup (props, { attrs, emit }) {
    // TODO: Remove
    const appConfig = useAppConfig()

    const ui = computed<Partial<typeof appConfig.ui.stepper>>(() => defuTwMerge({}, props.ui, appConfig.ui.stepper))

    const selectedIndex = ref(props.modelValue || props.defaultIndex)

    const wrapperClass = computed(() => twMerge(ui.value.wrapper, attrs.class as string))

    // Methods

    function onChange (index: number) {
      selectedIndex.value = index

      emit('change', index)

      if (props.modelValue !== undefined) {
        emit('update:modelValue', index)
      }
    }

    return {
      attrs: computed(() => omit(attrs, ['class'])),
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      selectedIndex,
      onChange,
      wrapperClass
    }
  }
})
</script>