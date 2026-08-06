<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/prose/pre'
import type { IconProps } from '../Icon.vue'
import type { ButtonProps } from '../Button.vue'
import type { LinkPropsKeys } from '../Link.vue'
import type { ComponentConfig } from '../../types/tv'

type ProsePre = ComponentConfig<typeof theme, AppConfig, 'pre', 'ui.prose'>

export interface ProsePreProps {
  icon?: IconProps['name']
  code?: string
  language?: string
  filename?: string
  highlights?: number[]
  hideHeader?: boolean
  meta?: string
  /**
   * Display a button to copy the code to the clipboard.
   * `{ size: 'sm', color: 'neutral', variant: 'outline' }`{lang="ts-type"}
   * @defaultValue true
   */
  copy?: boolean | Omit<ButtonProps, LinkPropsKeys>
  class?: any
  ui?: ProsePre['slots']
}

export interface ProsePreSlots {
  default(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { useClipboard } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../../composables/useComponentProps'
import { useLocale } from '../../composables/useLocale'
import { tv } from '../../utils/tv'
import UCodeIcon from './CodeIcon.vue'
import UButton from '../Button.vue'

const _props = withDefaults(defineProps<ProsePreProps>(), {
  copy: true
})

defineSlots<ProsePreSlots>()

const props = useComponentProps('prose.pre', _props)

const { t } = useLocale()
const { copy: copyToClipboard, copied } = useClipboard()
const appConfig = useAppConfig() as ProsePre['AppConfig']

const baseRef = useTemplateRef('baseRef')

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: theme, ...(appConfig.ui?.prose?.pre || {}) })())

function copyCode() {
  const code = props.code ?? baseRef.value?.textContent ?? ''

  copyToClipboard(code)
}
</script>

<template>
  <div :class="ui.root({ class: [props.ui?.root], filename: !!props.filename })">
    <div v-if="props.filename && !props.hideHeader" :class="ui.header({ class: props.ui?.header })">
      <UCodeIcon :icon="props.icon" :filename="props.filename" :class="ui.icon({ class: props.ui?.icon })" />

      <span :class="ui.filename({ class: props.ui?.filename })">{{ props.filename }}</span>
    </div>

    <UButton
      v-if="props.copy"
      :icon="copied ? appConfig.ui.icons.copyCheck : appConfig.ui.icons.copy"
      color="neutral"
      variant="outline"
      size="sm"
      :aria-label="t('prose.pre.copy')"
      v-bind="(typeof props.copy === 'object' ? props.copy : {})"
      :class="ui.copy({ class: props.ui?.copy })"
      @click="copyCode"
    />

    <pre ref="baseRef" :class="ui.base({ class: [props.ui?.base, props.class] })" v-bind="$attrs"><slot /></pre>
  </div>
</template>
