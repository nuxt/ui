<script setup lang="ts">
import { iconSetSamples } from '../../utils/theme/icons'
import { keepPanels } from '../../utils/theme/studio'

/** The icon set picker: the toolbar control itself, not a panel. */
defineProps<{ tooltip?: string, dirty?: boolean }>()

// The tooltip has to wrap the trigger, so it takes the root; forward the
// caller's class past it or the toolbar's width lands on nothing.
defineOptions({ inheritAttrs: false })

/** Exposed so the toolbar can pin itself while the list is open. */
const open = defineModel<boolean>('open', { default: false })

const { icon, icons } = useTheme()
</script>

<template>
  <UTooltip :text="tooltip" :disabled="!tooltip">
    <USelectMenu
      v-model="icon"
      v-model:open="open"
      :items="icons"
      value-key="value"
      :icon="icons.find(entry => entry.value === icon)?.icon"
      :content="{ onInteractOutside: keepPanels }"
      :search-input="false"
      :color="dirty ? 'primary' : 'neutral'"
      :highlight="dirty"
      variant="outline"
      aria-label="Icon set"
      :ui="{
        base: dirty && 'ring-primary/50 text-primary',
        leadingIcon: dirty ? 'text-primary' : 'text-dimmed',
        trailingIcon: ['transition-transform duration-200', open && 'rotate-180', dirty ? 'text-primary' : 'text-dimmed'],
        content: 'w-72'
      }"
      v-bind="$attrs"
    >
      <!-- every set previews a strip of its own glyphs -->
      <template #item-description="{ item }">
        <span class="flex items-center gap-1.5 pt-0.5">
          <UIcon
            v-for="name in iconSetSamples(item.value)"
            :key="name"
            :name="name"
            class="size-3.5 text-muted"
          />
        </span>
      </template>
    </USelectMenu>
  </UTooltip>
</template>
