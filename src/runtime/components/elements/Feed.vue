<template>
  <ol :class="ui.base" v-bind="attrs">
    <template v-for="(item, key) in items" :key="key">
      <li :class="ui.item">
        <div :class="ui.indicator.base">
          <div :class="indicatorContainerClass">
            <div>
              <slot name="icon" v-bind="{ item, key }">
                <div :class="[indicatorIconClass, getIndicatorColorClass(item)]">
                  <template v-if="isDot" />
                  <UIcon v-else-if="item.icon" :name="item.icon" />
                  <template v-else>
                    {{ key + 1 }}
                  </template>
                </div>
              </slot>
            </div>
            <div v-if="withSeparators && key < items.length - 1" :class="separatorClass" />
          </div>
        </div>
        <div :class="ui.body.base" class="">
          <slot name="body" v-bind="{ item, key }">
            <div :class="titleClass">
              {{ item.title }}
            </div>
            <div v-if="item.description" :class="descriptionClass">
              <small>{{ item.description }}</small>
            </div>
          </slot>
        </div>
        <div :class="ui.trailing.base">
          <slot name="trailing" v-bind="{ item, key }">
            <div :class="trailingTextClass">
              <small>{{ item.trailing }}</small>
            </div>
          </slot>
        </div>
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
    indicators: {
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

    const isDot = computed(() => !props.indicators)

    const withSeparators = computed(() => props.separators)

    const indicatorContainerClass = computed(() => {
      return twJoin(
        ui.value.indicator.container,
        isDot.value ? ui.value.indicator.margin : ''
      )
    })

    const indicatorIconClass = computed(() => {
      return twJoin(
        ui.value.indicator.icon.base,
        ui.value.indicator.icon.rounded,
        isDot.value ? ui.value.indicator.icon.dot : ui.value.indicator.icon.size
      )
    })

    function getIndicatorColorClass (item: FeedItem) {
      return twJoin(
        ui.value.indicator.icon.background.replaceAll('{color}', item.color ?? props.color)
      )
    }

    const separatorClass = computed(() => {
      return twJoin(
        ui.value.separator.base,
        ui.value.separator.background.replaceAll('{color}', props.color)
      )
    })

    const titleClass = computed(() => {
      return twJoin(
        ui.value.body.title.replaceAll('{color}', props.color)
      )
    })

    const descriptionClass = computed(() => {
      return twJoin(
        ui.value.body.description.replaceAll('{color}', props.color)
      )
    })

    const trailingTextClass = computed(() => {
      return twJoin(
        ui.value.trailing.text.base,
        ui.value.trailing.text.align,
        ui.value.trailing.text.color.replaceAll('{color}', props.color)
      )
    })

    return {
      // eslint-disable-next-line vue/no-dupe-keys
      ui,
      attrs,
      items,
      isDot,
      withSeparators,
      indicatorContainerClass,
      indicatorIconClass,
      getIndicatorColorClass,
      separatorClass,
      titleClass,
      descriptionClass,
      trailingTextClass
    }
  }
})
</script>
