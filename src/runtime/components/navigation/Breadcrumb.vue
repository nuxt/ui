<template>
  <div :class="ui.wrapper">
    <component :is="tag" :class="ui.base">
      <component :is="itemTag" v-for="(item, index) in items" :key="index" :class="[ui.item.base, ui.size[size]]">
        <ULink
          v-slot="{ isActive }"
          as="div"
          :to="item.to"
          :class="ui.item.link"
          :active-class="ui.item.active"
          :inactive-class="ui.item.inactive"
          v-bind="omit(item, ['text', 'icon', 'tag'])"
        >
          <slot name="leading" :index="index" :is-active="isActive">
            <UIcon v-if="item.icon" :name="item.icon" :class="ui.icon.size[size]" />
          </slot>

          <slot name="item" :item="item" :index="index" :is-active="isActive">
            {{ item.text }}
          </slot>

          <slot v-if="index < items.length - 1" name="divider">
            <span v-if="divider" :class="ui.item.divider">
              <UIcon v-if="divider.icon" :name="divider.icon" :class="ui.icon.size[size]" />
              <span v-else>{{ divider?.text }}</span>
            </span>
          </slot>
        </ULink>
      </component>
    </component>
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
      default: 'ol'
    },
    itemTag: {
      type: String,
      default: 'li'
    },
    divider: {
      type: Object as PropType<{ icon: string, text: string }>,
      default: () => appConfig.ui.breadcrumb.default.divider
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
