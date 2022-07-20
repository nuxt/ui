<template>
  <nav :class="wrapperClass">
    <Link
      v-for="(link, index) of links"
      v-slot="{ isActive }"
      :key="index"
      v-bind="link"
      :class="[baseClass, spacingClass]"
      :active-class="activeClass"
      :inactive-class="inactiveClass"
      @click="link.click && link.click()"
      @keyup.enter="$event.target.blur()"
    >
      <slot name="avatar" :link="link">
        <Avatar
          v-if="link.avatar"
          v-bind="link.avatar"
          :class="[avatarBaseClass, link.label && avatarSpacingClass]"
        />
      </slot>
      <slot name="icon" :link="link">
        <Icon
          v-if="link.icon"
          :name="link.icon"
          :class="[iconBaseClass, link.label && iconSpacingClass, isActive ? iconActiveClass : iconInactiveClass, link.iconClass]"
        />
      </slot>
      <slot :link="link">
        <span v-if="link.label" class="truncate">{{ link.label }}</span>
      </slot>
      <slot name="badge" :link="link">
        <span v-if="link.badge" :class="[badgeBaseClass, isActive ? badgeActiveClass : badgeInactiveClass]">
          {{ link.badge }}
        </span>
      </slot>
    </Link>
  </nav>
</template>

<script setup lang="ts">
import Icon from '../elements/Icon.vue'
import Link from '../elements/Link.vue'
import Avatar from '../elements/Avatar.vue'
import { $theme } from '#theme'

defineProps({
  links: {
    type: Array,
    required: true
  },
  wrapperClass: {
    type: String,
    default () { return $theme('ui.verticalNavigation.wrapper').value }
  },
  baseClass: {
    type: String,
    default () { return $theme('ui.verticalNavigation.base').value }
  },
  spacingClass: {
    type: String,
    default () { return $theme('ui.verticalNavigation.spacing').value }
  },
  activeClass: {
    type: String,
    default () { return $theme('ui.verticalNavigation.active').value }
  },
  inactiveClass: {
    type: String,
    default () { return $theme('ui.verticalNavigation.inactive').value }
  },
  iconBaseClass: {
    type: String,
    default () { return $theme('ui.verticalNavigation.icon.base').value }
  },
  iconSpacingClass: {
    type: String,
    default () { return $theme('ui.verticalNavigation.icon.spacing').value }
  },
  iconActiveClass: {
    type: String,
    default () { return $theme('ui.verticalNavigation.icon.active').value }
  },
  iconInactiveClass: {
    type: String,
    default () { return $theme('ui.verticalNavigation.icon.inactive').value }
  },
  avatarBaseClass: {
    type: String,
    default () { return $theme('ui.verticalNavigation.avatar.base').value }
  },
  avatarSpacingClass: {
    type: String,
    default () { return $theme('ui.verticalNavigation.avatar.spacing').value }
  },
  badgeBaseClass: {
    type: String,
    default () { return $theme('ui.verticalNavigation.badge.base').value }
  },
  badgeActiveClass: {
    type: String,
    default () { return $theme('ui.verticalNavigation.badge.active').value }
  },
  badgeInactiveClass: {
    type: String,
    default () { return $theme('ui.verticalNavigation.badge.inactive').value }
  }
})
</script>

<script lang="ts">
export default { name: 'UVerticalNavigation' }
</script>
