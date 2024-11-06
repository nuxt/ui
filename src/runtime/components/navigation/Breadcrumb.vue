<template>
  <nav aria-label="Breadcrumb" :class="ui.wrapper" v-bind="attrs">
    <ol :class="ui.ol">
      <li v-for="(link, index) in links" :key="index" :class="ui.li">
        <ULink
          as="span"
          :class="[ui.base, index === links.length - 1 ? ui.active : !!link.to ? ui.inactive : '']"
          :aria-current="index === links.length - 1 ? 'page' : undefined"
          v-bind="getULinkProps(link)"
          @click="link.click"
        >
          <slot name="icon" :link="link" :index="index" :is-active="index === links.length - 1">
            <UIcon
              v-if="link.icon"
              :name="link.icon"
              :class="twMerge(twJoin(ui.icon.base, index === links.length - 1 ? ui.icon.active : !!link.to ? ui.icon.inactive : ''), link.iconClass)"
            />
          </slot>

          <slot :link="link" :index="index" :is-active="index === links.length - 1">
            <span v-if="link.label" :class="twMerge(ui.label, link.labelClass)">{{ link.label }}</span>
          </slot>
        </ULink>

        <slot v-if="index < links.length - 1" name="divider">
          <template v-if="divider">
            <UIcon v-if="divider.startsWith('i-')" :name="divider" :class="ui.divider.base" role="presentation" />
            <span v-else role="presentation">{{ divider }}</span>
          </template>
        </slot>
      </li>
    </ol>
  </nav>
</template>

<script lang="ts">
import { defineComponent, toRef } from 'vue'
import type { PropType } from 'vue'
import { twMerge, twJoin } from 'tailwind-merge'
import UIcon from '../elements/Icon.vue'
import ULink from '../elements/Link.vue'
import { useUI } from '../../composables/useUI'
import { mergeConfig, getULinkProps } from '../../utils'
import type { BreadcrumbLink, DeepPartial, Strategy } from '../../types/index'
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
      default: () => ''
    },
    ui: {
      type: Object as PropType<DeepPartial<typeof config> & { strategy?: Strategy }>,
      default: () => ({})
    }
  },
  setup(props) {
    const { ui, attrs } = useUI('breadcrumb', toRef(props, 'ui'), config, toRef(props, 'class'))

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      attrs,
      getULinkProps,
      twMerge,
      twJoin
    }
  }
})
</script>
