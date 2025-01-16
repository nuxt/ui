<template>
  <TransitionRoot as="template" :appear="appear" :show="isOpen" @after-leave="onAfterLeave">
    <HDialog :class="[ui.wrapper, { 'justify-end': side === 'right' }, { 'items-end': side === 'bottom' }]" v-bind="attrs" @close="close">
      <TransitionChild v-if="overlay" as="template" :appear="appear" v-bind="ui.overlay.transition" :class="ui.overlay.transition.enterFrom">
        <div :class="[ui.overlay.base, ui.overlay.background]" />
      </TransitionChild>

      <TransitionChild as="template" :appear="appear" v-bind="transitionClass" :class="transitionClass.enterFrom">
        <HDialogPanel :class="[ui.base, sideType === 'horizontal' ? [ui.width, 'h-full'] : [ui.height, 'w-full'], ui.background, ui.ring, ui.rounded, ui.padding, ui.shadow]">
          <slot />
        </HDialogPanel>
      </TransitionChild>
    </HDialog>
  </TransitionRoot>
</template>

<script lang="ts">
import { computed, toRef, defineComponent } from 'vue'
import type { WritableComputedRef, PropType } from 'vue'
import { Dialog as HDialog, DialogPanel as HDialogPanel, TransitionRoot, TransitionChild, provideUseId } from '@headlessui/vue'
import { useUI } from '../../composables/useUI'
import { mergeConfig } from '../../utils'
import type { DeepPartial, Strategy } from '../../types/index'
// @ts-expect-error
import appConfig from '#build/app.config'
import { slideover } from '#ui/ui.config'
import { useId } from '#imports'

const config = mergeConfig<typeof slideover>(appConfig.ui.strategy, appConfig.ui.slideover, slideover)

export default defineComponent({
  components: {
    HDialog,
    HDialogPanel,
    TransitionRoot,
    TransitionChild
  },
  inheritAttrs: false,
  props: {
    modelValue: {
      type: Boolean as PropType<boolean>,
      default: false
    },
    appear: {
      type: Boolean,
      default: false
    },
    side: {
      type: String as PropType<'left' | 'right' | 'top' | 'bottom'>,
      default: 'right',
      validator: (value: string) => ['left', 'right', 'top', 'bottom'].includes(value)
    },
    overlay: {
      type: Boolean,
      default: true
    },
    transition: {
      type: Boolean,
      default: true
    },
    preventClose: {
      type: Boolean,
      default: false
    },
    class: {
      type: [String, Object, Array] as PropType<any>,
      default: () => ''
    },
    ui: {
      type: Object as PropType<DeepPartial<typeof config> & { strategy?: Strategy }>,
      default: () => ({})
    }
  },
  emits: ['update:modelValue', 'close', 'close-prevented', 'after-leave'],
  setup(props, { emit }) {
    const { ui, attrs } = useUI('slideover', toRef(props, 'ui'), config, toRef(props, 'class'))

    const isOpen: WritableComputedRef<boolean> = computed({
      get() {
        return props.modelValue
      },
      set(value) {
        emit('update:modelValue', value)
      }
    })

    const transitionClass = computed(() => {
      if (!props.transition) {
        return {} as typeof ui.value.transition & {
          enterFrom: string
          enterTo: string
          leaveFrom: string
          leaveTo: string
        }
      }

      let enterFrom, leaveTo
      switch (props.side) {
        case 'left':
          enterFrom = ui.value.translate.left
          leaveTo = ui.value.translate.left
          break
        case 'right':
          enterFrom = ui.value.translate.right
          leaveTo = ui.value.translate.right
          break
        case 'top':
          enterFrom = ui.value.translate.top
          leaveTo = ui.value.translate.top
          break
        case 'bottom':
          enterFrom = ui.value.translate.bottom
          leaveTo = ui.value.translate.bottom
          break
        default:
          enterFrom = ui.value.translate.right
          leaveTo = ui.value.translate.right
      }

      return {
        ...ui.value.transition,
        enterFrom,
        enterTo: ui.value.translate.base,
        leaveFrom: ui.value.translate.base,
        leaveTo
      }
    })

    const sideType = computed(() => {
      switch (props.side) {
        case 'left':
          return 'horizontal'
        case 'right':
          return 'horizontal'
        case 'top':
          return 'vertical'
        case 'bottom':
          return 'vertical'
        default:
          return 'right'
      }
    })

    function close(value: boolean) {
      if (props.preventClose) {
        emit('close-prevented')

        return
      }

      isOpen.value = value
      emit('close')
    }

    const onAfterLeave = () => {
      emit('after-leave')
    }

    provideUseId(() => useId())

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      attrs,
      isOpen,
      transitionClass,
      sideType,
      onAfterLeave,
      close
    }
  }
})
</script>
