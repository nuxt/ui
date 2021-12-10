<template>
  <UCard v-if="component" class="relative flex flex-col lg:max-h-[calc(100vh-10rem)]" body-class="px-4 py-5 sm:p-6 relative" footer-class="px-4 py-4 sm:px-6 flex-1 lg:overflow-y-auto">
    <div class="flex justify-center">
      <component :is="is" v-bind="{ ...boundProps, ...eventProps }">
        <template v-for="[key, slot] of Object.entries(defaultProps[params.component]?.slots || {}) || []" #[key]>
          <template v-if="Array.isArray(slot)">
            <div :key="key">
              <component
                :is="slot.component ? `U${slot.component}` : slot.tag"
                v-for="(slot, index) of slot"
                :key="index"
                :class="slot.class"
                v-bind="slot.props || defaultProps[slot.component]"
                v-html="slot.html"
              />
            </div>
          </template>
          <template v-else>
            <component :is="slot.component ? `U${slot.component}` : slot.tag" :key="key" :class="slot.class" v-bind="slot.props || defaultProps[slot.component]" v-html="slot.html" />
          </template>
        </template>
      </component>
    </div>

    <template v-if="props.length" #footer>
      <div class="space-y-3">
        <UFormGroup
          v-for="prop of props"
          :key="prop.key"
          class="capitalize"
          :name="prop.key"
          :label="prop.key"
        >
          <UToggle
            v-if="prop.type === 'Boolean'"
            v-model="prop.value"
            :name="prop.key"
            :label="prop.key"
          />
          <USelect
            v-else-if="prop.values"
            v-model="prop.value"
            :name="prop.key"
            placeholder="Choose one..."
            :options="prop.values"
            size="sm"
          />
          <UInput
            v-else-if="prop.type === 'String'"
            v-model="prop.value"
            :name="prop.key"
            size="sm"
            autocomplete="off"
          />
          <UInput
            v-else-if="prop.type === 'Number'"
            v-model="prop.value"
            type="number"
            :name="prop.key"
            size="sm"
          />
          <UTextarea
            v-else
            v-model="prop.value"
            :name="prop.key"
            size="sm"
            :rows="8"
            autoresize
          />
        </UFormGroup>
      </div>
    </template>
  </UCard>
</template>

<script setup>
import $ui from '#build/ui'

const nuxtApp = useNuxtApp()
const { params } = useRoute()

const is = `U${params.component}`

const component = nuxtApp.vueApp.component(is)

const toggle = ref(false)
const modal = ref(false)

const defaultProps = {
  Button: {
    label: 'Button text'
  },
  Badge: {
    label: 'Badge'
  },
  Alert: {
    title: 'A new software update is available. See what’s new in version 2.0.4.'
  },
  Avatar: {
    src: 'https://picsum.photos/200/300'
  },
  AvatarGroup: {
    group: ['https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', 'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80']
  },
  Dropdown: {
    items: [
      [{
        label: 'Edit',
        icon: 'heroicons-solid:pencil'
      }, {
        label: 'Duplicate',
        icon: 'heroicons-solid:duplicate'
      }],
      [{
        label: 'Archive',
        icon: 'heroicons-solid:archive'
      }, {
        label: 'Move',
        icon: 'heroicons-solid:external-link'
      }],
      [{
        label: 'Delete',
        icon: 'heroicons-solid:trash'
      }]
    ]
  },
  Icon: {
    name: 'heroicons-outline:bell'
  },
  Input: {
    name: 'input',
    placeholder: 'Enter text'
  },
  FormGroup: {
    name: 'input',
    label: 'Input group',
    slots: {
      default: {
        component: 'Input',
        props: {
          name: 'input',
          placeholder: 'Works with every form element'
        }
      }
    }
  },
  Toggle: {
    modelValue: toggle,
    'onUpdate:modelValue': (v) => { toggle.value = v }
  },
  Checkbox: {
    name: 'checkbox'
  },
  Radio: {
    name: 'radio'
  },
  RadioGroup: {
    name: 'radio',
    label: 'Radio group',
    options: [
      {
        label: 'Option 1',
        value: 'option-1'
      },
      {
        label: 'Option 2',
        value: 'option-2'
      }
    ]
  },
  Select: {
    name: 'select',
    options: ['English', 'Spanish', 'French', 'German', 'Chinese']
  },
  Textarea: {
    name: 'textarea'
  },
  Tooltip: {
    text: 'Tooltip text'
  },
  Notification: {
    id: '1',
    title: 'Notification title',
    callback: 'alert(\'Timer expired\')'
  },
  Modal: {
    modelValue: modal,
    'onUpdate:modelValue': (v) => { modal.value = v },
    slots: {
      default: {
        tag: 'div',
        html: 'Modal content'
      },
      footer: {
        component: 'Button',
        props: {
          label: 'Close',
          onClick: () => { modal.value = false }
        }
      }
    }
  },
  Popover: {
    slots: {
      panel: {
        tag: 'div',
        class: 'u-bg-gray-100 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 p-6',
        html: 'Popover content'
      }
    }
  }
}

const componentDefaultProps = defaultProps[params.component] || {}
const { props: componentProps } = await component.__asyncLoader()

const refProps = Object.entries(componentProps).map(([key, prop]) => {
  const defaultValue = componentDefaultProps[key]
  let value = defaultValue || (typeof prop.default === 'function' ? prop.default() : prop.default)
  let type = prop.type
  if (Array.isArray(type)) {
    type = type[0].name
  } else {
    type = type.name
  }

  let values
  if (prop.validator) {
    const arrayRegex = prop.validator.toString().match(/\[.*\]/g, '')
    if (arrayRegex) {
      values = JSON.parse(arrayRegex[0].replace(/'/g, '"')).filter(Boolean)
    } else {
      const $uiProp = $ui[params.component.toLowerCase()][key]
      if ($uiProp) {
        values = Object.keys($uiProp).filter(Boolean)
      }
    }
  }

  if (value) {
    if (type === 'String') {
      value = value.replace(/^'(.*)'$/, '$1')
    } else if (type === 'Array') {
      value = JSON.stringify(value)
    }
  }

  return {
    key,
    type,
    value,
    values
  }
})

const eventProps = Object.entries(componentDefaultProps)
  .filter(([key]) => !refProps.find(prop => prop.key === key))
  .reduce((acc, [key, value]) => {
    acc[key] = value
    return acc
  }, {})

const props = ref(refProps)
const boundProps = computed(() => {
  const bound = {}
  for (const prop of props.value) {
    let value = prop.value
    if (!value) {
      continue
    }

    try {
      if (prop.type === 'Array') {
        value = JSON.parse(value)
      } else if (prop.type === 'Number') {
        value = Number(value)
      } else if (prop.type === 'Function') {
        // eslint-disable-next-line no-new-func
        value = Function(value)
      }

      bound[prop.key] = value
    } catch (e) {
      continue
    }
  }
  return bound
})
</script>
