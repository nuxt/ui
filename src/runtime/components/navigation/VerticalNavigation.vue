<template>
  <nav :class="wrapperClass" v-bind="attrs">
    <ULink
      v-for="(link, index) of links"
      v-slot="{ isActive }"
      :key="index"
      v-bind="omit(link, ['label', 'icon', 'iconClass', 'avatar', 'badge', 'click'])"
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
          :class="[ui.icon.base, isActive ? ui.icon.active : ui.icon.inactive, link.iconClass]"
        />
      </slot>
      <slot :link="link" :is-active="isActive">
        <span v-if="link.label" :class="ui.label">{{ link.label }}</span>
      </slot>
      <slot name="badge" :link="link" :is-active="isActive">
        <span v-if="link.badge" :class="[ui.badge.base, isActive ? ui.badge.active : ui.badge.inactive]">
          {{ link.badge }}
        </span>
      </slot>
    </ULink>
  </nav>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { omit } from 'lodash-es'
import { twMerge } from 'tailwind-merge'
import UIcon from '../elements/Icon.vue'
import UAvatar from '../elements/Avatar.vue'
import ULink from '../elements/Link.vue'
import { defuTwMerge } from '../../utils'
import type { VerticalNavigationLink } from '../../types/vertical-navigation'
import { useAppConfig } from '#imports'
// TODO: Remove
// @ts-expect-error
import appConfig from '#build/app.config'

// const appConfig = useAppConfig()

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
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.verticalNavigation>>,
      default: () => ({})
    }
  },
  setup (props, { attrs }) {
    // TODO: Remove
    const appConfig = useAppConfig()

    const ui = computed<Partial<typeof appConfig.ui.verticalNavigation>>(() => defuTwMerge({}, props.ui, appConfig.ui.verticalNavigation))

    const wrapperClass = computed(() => twMerge(ui.value.wrapper, attrs.class as string))

    return {
      attrs: omit(attrs, ['class']),
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      wrapperClass,
      omit
    }
  }
})
</script>
