<script setup lang="ts">
import type { PropertyMeta } from 'vue-component-meta'

type ComponentPropInputType = 'string' | 'number' | 'boolean' | 'enum' | 'object' | 'array'

const props = defineProps<Partial<PropertyMeta>>()
const modelValue = defineModel<any>()

const inputType = computed<ComponentPropInputType | null>(() => {
  if (!props.schema) return null

  if (props.type?.includes('string')) return 'string'
  if (props.type?.includes('number')) return 'number'
  if (props.type?.includes('boolean')) return 'boolean'
  if (arraySchema.value) return 'array'
  if (typeof props.schema === 'string') return null
  if (props.schema.kind === 'enum' && props.schema.schema && parseEnumValues(props.schema.schema)?.length) return 'enum'
  if (props.schema.kind !== 'enum' && typeof props.schema === 'object') return 'object'

  return null
})

function parseEnumValues(propMeta: PropertyMeta['schema'] | PropertyMeta['schema'][]) {
  const meta = Array.isArray(propMeta) ? propMeta[0] : propMeta
  if (!meta) return
  return Object.values(propMeta).filter((value: string) =>
    typeof value === 'string' && value.startsWith('"') /* Keeps only string symbols and filters interfaces from matches */
  ).map((value: string) => value.replaceAll('"', '')).filter(value => value !== 'undefined')
}

const arraySchema = computed(() => {
  if (typeof props.schema === 'string' || props.schema?.kind !== 'enum') return
  if (!props.schema?.schema) return

  const schema = Object.values(props.schema?.schema)
  const arr = schema?.find(s => typeof s !== 'string' && s.kind === 'array')

  if (!arr?.kind || arr.kind !== 'array' || typeof arr.schema?.[0] !== 'object') return

  return arr.schema[0]
})

function removeArrayItem(index: number) {
  if (!Array.isArray(modelValue.value)) return
  modelValue.value.splice(index, 1)
}

function addArrayItem() {
  if (!Array.isArray(modelValue.value)) return
  modelValue.value.push({})
}

if (!modelValue.value) {
  // TODO: Inject app.config values into the defaults and resolve references
  modelValue.value = props.default ?? props?.tags?.find(tag => tag.name === 'defaultValue' && !tag.text?.includes('appConfig'))?.text?.replaceAll('\'', '')
}
</script>

<template>
  <UFormField :name="name" class="" :ui="{ wrapper: 'mb-2' }" :class="{ 'opacity-70 cursor-not-allowed': !inputType }">
    <template #label>
      <p v-if="name" class="font-mono font-bold px-1.5 py-0.5 border-neutral-200 dark:border-neutral-500 dark:text-neutral-100 border border-dashed rounded bg-neutral-50 dark:bg-neutral-700">
        {{ name }}
      </p>
    </template>

    <template #description>
      <MDC v-if="description" :value="description" class="text-neutral-600 dark:text-neutral-400 mt-1" />
    </template>

    <span v-if="!schema" />

    <UInput v-if="inputType === 'string'" v-model="modelValue" class="min-w-56" />
    <UInput v-else-if="inputType === 'number'" v-model="modelValue" type="number" />
    <USwitch v-else-if="inputType === 'boolean'" v-model="modelValue" />

    <div v-else-if="inputType === 'array'">
      <div v-for="value, index in modelValue" :key="value.id" class="relative border border-[--ui-border] rounded-md mt-4">
        <ComponentPropInput v-bind="arraySchema as any" :model-value="value" />

        <UPopover>
          <UButton variant="ghost" color="neutral" icon="i-heroicons-ellipsis-vertical" class="absolute top-1 right-1" />
          <template #content>
            <UButton
              variant="ghost"
              color="error"
              icon="i-heroicons-trash"
              block
              @click="removeArrayItem(index)"
            >
              Remove
            </UButton>
          </template>
        </UPopover>
      </div>

      <UButton
        icon="i-heroicons-plus"
        color="neutral"
        variant="ghost"
        block
        class="justify-center mt-4"
        @click="addArrayItem()"
      >
        Add value
      </UButton>
    </div>

    <USelectMenu v-else-if="inputType === 'enum'" v-model="modelValue" :items="parseEnumValues((schema as any).schema)" class="min-w-56" />

    <div v-else-if="inputType === 'object'">
      <ComponentPropInput
        v-for="attr in (schema as any)"
        :key="attr.name"
        v-bind="attr"
        :model-value="modelValue?.[attr.name]"
        class="border-b last:border-b-0 border-[--ui-border] p-4"
        @update:model-value="(value) => modelValue[attr.name] = value"
      />
    </div>
  </UFormField>
</template>
