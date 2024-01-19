<template>
  <ol :class="ui.base" v-bind="attrs" :style="ui.style">
    <template v-for="(item, key) in items" :key="key">
      <li :class="ui.item">
        <div>
          <slot name="icon" v-bind="{ item, key }">
            <div v-if="hasIcons" :class="getIconClass(item)">
              <UIcon v-if="item.icon" :name="item.icon" />
              <template v-else>
                {{ key + 1 }}
              </template>
            </div>
            <div v-else :class="getIconClass(item)" />
          </slot>
        </div>

        <div>
          <slot name="title" v-bind="{ item, key }">
            <div :class="[ui.title.base, ui.title.align, ui.title.size, ui.title.color]">
              {{ item.title }}
            </div>
          </slot>
        </div>

        <div>
          <slot name="trailing" v-bind="{ item, key }">
            <div :class="[ui.trailing.base, ui.trailing.align, ui.trailing.size, ui.trailing.color]">
              {{ item.trailing }}
            </div>
          </slot>
        </div>

        <div>
          <div v-if="hasSeparators && key < items.length - 1" :class="ui.separator.wrapper">
            <div :class="ui.separator.container">
              <div :class="[ui.separator.size, ui.separator.background, hasIcons ? '' : ui.separator.withoutIndicators]" />
            </div>
          </div>
        </div>

        <div :class="key < items.length - 1 ? ui.padding : ''">
          <slot name="description" v-bind="{ item, key }">
            <div :class="[ui.description.base, ui.description.align, ui.description.size, ui.description.color]">
              {{ item.description }}
            </div>
          </slot>
        </div>

        <div />
      </li>
    </template>
  </ol>
</template>

<script lang="ts">
import { computed, toRef, defineComponent } from 'vue'
import type { PropType, ComputedRef } from 'vue'
import { twJoin } from 'tailwind-merge'
import type { Strategy, FeedItem, FeedIndicatorColor } from '../../types'
import UIcon from './Icon.vue'
// @ts-expect-error
import appConfig from '#build/app.config'
import { mergeConfig } from '#ui/utils'
import { feed } from '#ui/ui.config'
import { useUI } from '#ui/composables/useUI'

const config = mergeConfig<typeof feed>(appConfig.ui.strategy, appConfig.ui.feed, feed)

export default defineComponent({
  components: {
    UIcon
  },
  inheritAttrs: false,
  props: {
    feed: {
      type: Array as PropType<String[] | FeedItem[]>,
      default: () => []
    },
    icons: {
      type: Boolean,
      default: true
    },
    separators: {
      type: Boolean,
      default: true
    },
    color: {
      type: String as PropType<FeedIndicatorColor>,
      default: () => config.default.color,
      validator (value: string) {
        return [...appConfig.ui.colors, 'gray'].includes(value)
      }
    },
    ui: {
      type: Object as PropType<Partial<typeof config & { strategy?: Strategy }>>,
      default: undefined
    }
  },
  setup (props) {
    const { ui, attrs } = useUI('feed', toRef(props, 'ui'), config)

    const items: ComputedRef<FeedItem[]> = computed(() => props.feed.map(item => {
      return typeof item === 'string' ? { title: item } : item
    }))

    const hasIcons = computed(() => props.icons)
    const hasSeparators = computed(() => props.separators)

    function getIconClass (item: FeedItem) {
      const key = hasIcons.value ? 'large' : 'small'

      return twJoin(
        ui.value.indicator[key].base,
        ui.value.indicator[key].size,
        ui.value.indicator[key].ring,
        ui.value.indicator[key].rounded,
        ui.value.indicator.color.replaceAll('{color}', item.color ?? props.color)
      )
    }

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      attrs,
      items,
      hasIcons,
      hasSeparators,
      getIconClass
    }
  }
})
</script>
