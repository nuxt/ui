<template>
  <nav :class="ui.wrapper">
    <Link
      v-for="(link, index) of links"
      v-slot="{ isActive }"
      :key="index"
      v-bind="link"
      :class="[ui.base, ui.spacing].join(' ')"
      :active-class="ui.active"
      :inactive-class="ui.inactive"
      @click="link.click && link.click()"
      @keyup.enter="$event.target.blur()"
    >
      <slot name="avatar" :link="link">
        <Avatar
          v-if="link.avatar"
          v-bind="{ size: 'xs', ...link.avatar }"
          :class="[ui.avatar.base, link.label && ui.avatar.spacing]"
        />
      </slot>
      <slot name="icon" :link="link" :is-active="isActive">
        <Icon
          v-if="link.icon"
          :name="link.icon"
          :class="[ui.icon.base, link.label && ui.icon.spacing, isActive ? ui.icon.active : ui.icon.inactive, link.iconClass]"
        />
      </slot>
      <slot :link="link">
        <span v-if="link.label" class="truncate">{{ link.label }}</span>
      </slot>
      <slot name="badge" :link="link" :is-active="isActive">
        <span v-if="link.badge" :class="[ui.badge.baseClass, isActive ? ui.badge.active : ui.badge.inactive]">
          {{ link.badge }}
        </span>
      </slot>
    </Link>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PropType } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'
import { defu } from 'defu'
import Icon from '../elements/Icon.vue'
import Link from '../elements/Link.vue'
import Avatar from '../elements/Avatar.vue'
import type { Avatar as AvatarType } from '../../types/avatar'
import $appConfig from '#build/app.config'
import { useAppConfig } from '#imports'

const props = defineProps({
  links: {
    type: Array as PropType<{
      to?: RouteLocationNormalized | string
      exact?: boolean
      label: string
      icon?: string
      iconClass?: string
      avatar?: Partial<AvatarType>
      click?: Function
      badge?: string
    }[]>,
    default: () => []
  },
  ui: {
    type: Object as PropType<Partial<typeof $appConfig.ui.verticalNavigation>>,
    default: () => $appConfig.ui.verticalNavigation
  }
})

const appConfig = useAppConfig()

const ui = computed<Partial<typeof appConfig.ui.verticalNavigation>>(() => defu({}, props.ui, appConfig.ui.verticalNavigation))
</script>
