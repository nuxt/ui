<script lang="ts">
import type { VNode } from 'vue'
import type { AppConfig } from '@nuxt/schema'
import type { ComponentConfig } from '../../types/tv'
import theme from '#build/ui/prose/field'

type ProseField = ComponentConfig<typeof theme, AppConfig, 'field', 'ui.prose'>

export interface ProseFieldProps {
  /**
   * The element or component this component should render as.
   * @defaultValue 'div'
   */
  as?: any
  /**
   * The name of the field.
   */
  name?: string
  /**
   * Expected type of the field's value
   */
  type?: string
  /**
   * Description of the field
   */
  description?: string
  /**
   * Indicate whether the field is required
   */
  required?: boolean
  class?: any
  ui?: ProseField['slots']
}

export interface ProseFieldSlots {
  default(props?: {}): VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { Primitive } from 'reka-ui'
import { useAppConfig } from '#imports'
import { useComponentProps } from '../../composables/useComponentProps'
import { tv } from '../../utils/tv'

const _props = defineProps<ProseFieldProps>()
const slots = defineSlots<ProseFieldSlots>()

const props = useComponentProps('prose.field', _props)

const appConfig = useAppConfig() as ProseField['AppConfig']

// eslint-disable-next-line vue/no-dupe-keys
const ui = computed(() => tv({ extend: tv(theme), ...(appConfig.ui?.prose?.field || {}) })())
</script>

<template>
  <Primitive :as="props.as" :class="ui.root({ class: [props.ui?.root, props.class] })">
    <div :class="ui.container({ class: props.ui?.container })">
      <span v-if="props.name" :class="ui.name({ class: props.ui?.name })">
        {{ props.name }}
      </span>

      <div v-if="props.type || props.required" :class="ui.wrapper({ class: props.ui?.wrapper })">
        <span v-if="props.type" :class="ui.type({ class: props.ui?.type })">
          {{ props.type }}
        </span>

        <span v-if="props.required" :class="ui.required({ class: props.ui?.required })">
          required
        </span>
      </div>
    </div>

    <div v-if="!!slots.default || props.description" :class="ui.description({ class: props.ui?.description })">
      <slot mdc-unwrap="p">
        {{ props.description }}
      </slot>
    </div>
  </Primitive>
</template>
