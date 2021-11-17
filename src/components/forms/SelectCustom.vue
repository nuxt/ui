<template>
  <div ref="container" v-on-clickaway="close">
    <input :value="value" :required="required" class="absolute inset-0 w-px opacity-0 cursor-default">

    <slot :toggle="toggle" :open="open">
      <TwButton
        icon="solid/selector"
        icon-class="text-tw-gray-400"
        trailing
        :size="size"
        :variant="variant"
        base-class="w-full cursor-default focus:outline-none disabled:cursor-not-allowed disabled:opacity-75"
        :disabled="disabled || !options || !options.length"
        @click.native="!disabled && options && options.length && toggle()"
      >
        <div v-if="selectedOptions && selectedOptions.length" class="inline-flex w-full px-3 py-2 -my-2 -ml-3 truncate">
          <span v-for="(selectedOption, index) of selectedOptions" :key="index" class="inline-flex items-center pr-2">
            <slot name="label" :option="selectedOption">
              <span class="text-tw-gray-700">{{ selectedOption[textAttribute] }}</span>
            </slot>
          </span>
        </div>
        <div v-else class="inline-flex w-full text-tw-gray-400">
          {{ placeholder || '' }}
        </div>
      </TwButton>
    </slot>

    <transition
      enter-class=""
      enter-active-class=""
      enter-to-class=""
      leave-class="opacity-100"
      leave-active-class="transition duration-100 ease-in"
      leave-to-class="opacity-0"
    >
      <div v-show="open" ref="tooltip" class="z-10 overflow-hidden bg-white rounded-md shadow-lg dark:bg-gray-800 ring-1 ring-gray-200 dark:ring-gray-700" :class="dropdownClass">
        <div v-if="searchable" class="w-full border-b border-gray-200 dark:border-gray-700">
          <TwInput
            ref="search"
            v-model="q"
            type="search"
            :name="`select-search-${name}`"
            block
            autocomplete="off"
            appearance="none"
            :placeholder="placeholderSearch"
          />
        </div>
        <ul
          ref="options"
          tabindex="-1"
          role="listbox"
          class="overflow-y-auto max-h-60 sm:text-sm focus:outline-none"
        >
          <li
            v-if="showNewOption"
            ref="option-new"
            role="option"
            class="relative pl-3 pr-12 cursor-default select-none group hover:text-white hover:bg-primary-600"
            :class="{
              'bg-primary-600 text-white': active === -1,
              'text-tw-gray-900': active !== -1,
              'py-2': dropdownSize === 'md',
              'py-1 text-sm': dropdownSize === 'sm'
            }"
            @mouseover="active = -1"
            @click="active === -1 && newOption()"
          >
            <slot name="newOption" :optionName="q">
              <span class="block truncate">Add new option: "{{ q }}"</span>
            </slot>
          </li>
          <li
            v-for="(option, index) in filteredNormalizedOptions"
            :key="index"
            :ref="`option-${index}`"
            role="option"
            class="relative pl-3 pr-12 cursor-default select-none group hover:text-white hover:bg-primary-600"
            :class="{
              'font-semibold': isOptionSelected(option),
              'bg-primary-600 text-white': active === index,
              'text-tw-gray-900': active !== index,
              'py-2': dropdownSize === 'md',
              'py-1 text-sm': dropdownSize === 'sm'
            }"
            @mouseover="active = index"
            @click.prevent="active === index && selectOption(option)"
          >
            <slot name="option" :option="option">
              <span class="block truncate">{{ option[textAttribute] }}</span>
            </slot>
            <span class="absolute inset-y-0 right-0 flex items-center pr-3">
              <Icon
                v-if="isOptionSelected(option)"
                name="solid/check"
                class=" group-hover:text-white"
                :class="{
                  'text-white': active === index,
                  'text-primary-600': active !== index,
                  'h-5 w-5': dropdownSize === 'md',
                  'h-4 w-4': dropdownSize === 'sm'
                }"
              />
            </span>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
import get from 'lodash/get'
import { createPopper } from '@popperjs/core'
import { directive as onClickaway } from 'vue-clickaway'

import Icon from '../elements/Icon'

export default {
  components: {
    Icon
  },
  directives: {
    onClickaway
  },
  shortcuts: {
    disabled () {
      return !this.open
    },
    up: 'prev',
    down: 'next',
    enter: 'enter',
    esc: {
      handler: 'close',
      stop: true,
      prevent: true
    }
  },
  props: {
    value: {
      type: [String, Number, Object, Array],
      default: ''
    },
    name: {
      type: String,
      required: true
    },
    multiple: {
      type: Boolean,
      default: false
    },
    options: {
      type: Array,
      default: () => []
    },
    textAttribute: {
      type: String,
      default: 'text'
    },
    valueAttribute: {
      type: String,
      default: 'value'
    },
    searchAttributes: {
      type: Array,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: null
    },
    placeholderSearch: {
      type: String,
      default: 'Search...'
    },
    searchable: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    newEnabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'md',
      validator (value) {
        return ['xxs', 'xs', 'sm', 'md', 'lg', 'xl'].includes(value)
      }
    },
    dropdownClass: {
      type: String,
      default: 'w-full'
    },
    dropdownSize: {
      type: String,
      default: 'md',
      validator (value) {
        return ['sm', 'md'].includes(value)
      }
    },
    variant: {
      type: String,
      default: 'gray'
    },
    strategy: {
      type: String,
      default: 'absolute'
    },
    placement: {
      type: String,
      default: 'bottom-start'
    },
    unselectable: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      open: false,
      active: 0,
      q: '',
      instance: null
    }
  },
  computed: {
    showNewOption () {
      return this.newEnabled && this.q && !this.filteredNormalizedOptions.find(option => option[this.textAttribute].toLowerCase() === this.q.toLowerCase())
    },
    selectedOptions () {
      if (this.multiple) {
        return this.value.map(value => this.normalizedOptions.find(option => option[this.valueAttribute] === value)).filter(Boolean)
      } else {
        return [this.normalizedOptions.find(option => option[this.valueAttribute] === this.value)].filter(Boolean)
      }
    },
    normalizedOptions () {
      return this.options.map(option => this.normalizeOption(option))
    },
    filteredNormalizedOptions () {
      let filteredNormalizedOptions = this.normalizedOptions

      if (!this.q) {
        return filteredNormalizedOptions
      }

      try {
        filteredNormalizedOptions = this.normalizedOptions.filter((option) => {
          return (this.searchAttributes?.length ? this.searchAttributes : [this.textAttribute]).some((searchAttribute) => {
            return option[searchAttribute] && option[searchAttribute].search(new RegExp(this.q, 'i')) !== -1
          })
        })
      } catch (e) {}

      return filteredNormalizedOptions
    }
  },
  watch: {
    disabled (value) {
      if (value && open) { this.close() }
    },
    open (value) {
      this.$emit('open', value)

      if (!value) {
        return
      }

      if (this.searchable) {
        this.$nextTick(() => {
          this.$refs.search.$refs.input.focus()
          this.$refs.search.$refs.input.select()
        })
      }

      if (this.multiple) {
        if (this.value.length) {
          this.active = this.filteredNormalizedOptions.findIndex(option => this.value.includes(option[this.valueAttribute]))
        }
      } else if (this.value) {
        this.active = this.filteredNormalizedOptions.findIndex(option => option[this.valueAttribute] === this.value)
      }

      if (this.instance) {
        this.instance.destroy()
        this.instance = null
      }

      this.instance = createPopper(this.$refs.container, this.$refs.tooltip, {
        strategy: this.strategy,
        placement: this.placement,
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 8]
            }
          },
          {
            name: 'computeStyles',
            options: {
              gpuAcceleration: false,
              adaptive: false
            }
          },
          {
            name: 'preventOverflow',
            options: {
              padding: 8
            }
          }
        ]
      })

      this.$nextTick(() => {
        this.scrollIntoView()
      })
    },
    filteredNormalizedOptions () {
      this.updateActive()
    },
    q () {
      this.updateActive()
    }
  },
  beforeDestroy () {
    if (this.instance) {
      this.instance.destroy()
      this.instance = null
    }
  },
  methods: {
    toggle () {
      this.open = !this.open
    },
    close () {
      this.open = false
    },
    newOption () {
      this.$emit('new', this.q)
    },
    isOptionSelected (option) {
      if (this.multiple) {
        return this.value && this.value.find(it => it === option[this.valueAttribute])
      }

      return this.value && this.value === option[this.valueAttribute]
    },
    selectOption (option) {
      if (this.multiple) {
        const value = [...this.value]
        const index = value.findIndex(it => it === option[this.valueAttribute])
        if (index > -1) {
          value.splice(index, 1)
        } else {
          value.push(option[this.valueAttribute])
        }
        this.$emit('input', value)
      } else {
        if (this.isOptionSelected(option)) {
          if (this.unselectable) {
            this.$emit('input', null)
          }
        } else {
          this.$emit('input', option[this.valueAttribute])
        }
        this.open = false
      }
    },
    guessOptionValue (option) {
      return get(option, this.valueAttribute, get(option, this.textAttribute))
    },
    guessOptionText (option) {
      return get(option, this.textAttribute, get(option, this.valueAttribute))
    },
    normalizeOption (option) {
      if (['string', 'number', 'boolean'].includes(typeof option)) {
        return {
          [this.valueAttribute]: option,
          [this.textAttribute]: option
        }
      }

      return {
        ...option,
        [this.valueAttribute]: this.guessOptionValue(option),
        [this.textAttribute]: this.guessOptionText(option)
      }
    },
    prev () {
      if (this.active - 1 >= (this.showNewOption ? -1 : 0)) {
        this.active--
      }

      this.scrollIntoView()
    },
    next () {
      if (this.active + 1 <= (this.filteredNormalizedOptions.length - 1)) {
        this.active++
      }

      this.scrollIntoView()
    },
    enter () {
      if (this.active === -1) {
        if (this.showNewOption) {
          this.newOption()
        }
        return
      }

      const option = this.filteredNormalizedOptions[this.active]
      if (!option) {
        return
      }

      this.selectOption(option)
    },
    scrollIntoView () {
      let child
      if (this.active === -1) {
        child = this.$refs['option-new']
      } else {
        child = this.$refs[`option-${this.active}`][0]
      }

      if (!child) {
        return
      }

      child.scrollIntoView({ block: 'nearest' })
    },
    updateActive () {
      this.active = this.showNewOption && !this.filteredNormalizedOptions.length ? -1 : 0
    }
  }
}
</script>
