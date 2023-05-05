<template>
  <div :class="ui.group.wrapper" role="option">
    <h2 v-if="label" :class="ui.group.label">
      {{ label }}
    </h2>

    <div :class="ui.group.container" role="listbox" :aria-label="group[groupAttribute]">
      <ComboboxOption
        v-for="(command, index) of group.commands"
        :key="`${group.key}-${index}`"
        v-slot="{ active, selected }"
        :value="command"
        :disabled="command.disabled"
        as="template"
      >
        <div :class="[ui.group.command.base, active ? ui.group.command.active : ui.group.command.inactive, command.disabled ? 'cursor-not-allowed' : 'cursor-pointer']">
          <div :class="ui.group.command.container">
            <slot :name="`${group.key}-icon`" :group="group" :command="command">
              <UIcon v-if="command.icon" :name="command.icon" :class="[ui.group.command.icon.base, active ? ui.group.command.icon.active : ui.group.command.icon.inactive, command.iconClass]" aria-hidden="true" />
              <UAvatar
                v-else-if="command.avatar"
                v-bind="{ size: ui.group.command.avatar.size, ...command.avatar }"
                :class="ui.group.command.avatar.base"
                aria-hidden="true"
              />
              <span v-else-if="command.chip" :class="ui.group.command.chip.base" :style="{ background: `#${command.chip}` }" />
            </slot>

            <div :class="[ui.group.command.label, command.disabled && ui.group.command.disabled]">
              <slot :name="`${group.key}-command`" :group="group" :command="command">
                <span v-if="command.prefix" class="flex-shrink-0" :class="command.prefixClass || ui.group.command.prefix">{{ command.prefix }}</span>

                <span class="truncate" :class="{ 'flex-none': command.suffix || command.matches?.length }">{{ command[commandAttribute] }}</span>

                <!-- eslint-disable-next-line vue/no-v-html -->
                <span v-if="command.matches?.length" class="truncate" :class="command.suffixClass || ui.group.command.suffix" v-html="highlight(command[commandAttribute], command.matches[0])" />
                <span v-else-if="command.suffix" class="truncate" :class="command.suffixClass || ui.group.command.suffix">{{ command.suffix }}</span>
              </slot>
            </div>
          </div>

          <UIcon v-if="selected" :name="selectedIcon" :class="ui.group.command.selected.icon" aria-hidden="true" />
          <slot v-else-if="active && (group.active || $slots[`${group.key}-active`])" :name="`${group.key}-active`" :group="group" :command="command">
            <span v-if="group.active" :class="ui.group.active">{{ group.active }}</span>
          </slot>
          <slot v-else :name="`${group.key}-inactive`" :group="group" :command="command">
            <span v-if="command.shortcuts?.length" :class="ui.group.command.shortcuts">
              <kbd v-for="shortcut of command.shortcuts" :key="shortcut" class="font-sans">{{ shortcut }}</kbd>
            </span>
            <span v-else-if="!command.disabled && group.inactive" :class="ui.group.inactive">{{ group.inactive }}</span>
          </slot>
        </div>
      </ComboboxOption>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import type { PropType } from 'vue'
import { ComboboxOption } from '@headlessui/vue'
import UIcon from '../elements/Icon.vue'
import UAvatar from '../elements/Avatar.vue'
import type { Group } from '../../types/command-palette'
// TODO: Remove
// @ts-expect-error
import appConfig from '#build/app.config'

// const appConfig = useAppConfig()

export default defineComponent({
  components: {
    ComboboxOption,
    UIcon,
    UAvatar
  },
  props: {
    group: {
      type: Object as PropType<Group>,
      required: true
    },
    query: {
      type: String,
      default: ''
    },
    groupAttribute: {
      type: String,
      required: true
    },
    commandAttribute: {
      type: String,
      required: true
    },
    selectedIcon: {
      type: String,
      required: true
    },
    ui: {
      type: Object as PropType<Partial<typeof appConfig.ui.commandPalette>>,
      default: () => appConfig.ui.commandPalette
    }
  },
  setup (props) {
    const label = computed(() => {
      const label = props.group[props.groupAttribute]

      return typeof label === 'function' ? label(props.query) : label
    })

    function highlight (text: string, { indices, value }: { indices: number[][], value:string }): string {
      if (text === value) {
        return ''
      }

      let content = ''
      let nextUnhighlightedIndiceStartingIndex = 0

      indices.forEach((indice) => {
        const lastIndiceNextIndex = indice[1] + 1
        const isMatched = (lastIndiceNextIndex - indice[0]) >= props.query.length

        content += [
          value.substring(nextUnhighlightedIndiceStartingIndex, indice[0]),
          isMatched && '<mark>',
          value.substring(indice[0], lastIndiceNextIndex),
          isMatched && '</mark>'
        ].filter(Boolean).join('')

        nextUnhighlightedIndiceStartingIndex = lastIndiceNextIndex
      })

      content += value.substring(nextUnhighlightedIndiceStartingIndex)

      const index = content.indexOf('<mark>')
      if (index > 60) {
        content = `...${content.substring(index - 60)}`
      }

      return content
    }

    return {
      label,
      highlight
    }
  }
})
</script>
