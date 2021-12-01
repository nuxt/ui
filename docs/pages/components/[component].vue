<template>
  <UCard v-if="component" class="relative flex flex-col lg:max-h-[calc(100vh-10rem)]" body-class="px-4 py-5 sm:p-6 relative" footer-class="px-4 py-4 sm:px-6 flex-1 lg:overflow-y-auto">
    <div class="flex justify-center">
      <component :is="is" v-bind="boundProps" />
    </div>

    <template v-if="props.length" #footer>
      <div class="space-y-3">
        <component
          :is="prop.type === 'Boolean' ? 'UToggleGroup' : 'UInputGroup'"
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
        </component>
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
    name: 'input'
  },
  Checkbox: {
    name: 'checkbox'
  },
  Radio: {
    name: 'radio'
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
  }
}

const { props: componentProps } = await component.__asyncLoader()

const refProps = Object.entries(componentProps).map(([key, prop]) => {
  const defaultValue = (defaultProps[params.component] || {})[key]
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

const props = ref(refProps)
const boundProps = computed(() => {
  const bound = {}
  for (const prop of props.value) {
    try {
      bound[prop.key] = prop.type === 'Array' ? JSON.parse(prop.value) : prop.value
    } catch (e) {
      continue
    }
  }
  return bound
})
</script>
