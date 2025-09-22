<template>
  <div
    :class="ui.root({
      class: [props.ui?.root, props.class]
    })"
    :style="{
      '--qrcode-pixel-size': props.pixelSize,
      '--qrcode-width': width,
      '--qrcode-height': height
    }"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      :view-box="`0 0 ${width} ${height}`"
      :width="width"
      :height="height"
      :class="ui.svg({
        class: props.ui?.svg
      })"
    >
      <path
        :d="paths"
        :class="ui.path({
          class: [props.ui?.path]
        })"
      />
    </svg>
    <div
      :class="ui.overlay({
        class: [props.ui?.overlay]
      })"
    >
      <slot name="overlay-item">
        <UIcon v-if="props.overlayIcon" :name="props.overlayIcon" :class="ui.overlayItem({ class: props.ui?.overlayItem })" />
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../types/tv'
import type { QrCodeGenerateOptions } from 'uqr'
import theme from '#build/ui/qr-code'

type QrCode = ComponentConfig<typeof theme, AppConfig, 'qr-code'>

export interface QrCodeProps {
  color?: QrCode['variants']['color']
  pixelSize?: number
  overlayIcon?: string
  options?: QrCodeGenerateOptions
  ui?: QrCode['slots']
  class?: any
}
</script>

<script lang="ts" setup>
import { computed } from 'vue'
import { encode } from 'uqr'
import { tv } from '../utils/tv'
import { useAppConfig } from '#imports'

const props = withDefaults(defineProps<QrCodeProps>(), {
  pixelSize: 10,
  overlayIcon: 'i-lucide-qr-code'
})

const modelValue = defineModel<string>({
  required: true
})

const appConfig = useAppConfig() as QrCode['AppConfig']

const encoded = computed(() => encode(modelValue.value, props.options))

const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui['qr-code'] || {}) })(
  {
    color: props.color
  }
))

const width = computed(() => encoded.value.size * (props.pixelSize || 1))
const height = computed(() => encoded.value.size * (props.pixelSize || 1))

const paths = computed(() => {
  const result = []
  const pixelSize = props.pixelSize || 1

  for (let row = 0; row < encoded.value.size; row++) {
    for (let col = 0; col < encoded.value.size; col++) {
      const x = col * pixelSize
      const y = row * pixelSize
      if (encoded.value?.data?.[row]?.[col]) {
        result.push(`M${x},${y}h${pixelSize}v${pixelSize}h-${pixelSize}z`)
      }
    }
  }

  return result.join('')
})
</script>
