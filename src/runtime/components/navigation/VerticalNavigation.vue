<template>
  <nav :class="_ui.wrapper" v-bind="attrs">
    <ul v-for="(section, sectionIndex) of sections" :key="`section${sectionIndex}`">
      <li v-for="(link, index) of section" :key="`section${sectionIndex}-${index}`">
        <ULink
          v-slot="{ isActive }"
          v-bind="getULinkProps(link)"
          :class="[_ui.base, _ui.padding, _ui.width, _ui.ring, _ui.rounded, _ui.font, _ui.size]"
          :active-class="_ui.active"
          :inactive-class="_ui.inactive"
          @click="link.click"
          @keyup.enter="$event.target.blur()"
        >
          <slot name="avatar" :link="link" :is-active="isActive">
            <UAvatar
              v-if="link.avatar"
              v-bind="{ size: _ui.avatar.size, ...link.avatar }"
              :class="[_ui.avatar.base]"
            />
          </slot>
          <slot name="icon" :link="link" :is-active="isActive">
            <UIcon
              v-if="link.icon"
              :name="link.icon"
              :class="twMerge(twJoin(_ui.icon.base, isActive ? _ui.icon.active : _ui.icon.inactive), link.iconClass)"
            />
          </slot>
          <slot :link="link" :is-active="isActive">
            <span v-if="link.label" :class="twMerge(_ui.label, link.labelClass)">
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
                size: _ui.badge.size,
                color: _ui.badge.color,
                variant: _ui.badge.variant,
                ...((typeof link.badge === 'string' || typeof link.badge === 'number') ? { label: link.badge } : link.badge)
              }"
              :class="_ui.badge.base"
            />
          </slot>
        </ULink>
      </li>
      <UDivider v-if="sectionIndex < sections.length - 1" :ui="_ui.divider" />
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
import UDivider from '../layout/Divider.vue'
import { useUI } from '../../composables/useUI'
import { mergeConfig, getULinkProps } from '../../utils'
import type { VerticalNavigationLink, Strategy } from '../../types'
// @ts-expect-error
import appConfig from '#build/app.config'
import { verticalNavigation } from '#ui/ui.config'

const config = mergeConfig<typeof verticalNavigation>(appConfig.ui.strategy, appConfig.ui.verticalNavigation, verticalNavigation)

export default defineComponent({
  components: {
    UIcon,
    UAvatar,
    UBadge,
    ULink,
    UDivider
  },
  inheritAttrs: false,
  props: {
    links: {
      type: Array as PropType<VerticalNavigationLink[][] | VerticalNavigationLink[]>,
      default: () => []
    },
    class: {
      type: [String, Object, Array] as PropType<any>,
      default: () => ''
    },
    ui: {
      type: Object as PropType<Partial<typeof config> & { strategy?: Strategy }>,
      default: () => ({})
    }
  },
  setup (props) {
    const { ui, attrs } = useUI('verticalNavigation', toRef(props, 'ui'), config, toRef(props, 'class'))

    const sections = computed(() => (Array.isArray(props.links[0]) ? props.links : [props.links]) as VerticalNavigationLink[][])

    return {
      _ui: ui,
      attrs,
      sections,
      getULinkProps,
      twMerge,
      twJoin
    }
  }
})
</script>
