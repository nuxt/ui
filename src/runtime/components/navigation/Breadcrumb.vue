<template>
  <nav aria-label="Breadcrumb" :class="ui.wrapper" v-bind="attrs">
    <ol :class="ui.container">
      <li v-for="(link, index) in links" :key="index" :class="ui.container">
        <ULink
          v-slot="{ isActive }"
          as="span"
          :to="link.to"
          :class="ui.link.base"
          :active-class="ui.link.active"
          :inactive-class="ui.link.inactive"
          v-bind="omit(link, ['label', 'icon', 'iconClass'])"
          :aria-current="index === links.length - 1 ? 'page' : undefined"
        >
          <slot name="icon" :link="link" :index="index" :is-active="isActive">
            <UIcon
              v-if="link.icon"
              :name="link.icon"
              :class="[ui.link.icon.base, isActive ? ui.link.icon.active : ui.link.icon.inactive, link.iconClass]"
            />
          </slot>

          <slot :link="link" :index="index" :is-active="isActive">
            {{ link.label }}
          </slot>
        </ULink>

        <slot v-if="index < links.length - 1" name="divider">
          <template v-if="divider">
            <UIcon v-if="divider.startsWith('i-')" :name="divider" :class="[ui.divider.base, ui.divider.icon.base]" />
            <span v-else :class="ui.divider.base">{{ divider }}</span>
          </template>
        </slot>
      </li>
    </ol>
  </nav>
</template>

<script lang="ts">
import { defineComponent, toRef } from 'vue'
import type { PropType } from 'vue'
import UIcon from '../elements/Icon.vue'
import ULink from '../elements/Link.vue'
import { useUI } from '../../composables/useUI'
import { mergeConfig, omit } from '../../utils'
import type { BreadcrumbLink, Strategy } from '../../types'
// @ts-expect-error
import appConfig from '#build/app.config'
import { breadcrumb } from '#ui/ui.config'

const config = mergeConfig<typeof breadcrumb>(appConfig.ui.strategy, appConfig.ui.breadcrumb, breadcrumb)

export default defineComponent({
  components: {
    UIcon,
    ULink
  },
  inheritAttrs: false,
  props: {
    links: {
      type: Array as PropType<BreadcrumbLink[]>,
      default: () => []
    },
    divider: {
      type: String,
      default: () => config.default.divider
    },
    class: {
      type: [String, Object, Array] as PropType<any>,
      default: undefined
    },
    ui: {
      type: Object as PropType<Partial<typeof config & { strategy?: Strategy }>>,
      default: undefined
    }
  },
  setup (props) {
    const { ui, attrs } = useUI('breadcrumb', toRef(props, 'ui'), config, toRef(props, 'class'))

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      attrs,
      omit
    }
  }
})
</script>
