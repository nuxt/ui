<template>
  <nav :class="wrapperClass">
    <Link
      v-for="(link, index) of links"
      v-slot="{ isActive }"
      :key="index"
      v-bind="link"
      :class="baseClass"
      :active-class="activeClass"
      :inactive-class="inactiveClass"
      @click="link.click && link.click()"
      @keyup.enter="$event.target.blur()"
    >
      <slot name="icon" :link="link">
        <Icon
          v-if="link.icon"
          :name="link.icon"
          :class="[iconBaseClass, link.label && iconSpacingClass, isActive ? iconActiveClass : iconInactiveClass]"
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

<script>
import Icon from '../elements/Icon'
import Link from '../elements/Link'
import $ui from '#build/ui'

export default {
  components: {
    Icon,
    Link
  },
  props: {
    links: {
      type: Array,
      required: true
    },
    wrapperClass: {
      type: String,
      default: () => $ui.verticalNavigation.wrapper
    },
    baseClass: {
      type: String,
      default: () => $ui.verticalNavigation.base
    },
    activeClass: {
      type: String,
      default: () => $ui.verticalNavigation.active
    },
    inactiveClass: {
      type: String,
      default: () => $ui.verticalNavigation.inactive
    },
    iconBaseClass: {
      type: String,
      default: () => $ui.verticalNavigation.icon.base
    },
    iconSpacingClass: {
      type: String,
      default: () => $ui.verticalNavigation.icon.spacing
    },
    iconActiveClass: {
      type: String,
      default: () => $ui.verticalNavigation.icon.active
    },
    iconInactiveClass: {
      type: String,
      default: () => $ui.verticalNavigation.icon.inactive
    },
    badgeBaseClass: {
      type: String,
      default: () => $ui.verticalNavigation.badge.base
    },
    badgeActiveClass: {
      type: String,
      default: () => $ui.verticalNavigation.badge.active
    },
    badgeInactiveClass: {
      type: String,
      default: () => $ui.verticalNavigation.badge.inactive
    }
  }
}
</script>
