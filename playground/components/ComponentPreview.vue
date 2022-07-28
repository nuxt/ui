<template>
  <div class="ring-4 dark:ring-gray-900 ring-gray-200 rounded-lg drop-shadow-xl overflow-hidden">
    <div class="relative min-h-[100px] p-8 w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 z-5">
      <component :is="`U${defaults.component.name}`" v-if="defaults && defaults.component" v-bind="defaults.component.props" />

      <component :is="component" v-bind="state">
        <template v-for="[_key, slot] of slots">
          <template v-if="Array.isArray(slot)">
            <div :key="_key">
              <component
                :is="nestedSlot.component ? `U${nestedSlot.component.name}` : nestedSlot.tag"
                v-for="(nestedSlot, index) of slot"
                :key="index"
                :class="nestedSlot.class"
                v-bind="nestedSlot.component?.props || defaultProps[nestedSlot.component]"
                v-html="nestedSlot.html"
              />
            </div>
          </template>
          <template v-else>
            <div :key="_key">
              <component :is="`U${slot.component.name}`" v-if="slot.component" v-bind="slot.component?.props || defaultProps[slot.component]" />
              <component :is="slot.tag" v-else :class="slot.class" v-html="slot.html" />
            </div>
          </template>
        </template>
      </component>
    </div>

    <UCard class="-mt-2 pt-2 p-4 flex-1">
      <div class="space-y-3">
        <UFormGroup
          v-for="prop of meta.props.filter(prop => prop.type && prop.name)"
          :key="prop.name"
          :name="prop.name"
          :label="upperFirst(kebabCase(prop.name).replaceAll('-', ' ').toLocaleLowerCase())"
        >
          <UToggle
            v-if="prop.type === 'Boolean'"
            v-model="state[prop.name]"
            :name="prop.name"
            :label="prop.name"
          />
          <USelect
            v-else-if="prop.values"
            v-model="state[prop.name]"
            :name="prop.name"
            placeholder="Choose one..."
            :options="prop.values"
            size="sm"
          />
          <UInput
            v-else-if="prop.type === 'String'"
            v-model="state[prop.name]"
            :name="prop.name"
            size="sm"
            autocomplete="off"
          />
          <UInput
            v-else-if="prop.type === 'Number'"
            v-model="state[prop.name]"
            type="number"
            :name="prop.name"
            size="sm"
          />
          <UTextarea
            v-else
            :model-value="JSON.stringify(state[prop.name], null, 2)"
            :name="prop.name"
            size="sm"
            :rows="8"
            autoresize
            @update:model-value="value => {
              try {
                state[prop.name] = JSON.parse(value)
              } catch (e) {}
            }"
          />
        </UFormGroup>
      </div>

      <div class="border-t u-border-gray-200">
        <pre class="text-sm leading-6 u-text-gray-900 flex-1 relative flex ligatures-none lg:overflow-y-auto overflow-x-hidden px-4 sm:px-6 py-5 sm:py-6">
          <code class="flex-none min-w-full whitespace-pre-wrap break-all">{{ code }}</code>
        </pre>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { computedWithControl } from '@vueuse/shared'
import { kebabCase, upperFirst } from 'scule'

const _props = defineProps({
  component: {
    type: String,
    required: true
  }
})

const nuxtApp = useNuxtApp()

const { component: _component } = toRefs(_props)

const { ui: config } = useRuntimeConfig()

// Computed component name
const component = computed(() => config.prefix + _component.value)

// Component resolved
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const resolvedComponent = computed<any>(() => nuxtApp.vueApp.component(component.value))

// Grab default props defined locally
const defaultProps = useDefaultProps()

// Grab defaults from `useDefaultProps`
const defaults = computedWithControl(
  defaultProps,
  () => {
    let _defaults = defaultProps.value[_component.value] || {}

    if (typeof _defaults === 'function') {
      _defaults = _defaults(state)
    }

    return _defaults
  }
)

// Slots shorthand
const slots = computed<any[]>(() => {
  return Object.entries(defaults.value.slots || {}) || []
})

// Grab component data from instance
const componentDataProps = ref({})

watch(
  component,
  async () => {
    if (!resolvedComponent.value?.__asyncLoader) { return false }

    const data = await resolvedComponent.value.__asyncLoader()

    componentDataProps.value = data.props
  },
  {
    immediate: true
  }
)

// Fetch data from `nuxt-component-meta`

const { data } = await useAsyncData(
  'component-metas',
  () => $fetch('/api/component-meta', {
    responseType: 'json'
  })
)

// Meta
const meta = computedWithControl(
  [data],
  () => {
    const metas = data.value as any[] || []

    const _meta = metas.find(item => item.name === component.value)

    if (!_meta) {
      return {
        props: []
      }
    }

    _meta.props = _meta.props.map((prop) => {
      const componentPropData = componentDataProps.value?.[prop.name]

      let values
      if (componentPropData) {
        if (componentPropData.validator) {
          const arrayRegex = componentPropData.validator.toString().match(/\[.*\]/g, '')

          if (arrayRegex) {
            values = JSON.parse(arrayRegex[0].replace(/'/g, '"')).filter(Boolean)
          }
        }
      }
      if (values) { prop.values = values }

      return prop
    })

    return _meta
  })

// Local component state
const state = reactive({})

// Recompose component state from defaults and parsed metas
watch(
  [defaults, meta],
  ([_defaults, _meta]) => {
    const metaProps = _meta?.props || []

    // - Apply data coming from `nuxt-component-meta`
    metaProps.forEach(
      (val) => {
        const { name, default: defaultValue } = val

        state[name] = defaultValue
      }
    )

    // - Apply data coming from useDefaultProps
    Object.entries(_defaults).forEach(
      (binding) => {
        const [key, value] = binding

        if (key === 'component') { return }

        if (key === 'slots') { return }

        state[key] = value
      }
    )
  },
  { immediate: true }
)

const code = computed(() => {
  let code = `<U${component.value}`

  for (const [key, value] of Object.entries(state)) {
    if (value) {
      const prop = kebabCase(key)

      if (key === 'modelValue') {
        code += `\n v-model="${value}"`
        continue
      }

      if (key === 'onUpdate:modelValue') {
        continue
      }

      code += `\n :${prop}="${value}"`
    }
  }

  code += '\n/>'

  return code
})
</script>
