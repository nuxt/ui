<script setup lang="ts">
import { CollapsibleRoot, CollapsibleTrigger, CollapsibleContent } from 'reka-ui'

const props = withDefaults(defineProps<{
  text: string
  suffix?: string
  icon?: string
  loading?: boolean
  loadingIcon?: string
  streaming?: boolean
  variant?: 'inline' | 'card'
  chevron?: 'leading' | 'trailing'
  open?: boolean
  defaultOpen?: boolean
  class?: any
}>(), {
  variant: 'inline',
  chevron: 'trailing',
  open: undefined,
  defaultOpen: false
})

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const slots = defineSlots<{
  default?: () => any
}>()

const appConfig = useAppConfig()
const chevronIcon = computed(() => appConfig.ui.icons?.chevronDown)
const resolvedLoadingIcon = computed(() => props.loadingIcon || appConfig.ui.icons?.loading)
const resolvedIcon = computed(() => props.loading ? resolvedLoadingIcon.value : props.icon)

const isControlled = computed(() => props.open !== undefined)
const internalOpen = ref(props.defaultOpen)
const resolvedOpen = computed(() => isControlled.value ? props.open : internalOpen.value)

function setOpen(value: boolean) {
  internalOpen.value = value
  emit('update:open', value)
}

const collapsible = computed(() => !!slots.default)
</script>

<template>
  <CollapsibleRoot
    :open="collapsible ? resolvedOpen : undefined"
    data-slot="root"
    :unmount-on-hide="false"
    :class="[props.class, variant === 'card' && 'rounded-md ring ring-default overflow-hidden']"
    @update:open="setOpen"
  >
    <CollapsibleTrigger as-child :disabled="!collapsible">
      <button
        type="button"
        data-slot="trigger"
        :class="[
          'group flex w-full items-center gap-1.5 text-muted text-sm min-w-0',
          variant === 'card' && 'px-2 py-1',
          collapsible && 'cursor-pointer hover:text-default transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
        ]"
      >
        <span v-if="collapsible && chevron === 'leading' && resolvedIcon" class="relative size-4 shrink-0">
          <UIcon
            :name="resolvedIcon"
            :class="[loading && 'animate-spin']"
            class="absolute inset-0 size-4 transition-opacity group-hover:opacity-0 group-data-[state=open]:opacity-0 duration-200"
          />
          <UIcon
            :name="chevronIcon"
            class="absolute inset-0 size-4 opacity-0 transition-all group-hover:opacity-100 group-data-[state=open]:opacity-100 group-data-[state=open]:rotate-180 duration-200"
          />
        </span>
        <UIcon
          v-else-if="collapsible && chevron === 'leading'"
          :name="chevronIcon"
          class="size-4 shrink-0 group-data-[state=open]:rotate-180 transition-transform duration-200"
        />
        <UIcon
          v-else-if="resolvedIcon"
          :name="resolvedIcon"
          :class="[loading && 'animate-spin']"
          class="size-4 shrink-0"
        />

        <span class="truncate">
          <UChatShimmer v-if="streaming" :text="text" />
          <template v-else>{{ text }}</template>
          <span v-if="suffix" class="text-dimmed ms-1">{{ suffix }}</span>
        </span>

        <UIcon
          v-if="collapsible && chevron === 'trailing'"
          :name="chevronIcon"
          :class="[variant === 'card' && 'ms-auto']"
          class="size-4 shrink-0 group-data-[state=open]:rotate-180 transition-transform duration-200"
        />
      </button>
    </CollapsibleTrigger>

    <CollapsibleContent
      v-if="collapsible"
      data-slot="content"
      class="data-[state=open]:animate-[collapsible-down_200ms_ease-out] data-[state=closed]:animate-[collapsible-up_200ms_ease-out] overflow-hidden"
    >
      <div data-slot="body" class="relative" :class="[variant === 'card' ? 'border-t border-default p-2' : 'pt-2']">
        <slot />
      </div>
    </CollapsibleContent>
  </CollapsibleRoot>
</template>
