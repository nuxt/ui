<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types/tv'
import theme from '../../theme/prose/img'

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
import { ref, computed, nextTick, useAttrs, useId } from 'vue'
import { DialogRoot, DialogPortal, DialogTrigger } from 'reka-ui'
import { useEventListener, createReusableTemplate } from '@vueuse/core'
import { useRuntimeConfig } from '#imports'
import ImageComponent, { useImage } from '#build/ui-image-component'
import { useComponentProps, useComponentOverrides } from '../../composables/useComponentProps'
import { resolveBaseURL } from '../../utils'
import { tv } from '../../utils/tv'

defineOptions({ inheritAttrs: false })

const _props = withDefaults(defineProps<ProseImgProps>(), {
  zoom: true
})

const props = useComponentProps('prose.img', _props, theme)

const overrides = useComponentOverrides((ui: ProseImg['AppConfig']['ui']) => ui.prose?.img)

const [DefineImageTemplate, ReuseImageTemplate] = createReusableTemplate()
const [DefineZoomedImageTemplate, ReuseZoomedImageTemplate] = createReusableTemplate()

const open = ref(false)

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv(theme, overrides.value)({
  zoom: props.zoom,
  open: open.value,
  width: !!props.width
}))

const attrs = useAttrs()
const image = useImage?.()

const refinedSrc = computed(() => {
  const provider = (attrs.provider as string | undefined) || image?.options.provider
  return provider === 'ipx' || provider === 'ipxStatic' ? props.src : resolveBaseURL(props.src, useRuntimeConfig().app.baseURL)
})

// The name is only set while the zoom transition runs, so the image doesn't take part in page view transitions
const transitionName = `ui-prose-img-${useId().replace(/[^\w-]/g, '')}`
const transitioning = ref(false)

const transitionStyle = computed(() => transitioning.value ? { viewTransitionName: transitionName, viewTransitionClass: 'ui-prose-img' } : undefined)

async function setOpen(value: boolean, animate = true) {
  if (value === open.value) {
    return
  }

  if (!animate || !document.startViewTransition) {
    open.value = value
    return
  }

  // A second click or Escape while the zoom runs would start another transition and clear the name under it
  if (transitioning.value) {
    return
  }

  transitioning.value = true
  await nextTick()

  document.startViewTransition(async () => {
    open.value = value
    await nextTick()
  }).finished.finally(() => {
    transitioning.value = false
  })
}

if (props.zoom) {
  useEventListener(window, 'scroll', () => {
    setOpen(false, false)
  }, { passive: true })

  useEventListener(window, 'keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape' && open.value) {
      setOpen(false)
    }
  })
}
</script>

<template>
  <DefineImageTemplate>
    <component
      :is="ImageComponent"
      :src="refinedSrc"
      :alt="props.alt"
      :width="props.width"
      :height="props.height"
      v-bind="$attrs"
      :style="open ? undefined : transitionStyle"
      :class="ui.base({ class: [props.ui?.base, props.class] })"
    />
  </DefineImageTemplate>

  <DefineZoomedImageTemplate>
    <component
      :is="ImageComponent"
      :src="refinedSrc"
      :alt="props.alt"
      v-bind="$attrs"
      :style="transitionStyle"
      :class="ui.zoomedImage({ class: [props.ui?.zoomedImage] })"
    />
  </DefineZoomedImageTemplate>

  <DialogRoot v-if="props.zoom" v-slot="{ close }" :open="open" :modal="false" @update:open="setOpen">
    <DialogTrigger as-child>
      <ReuseImageTemplate />
    </DialogTrigger>

    <DialogPortal>
      <template v-if="open">
        <div :class="ui.overlay({ class: [props.ui?.overlay] })" />

        <div :class="ui.content({ class: [props.ui?.content] })" @click="close">
          <ReuseZoomedImageTemplate />
        </div>
      </template>
    </DialogPortal>
  </DialogRoot>

  <ReuseImageTemplate v-else />
</template>
