<script setup lang="ts">
/**
 * The one trigger every toolbar control opens from: a neutral outline button
 * whose dirty state reaches the ring, the label and both icons. Shared by the
 * six toolbar controls; width and aria-label ride the caller's attrs.
 */
defineProps<{
  label?: string
  /** The trigger's leading glyph; Colors renders its chip pair in #leading instead. */
  icon?: string
  /** Overrides the dimmed leading glyph while clean (the preset chip stays primary). */
  leadingIconClass?: string
  dirty?: boolean
  /** Bound by the owning popover; drives the chevron rotation. */
  open?: boolean
}>()

const appConfig = useAppConfig()
</script>

<template>
  <UButton
    :label="label"
    :icon="icon"
    :trailing-icon="appConfig.ui.icons.chevronDown"
    color="neutral"
    variant="outline"
    class="group bg-default"
    :class="dirty && 'ring-primary/50'"
    :ui="{
      label: ['flex-1 min-w-0 text-left truncate', dirty && 'text-primary'],
      leadingIcon: dirty ? 'text-primary' : (leadingIconClass ?? 'text-dimmed'),
      trailingIcon: ['transition-transform duration-200', open && 'rotate-180', dirty ? 'text-primary' : 'text-dimmed']
    }"
  >
    <template v-if="$slots.leading" #leading>
      <slot name="leading" />
    </template>
  </UButton>
</template>
