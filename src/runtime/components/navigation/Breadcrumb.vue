<template>
  <div :class="ui.wrapper">
    <ul :class="ui.base">
      <li v-for="(item, key) in items" :key="key" :class="[ui.item.base, ui.size[size]]">
        <ULink
          :to="item.to"
          class="flex items-center gap-x-1"
          :active-class="ui.active"
          :inactive-class="ui.inactive"
          v-bind="omit(item, ['text', 'icon', 'tag'])"
        >
          <UIcon v-if="item.icon" :name="item.icon" :class="ui.icon.size[size]" />

          {{ item.text }}

          <span v-if="key < items.length - 1" :class="ui.item.divider">
            <UIcon v-if="icon" :name="icon" :class="ui.icon.size[size]" />
            <span v-else>{{ divider }}</span>
          </span>
        </ULink>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { defu } from 'defu'
import { omit } from 'lodash-es'
import UIcon from '../elements/Icon.vue'
import ULink from '../elements/Link.vue'
import type { BreadcrumbItem } from '../../types/breadcrumb'
import { useAppConfig } from '#imports'
// TODO: Remove
// @ts-expect-error
import appConfig from '#build/app.config'

// const appConfig = useAppConfig()

export default defineComponent({
  components: {
    UIcon,
    ULink
  },
  props: {
    items: {
      type: Array as PropType<BreadcrumbItem[]>,
      default: () => []
    },
    size: {
      type: String,
      default: () => appConfig.ui.breadcrumb.default.size,
      validator (value: string) {
        return Object.keys(appConfig.ui.breadcrumb.size).includes(value)
      }
    },
    tag: {
      type: String,
      default: 'ul'
    },
    icon: {
      type: String,
      default: () => appConfig.ui.breadcrumb.default.icon
    },
    divider: {
      type: String,
      default: '/'
    },
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.breadcrumb>>,
      default: () => appConfig.ui.breadcrumb
    }
  },
  setup (props) {
    // TODO: Remove
    const appConfig = useAppConfig()

    const ui = computed<Partial<typeof appConfig.ui.breadcrumb>>(() => defu({}, props.ui, appConfig.ui.breadcrumb))

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      omit
    }
  }
})
</script>
