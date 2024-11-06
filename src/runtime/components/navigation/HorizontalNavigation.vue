<template>
  <nav :class="ui.wrapper" v-bind="attrs">
    <ul v-for="(section, sectionIndex) of sections" :key="`section${sectionIndex}`" :class="ui.container">
      <li v-for="(link, index) of section" :key="`section${sectionIndex}-${index}`" :class="ui.inner">
        <ULink
          v-slot="{ isActive }"
          v-bind="getULinkProps(link)"
          :class="[ui.base, ui.before, ui.after]"
          :active-class="ui.active"
          :inactive-class="ui.inactive"
          @click="link.click"
          @keyup.enter="$event.target.blur()"
        >
          <slot name="avatar" :link="link" :is-active="isActive">
            <UAvatar
              v-if="link.avatar"
              v-bind="{ size: ui.avatar.size, ...link.avatar }"
              :class="[ui.avatar.base]"
            />
          </slot>
          <slot name="icon" :link="link" :is-active="isActive">
            <UIcon
              v-if="link.icon"
              :name="link.icon"
              :class="twMerge(twJoin(ui.icon.base, isActive ? ui.icon.active : ui.icon.inactive), link.iconClass)"
            />
          </slot>
          <slot :link="link" :is-active="isActive">
            <span v-if="link.label" :class="twMerge(ui.label, link.labelClass)">
              <span v-if="isActive" class="sr-only">
                Current page:
              </span>
              {{ link.label }}
            </span>
          </slot>
          <slot name="badge" :link="link" :is-active="isActive">
            <UBadge
              v-if="link.badge"
              v-bind="{
                size: ui.badge.size,
                color: ui.badge.color,
                variant: ui.badge.variant,
                ...((typeof link.badge === 'string' || typeof link.badge === 'number') ? { label: link.badge } : link.badge)
              }"
              :class="ui.badge.base"
            />
          </slot>
        </ULink>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { toRef, defineComponent, computed } from 'vue'
import type { PropType } from 'vue'
import { twMerge, twJoin } from 'tailwind-merge'
import UIcon from '../elements/Icon.vue'
import UAvatar from '../elements/Avatar.vue'
import UBadge from '../elements/Badge.vue'
import ULink from '../elements/Link.vue'
import { useUI } from '../../composables/useUI'
import { mergeConfig, getULinkProps } from '../../utils'
import type { DeepPartial, HorizontalNavigationLink, Strategy } from '../../types/index'
// @ts-expect-error
import appConfig from '#build/app.config'
import { horizontalNavigation } from '#ui/ui.config'

const config = mergeConfig<typeof horizontalNavigation>(appConfig.ui.strategy, appConfig.ui.horizontalNavigation, horizontalNavigation)

export default defineComponent({
  components: {
    UIcon,
    UAvatar,
    UBadge,
    ULink
  },
  inheritAttrs: false,
  props: {
    links: {
      type: Array as PropType<HorizontalNavigationLink[][] | HorizontalNavigationLink[]>,
      default: () => []
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
    const { ui, attrs } = useUI('horizontalNavigation', toRef(props, 'ui'), config, toRef(props, 'class'))

    const sections = computed(() => (Array.isArray(props.links[0]) ? props.links : [props.links]) as HorizontalNavigationLink[][])

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      attrs,
      sections,
      getULinkProps,
      twMerge,
      twJoin
    }
  }
})
</script>
