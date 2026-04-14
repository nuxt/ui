<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import theme from '#build/ui/prose/prompt'
import type { IconProps } from '../../types'
import type { ComponentConfig } from '../../types/tv'

type ProsePrompt = ComponentConfig<typeof theme, AppConfig, 'prompt', 'ui.prose'>

export interface ProsePromptProps {
  description?: string
  icon?: IconProps['name']
  class?: any
  ui?: ProsePrompt['slots']
}

export interface ProsePromptSlots {
  default(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { useClipboard } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { useComponentUI } from '../../composables/useComponentUI'
import { useLocale } from '../../composables/useLocale'
import { tv } from '../../utils/tv'
import UIcon from '../Icon.vue'
import UButton from '../Button.vue'

defineOptions({ inheritAttrs: false })

const props = defineProps<ProsePromptProps>()
defineSlots<ProsePromptSlots>()

const { t } = useLocale()
const { copy, copied } = useClipboard()
const appConfig = useAppConfig() as ProsePrompt['AppConfig']
const uiProp = useComponentUI('prose.prompt', props)

const contentRef = useTemplateRef('contentRef')

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.prompt || {}) })())

function copyPrompt() {
  const text = contentRef.value?.textContent ?? ''

  copy(text.trim())
}
</script>

<template>
  <div :class="ui.root({ class: [uiProp?.root, props.class] })" v-bind="$attrs">
    <UIcon v-if="icon" :name="icon" :class="ui.icon({ class: uiProp?.icon })" />

    <div :class="ui.content({ class: uiProp?.content })">
      <p v-if="description" :class="ui.description({ class: uiProp?.description })">
        {{ description }}
      </p>
    </div>

    <div ref="contentRef" hidden>
      <slot mdc-unwrap="p" />
    </div>

    <div :class="ui.actions({ class: uiProp?.actions })">
      <UButton
        :icon="copied ? appConfig.ui.icons.copyCheck : appConfig.ui.icons.copy"
        color="neutral"
        variant="ghost"
        size="sm"
        :aria-label="t('prose.prompt.copy')"
        @click="copyPrompt"
      />
    </div>
  </div>
</template>
