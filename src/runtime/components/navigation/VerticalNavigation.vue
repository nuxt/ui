<template>
  <nav :class="ui.wrapper" v-bind="attrs">
    <ul>
      <li v-for="(link, index) of links" :key="index">
        <ULink
          v-slot="{ isActive }"
          v-bind="omit(link, ['label', 'labelClass', 'icon', 'iconClass', 'avatar', 'badge', 'click'])"
          :class="[ui.base, ui.padding, ui.width, ui.ring, ui.rounded, ui.font, ui.size]"
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
            <span v-if="link.badge" :class="[ui.badge.base, isActive ? ui.badge.active : ui.badge.inactive]">
              {{ link.badge }}
            </span>
          </slot>
        </ULink>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { toRef, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { twMerge, twJoin } from 'tailwind-merge'
import UIcon from '../elements/Icon.vue'
import UAvatar from '../elements/Avatar.vue'
import ULink from '../elements/Link.vue'
import { useUI } from '../../composables/useUI'
import { mergeConfig, omit } from '../../utils'
import type { VerticalNavigationLink, Strategy } from '../../types'
// @ts-expect-error
import appConfig from '#build/app.config'
import { verticalNavigation } from '#ui/ui.config'

const config = mergeConfig<typeof verticalNavigation>(appConfig.ui.strategy, appConfig.ui.verticalNavigation, verticalNavigation)

export default defineComponent({
  components: {
    UIcon,
    UAvatar,
    ULink
  },
  inheritAttrs: false,
  props: {
    links: {
      type: Array as PropType<VerticalNavigationLink[]>,
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

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      attrs,
      omit,
      twMerge,
      twJoin
    }
  }
})
</script>
