<template>
  <TransitionRoot as="template" :appear="appear" :show="isOpen" @after-leave="onAfterLeave">
    <HDialog :class="[ui.wrapper, { 'justify-end': side === 'right' }]" v-bind="attrs" @close="close">
      <TransitionChild v-if="overlay" as="template" :appear="appear" v-bind="ui.overlay.transition">
        <div :class="[ui.overlay.base, ui.overlay.background]" />
      </TransitionChild>

      <TransitionChild as="template" :appear="appear" v-bind="transitionClass">
        <HDialogPanel
          :class="[ui.base, !resize.enable ? ui.width : ui.resize.width.class, ui.background, ui.ring, ui.padding]"
          :style="resize.enable && { '--width': resizeSlideover?.styleWidth.value }"
        >
          <!-- Avoid any mouse selection behavior. -->
          <div v-if="resize.enable && resizeSlideover.resize.isResizing" :class="shieldClass" style="user-select: none; -webkit-user-select: none;" />

          <div
            v-if="resize.enable"
            :class="[ui.resize.wrapper, side === 'left' ? 'right-0' : 'left-0']"
            @pointerdown="resizeSlideover?.handleResize"
            @click="resizeSlideover?.handleClick"
          >
            <div v-if="!resize.icon" :class="[ui.resize.base]">
              <div :class="defaultIconClassT" />
              <div :class="defaultIconClassB" />
            </div>

            <div v-else class="flex items-center justify-center">
              <UIcon :name="resize.icon" :class="iconClass" aria-hidden="true" />
            </div>
          </div>
          <slot />
        </HDialogPanel>
      </TransitionChild>
    </HDialog>
  </TransitionRoot>
</template>

<script lang="ts">
import { computed, toRef, defineComponent } from 'vue'
import type { WritableComputedRef, PropType, ComputedRef } from 'vue'
import { Dialog as HDialog, DialogPanel as HDialogPanel, TransitionRoot, TransitionChild, provideUseId } from '@headlessui/vue'
import { useUI } from '../../composables/useUI'
import { mergeConfig } from '../../utils'
import type { Strategy, ResizeOptions } from '../../types'
// @ts-expect-error
import appConfig from '#build/app.config'
import { slideover } from '#ui/ui.config'
import { useId } from '#imports'
import { useResizeSlideover } from '../../composables/useSlideover'
import UIcon from '../elements/Icon.vue'
import { twJoin } from 'tailwind-merge'
import { merge } from 'lodash'

const config = mergeConfig<typeof slideover>(appConfig.ui.strategy, appConfig.ui.slideover, slideover)

export default defineComponent({
  components: {
    HDialog,
    HDialogPanel,
    TransitionRoot,
    TransitionChild,
    UIcon
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
      type: String as PropType<'left' | 'right'>,
      default: 'right',
      validator: (value: string) => ['left', 'right'].includes(value)
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
      type: Object as PropType<Partial<typeof config> & { strategy?: Strategy }>,
      default: () => ({})
    },
    resize: {
      type: Object as PropType<ResizeOptions>,
      default: () => ({})
    }
  },
  emits: ['update:modelValue', 'close', 'close-prevented', 'after-leave'],
  setup (props, { emit }) {
    const { ui, attrs } = useUI('slideover', toRef(props, 'ui'), config, toRef(props, 'class'))

    const isOpen: WritableComputedRef<boolean> = computed({
      get () {
        return props.modelValue
      },
      set (value) {
        emit('update:modelValue', value)
      }
    })

    const transitionClass = computed(() => {
      if (!props.transition) {
        return {}
      }

      return {
        ...ui.value.transition,
        enterFrom: props.side === 'left' ? ui.value.translate.left : ui.value.translate.right,
        enterTo: ui.value.translate.base,
        leaveFrom: ui.value.translate.base,
        leaveTo: props.side === 'left' ? ui.value.translate.left : ui.value.translate.right
      }
    })

    function close (value: boolean) {
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

    const mergedProps: ComputedRef<ResizeOptions> = computed(() => {
      const defaultResize = {
        enable: false,
        width: ui.value.default.resize.width,
        duration: 300,
        transition: [0.75, 0, 0.25, 1],
        percentage: 19 / 20,
        icon: null,
        size: ui.value.default.resize.size
      }
      return merge({}, defaultResize, props.resize)
    })

    const iconClass = computed(() => {
      if (!mergedProps.value.enable) return
      return twJoin(
        ui.value.resize.icon.base,
        ui.value.resize.icon.size[mergedProps.value.size]
      )
    })

    const defaultIconClassT: ComputedRef<string[]> = computed(() => {
      if (!mergedProps.value.enable) return
      return [
        ui.value.resize.icon.defaultIconBase,
        resizeSlideover?.rotateTarget.value > 0 && ui.value.resize.icon.defaultIconRotatePos,
        resizeSlideover?.rotateTarget.value < 0 && ui.value.resize.icon.defaultIconRotateNeg,
        'translate-y-[0.15rem]'
      ]
    })

    const defaultIconClassB: ComputedRef<string[]> = computed(() => {
      if (!mergedProps.value.enable) return
      return [
        ui.value.resize.icon.defaultIconBase,
        resizeSlideover?.rotateTarget.value > 0 && ui.value.resize.icon.defaultIconRotateNeg,
        resizeSlideover?.rotateTarget.value < 0 && ui.value.resize.icon.defaultIconRotatePos,
        'translate-y-[-0.15rem]'
      ]
    })

    const shieldClass: ComputedRef<string[]> = computed(() => {
      if (!mergedProps.value.enable) return
      return [
        ui.value.resize.shield,
        props.side === 'right' ? 'left-4' : 'right-4'
      ]
    })

    const resizeSlideover = useResizeSlideover({
      _enable: mergedProps.value.enable,
      _width: ui.value.resize.width.init[mergedProps.value.width],
      _duration: mergedProps.value.duration,
      _transition: mergedProps.value.transition,
      _percentage: mergedProps.value.percentage,
      _side: toRef(() => props.side),
      transitionP: toRef(() => props.transition)
    })

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      attrs,
      isOpen,
      transitionClass,
      iconClass,
      defaultIconClassT,
      defaultIconClassB,
      shieldClass,
      onAfterLeave,
      close,
      resizeSlideover
    }
  }
})
</script>
