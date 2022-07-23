<template>
  <div>
    <div class="relative min-h-[100px] p-8 w-full flex items-center justify-center bg-gray-800 ring-4 dark:ring-gray-900 ring-gray-100 rounded-lg drop-shadow-xl z-30">
      <component :is="`U${defaults.component.name}`" v-if="defaults && defaults.component" v-bind="defaults.component.props" />

      <component :is="component" v-bind="state">
        <template v-for="[key, slot] of slots" #[key]>
          <template v-if="Array.isArray(slot)">
            <div :key="key">
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
            <component :is="`U${slot.component.name}`" v-if="slot.component" :key="`${key}-component`" v-bind="slot.component?.props || defaultProps[slot.component]" />
            <component :is="slot.tag" v-else :key="`${key}-tag`" :class="slot.class" v-html="slot.html" />
          </template>
        </template>
      </component>
    </div>

    <div class="p-4 flex-1 space-y-3 lg:overflow-y-auto">
      <UFormGroup
        v-for="prop of meta.props.filter(prop => prop.type && prop.name)"
        :key="prop.name"
        class="capitalize"
        :name="prop.name"
        :label="prop.name"
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
  </div>
</template>

<script setup lang="ts">
const _props = defineProps({
  component: {
    type: String,
    required: true
  }
})

function lowercaseFirstLetter (string) {
  return string.charAt(0).toLowerCase() + string.slice(1)
}

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

// Grab component data from instance
const componentDataProps = ref({})
// /* Uncomnent this part to fetch data from components instance
watch(
  component,
  async () => {
    if (!resolvedComponent.value?.__asyncLoader) { return false }

    const data = await resolvedComponent.value?.__asyncLoader()

    componentDataProps.value = data.props
  },
  {
    immediate: true
  }
)
// */

// Fetch data from `nuxt-component-meta`
const { data } = await useAsyncData('metas', () => $fetch('/api/component-meta'))

// Meta
const meta = computed(() => {
  const _meta = data.value.find(item => item.name === component.value)

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

/*
watch(
  () => state,
  (val) => {
    //
  },
  { deep: true }
)
*/

// Grab defaults from `useDefaultProps`
const defaults = computed(() => {
  let _defaults = defaultProps.value[_component.value] || {}

  if (typeof _defaults === 'function') {
    _defaults = _defaults(state)
  }

  return _defaults
})

// Slots shorthand
const slots = computed<any[]>(() => {
  return Object.entries(defaults.value.slots || {}) || []
})

// Recompose component state from defaults and parsed metas
// - Apply data coming from `nuxt-component-meta`
watch(
  meta,
  (val) => {
    (val?.props || []).forEach(
      (val) => {
        const { name, default: defaultValue } = val

        state[name] = defaultValue
      }
    )
  },
  { immediate: true }
)
// - Apply data coming from useDefaultProps
watch(
  defaults,
  (val) => {
    Object.entries(val).forEach(
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
</script>
