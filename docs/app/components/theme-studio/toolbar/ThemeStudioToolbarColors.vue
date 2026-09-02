<script setup lang="ts">
import { SEMANTIC_ALIASES } from '../../../utils/theme/engine'
import { keepPanels } from '../../../utils/theme/studio'

/** The Colors control: a chip-pair trigger opening the per-alias sections. */
const props = defineProps<{
  /** Stacked in the mobile menu: the panel takes the trigger's width, like a select. */
  vertical?: boolean
}>()

const appConfig = useAppConfig()
const { colorChips, colorLabel, groupDirtyFlags } = useThemeStudioToolbar()

const open = ref(false)
const dirty = groupDirtyFlags.colors

// Folded by default: five pickers most themes never touch, and the bulk of
// the panel's height. Dirty state still reads on the header's reset button.
const semanticOpen = ref(false)

const content = computed(() => [
  props.vertical ? 'w-(--reka-popper-anchor-width)' : 'w-80 max-w-[calc(100vw-2rem)]',
  'max-h-[70vh] overflow-y-auto divide-y divide-default *:p-4'
])
</script>

<template>
  <UPopover v-model:open="open" :content="{ align: 'center', onInteractOutside: keepPanels }" :ui="{ content }">
    <UButton
      :label="colorLabel"
      :trailing-icon="appConfig.ui.icons.chevronDown"
      color="neutral"
      variant="outline"
      :class="['group bg-default', dirty && 'ring-primary/50', vertical ? 'w-full' : 'w-38']"
      :ui="{
        label: ['flex-1 min-w-0 text-left truncate', dirty && 'text-primary'],
        trailingIcon: ['transition-transform duration-200', open && 'rotate-180', dirty ? 'text-primary' : 'text-dimmed']
      }"
      :aria-label="`Colors: ${colorLabel}`"
    >
      <template #leading>
        <!-- -space-x-1 makes the pair exactly 20px, the width of a leading
             icon, so every trigger's text starts on the same pixel -->
        <span class="flex items-center -space-x-1">
          <!-- primary stacks on top; black-as-primary has no ramp
               variable to point at -->
          <span
            v-for="(chip, index) in colorChips"
            :key="chip.label"
            class="relative size-3 rounded-full ring-2 ring-bg group-hover:ring-(--ui-bg-elevated) transition"
            :class="!chip.dot && 'bg-black dark:bg-white'"
            :style="{ ...(chip.dot ? { backgroundColor: chip.dot } : {}), zIndex: colorChips.length - index }"
          />
        </span>
      </template>
    </UButton>

    <template #content>
      <ThemeStudioColorSection
        alias="primary"
        help-to="/docs/getting-started/theme/css-variables#colors"
        section-key="primary"
      />

      <ThemeStudioColorSection
        alias="neutral"
        help-to="/docs/getting-started/theme/css-variables#text"
        section-key="neutral"
      />

      <ThemeStudioSection
        label="Semantic"
        help-to="/docs/getting-started/theme/design-system"
        section-key="semantic"
      >
        <template #actions>
          <UButton
            :icon="appConfig.ui.icons.chevronDown"
            color="neutral"
            variant="ghost"
            size="sm"
            :aria-label="semanticOpen ? 'Collapse semantic colors' : 'Expand semantic colors'"
            :aria-expanded="semanticOpen"
            :ui="{ leadingIcon: ['transition-transform duration-200', semanticOpen && 'rotate-180'] }"
            class="-my-1"
            @click="semanticOpen = !semanticOpen"
          />
        </template>

        <UCollapsible v-model:open="semanticOpen" :ui="{ content: 'overflow-hidden' }">
          <template #content>
            <div class="flex flex-col gap-3">
              <ThemeStudioColorSection
                v-for="alias in SEMANTIC_ALIASES"
                :key="alias"
                :alias="alias"
              />
            </div>
          </template>
        </UCollapsible>
      </ThemeStudioSection>
    </template>
  </UPopover>
</template>
