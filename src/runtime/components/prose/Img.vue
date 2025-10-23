<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types/tv'
import theme from '#build/ui/prose/img'

type ProseImg = ComponentConfig<typeof theme, AppConfig, 'img', 'ui.prose'>

export interface ProseImgProps {
  src: string
  alt: string
  width?: string | number
  height?: string | number
  class?: any
  /**
   * Zoom image on click
   * @defaultValue true
   */
  zoom?: boolean
  ui?: ProseImg['slots']
}
</script>

<script setup lang="ts">
import { ref, computed, useId } from 'vue'
import { withTrailingSlash, withLeadingSlash, joinURL } from 'ufo'
import { DialogRoot, DialogPortal, DialogTrigger } from 'reka-ui'
import { AnimatePresence, Motion } from 'motion-v'
import { useEventListener, createReusableTemplate } from '@vueuse/core'
import { useRuntimeConfig, useAppConfig } from '#imports'
import ImageComponent from '#build/ui-image-component'
import { tv } from '../../utils/tv'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<ProseImgProps>(), {
  zoom: true
})

const appConfig = useAppConfig() as ProseImg['AppConfig']

const [DefineImageTemplate, ReuseImageTemplate] = createReusableTemplate()
const [DefineZoomedImageTemplate, ReuseZoomedImageTemplate] = createReusableTemplate()

const open = ref(false)

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.img || {}) })({
  zoom: props.zoom,
  open: open.value
}))

const refinedSrc = computed(() => {
  if (props.src?.startsWith('/') && !props.src.startsWith('//')) {
    const _base = withLeadingSlash(withTrailingSlash(useRuntimeConfig().app.baseURL))
    if (_base !== '/' && !props.src.startsWith(_base)) {
      return joinURL(_base, props.src)
    }
  }
  return props.src
})

const layoutId = computed(() => `${refinedSrc.value}::${useId()}`)

if (props.zoom) {
  useEventListener(window, 'scroll', () => {
    open.value = false
  })
}
</script>

<template>
  <DefineImageTemplate>
    <component
      :is="ImageComponent"
      :src="refinedSrc"
      :alt="alt"
      :width="width"
      :height="height"
      v-bind="$attrs"
      :class="ui.base({ class: [props.ui?.base, props.class] })"
    />
  </DefineImageTemplate>

  <DefineZoomedImageTemplate>
    <component
      :is="ImageComponent"
      :src="refinedSrc"
      :alt="alt"
      v-bind="$attrs"
      :class="ui.zoomedImage({ class: [props.ui?.zoomedImage] })"
    />
  </DefineZoomedImageTemplate>

  <DialogRoot v-if="zoom" v-slot="{ close }" v-model:open="open" :modal="false">
    <DialogTrigger as-child>
      <Motion :layout-id="layoutId" as-child :transition="{ type: 'spring', bounce: 0.15, duration: 0.5, ease: 'easeInOut' }">
        <ReuseImageTemplate />
      </Motion>
    </DialogTrigger>

    <DialogPortal>
      <AnimatePresence>
        <Motion v-if="open" :initial="{ opacity: 0 }" :animate="{ opacity: 1 }" :exit="{ opacity: 0 }" :class="ui.overlay({ class: [props.ui?.overlay] })" />

        <div v-if="open" :class="ui.content({ class: [props.ui?.content] })" @click="close">
          <Motion as-child :layout-id="layoutId" :transition="{ type: 'spring', bounce: 0.15, duration: 0.5, ease: 'easeInOut' }">
            <ReuseZoomedImageTemplate />
          </Motion>
        </div>
      </AnimatePresence>
    </DialogPortal>
  </DialogRoot>

  <ReuseImageTemplate v-else />
</template>
