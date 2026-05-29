<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/prose/prompt'
import type { IconProps } from '../../types'
import type { ComponentConfig } from '../../types/tv'

type ProsePrompt = ComponentConfig<typeof theme, AppConfig, 'prompt', 'ui.prose'>

export interface ProsePromptProps {
  description?: string
  /**
   * @IconifyIcon
   */
  icon?: IconProps['name']
  /**
   * @defaultValue ['copy']
   */
  actions?: ('copy' | 'cursor' | 'windsurf')[]
  class?: any
  ui?: ProsePrompt['slots']
}

export interface ProsePromptSlots {
  default(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { useClipboard } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../../composables/useComponentProps'
import { useLocale } from '../../composables/useLocale'
import { getSlotChildrenText } from '../../utils'
import { tv } from '../../utils/tv'
import UIcon from '../Icon.vue'
import UButton from '../Button.vue'

defineOptions({ inheritAttrs: false })

const _props = withDefaults(defineProps<ProsePromptProps>(), {
  actions: () => ['copy']
})
const slots = defineSlots<ProsePromptSlots>()

const props = useComponentProps('prose.prompt', _props)

const { t } = useLocale()
const { copy, copied } = useClipboard()
const appConfig = useAppConfig() as ProsePrompt['AppConfig']

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.prompt || {}) })())

function getPromptText() {
  const children = slots.default?.()
  return children ? getSlotChildrenText(children).trim() : ''
}

function copyPrompt() {
  copy(getPromptText())
}

function openInCursor() {
  const url = new URL('cursor://anysphere.cursor-deeplink/prompt')
  url.searchParams.set('text', getPromptText())

  window.open(url.toString(), '_self')
}

function openInWindsurf() {
  const url = new URL('windsurf://cascade/newChat')
  url.searchParams.set('prompt', getPromptText())

  window.open(url.toString(), '_self')
}
</script>

<template>
  <div :class="ui.root({ class: [props.ui?.root, props.class] })" v-bind="$attrs">
    <UIcon v-if="props.icon" :name="props.icon" :class="ui.icon({ class: props.ui?.icon })" />

    <div :class="ui.content({ class: props.ui?.content })">
      <p v-if="props.description" :class="ui.description({ class: props.ui?.description })">
        {{ props.description }}
      </p>
    </div>

    <div :class="ui.actions({ class: props.ui?.actions })">
      <UButton
        v-if="props.actions.includes('copy')"
        :icon="copied ? appConfig.ui.icons.copyCheck : appConfig.ui.icons.copy"
        size="sm"
        :label="t('prose.prompt.copy')"
        @click="copyPrompt"
      />

      <UButton
        v-if="props.actions.includes('cursor')"
        icon="i-simple-icons-cursor"
        color="neutral"
        variant="outline"
        size="sm"
        :label="t('prose.prompt.openIn', { name: 'Cursor' })"
        @click="openInCursor"
      />

      <UButton
        v-if="props.actions.includes('windsurf')"
        icon="i-simple-icons-windsurf"
        color="neutral"
        variant="outline"
        size="sm"
        :label="t('prose.prompt.openIn', { name: 'Windsurf' })"
        @click="openInWindsurf"
      />
    </div>
  </div>
</template>
