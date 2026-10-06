<script setup lang="ts">
import { CalendarDate } from '@internationalized/date'
import type { DropdownMenuItem, ContextMenuItem, TreeItem, NavigationMenuItem } from '@nuxt/ui'

import badgeTheme from '#build/ui/badge'
import buttonTheme from '#build/ui/button'
import kbdTheme from '#build/ui/kbd'
import alertTheme from '#build/ui/alert'
import avatarTheme from '#build/ui/avatar'
import chipTheme from '#build/ui/chip'
import bannerTheme from '#build/ui/banner'
import separatorTheme from '#build/ui/separator'
import toastTheme from '#build/ui/toast'
import checkboxTheme from '#build/ui/checkbox'
import checkboxGroupTheme from '#build/ui/checkbox-group'
import radioGroupTheme from '#build/ui/radio-group'
import switchTheme from '#build/ui/switch'
import sliderTheme from '#build/ui/slider'
import progressTheme from '#build/ui/progress'
import stepperTheme from '#build/ui/stepper'
import timelineTheme from '#build/ui/timeline'
import tabsTheme from '#build/ui/tabs'
import calendarTheme from '#build/ui/calendar'
import breadcrumbTheme from '#build/ui/breadcrumb'
import navigationMenuTheme from '#build/ui/navigation-menu'
import treeTheme from '#build/ui/tree'
import pageCardTheme from '#build/ui/page-card'
import chatMessageTheme from '#build/ui/chat-message'
import inputTheme from '#build/ui/input'
import textareaTheme from '#build/ui/textarea'
import selectTheme from '#build/ui/select'
import inputNumberTheme from '#build/ui/input-number'
import pinInputTheme from '#build/ui/pin-input'
import fileUploadTheme from '#build/ui/file-upload'
import dropdownMenuTheme from '#build/ui/dropdown-menu'
import contextMenuTheme from '#build/ui/context-menu'
import chatPromptTheme from '#build/ui/chat-prompt'
import inputDateTheme from '#build/ui/input-date'
import inputTimeTheme from '#build/ui/input-time'
import inputRatingTheme from '#build/ui/input-rating'
import listboxTheme from '#build/ui/listbox'
import progressGroupTheme from '#build/ui/progress-group'
import avatarGroupTheme from '#build/ui/avatar-group'
import tableTheme from '#build/ui/table'

// Compact grid: header row of color names, one row per variant (or relevant boolean).
function gridStyle(n: number) {
  return { gridTemplateColumns: `repeat(${n + 1}, max-content)` }
}

const toast = useToast()

// Button
const buttonColors = Object.keys(buttonTheme.variants.color)
const buttonVariants = Object.keys(buttonTheme.variants.variant)

// Badge
const badgeColors = Object.keys(badgeTheme.variants.color)
const badgeVariants = Object.keys(badgeTheme.variants.variant)

// Kbd
const kbdColors = Object.keys(kbdTheme.variants.color)
const kbdVariants = Object.keys(kbdTheme.variants.variant)

// Alert
const alertColors = Object.keys(alertTheme.variants.color)
const alertVariants = Object.keys(alertTheme.variants.variant)

// Avatar
const avatarColors = Object.keys(avatarTheme.variants.color)

// Chip
const chipColors = Object.keys(chipTheme.variants.color)

// Banner
const bannerColors = Object.keys(bannerTheme.variants.color)

// Separator
const separatorColors = Object.keys(separatorTheme.variants.color)

// Toast
const toastColors = Object.keys(toastTheme.variants.color)

function addToast(color: string) {
  toast.add({
    title: `${color} toast`,
    description: 'Triggered from the colors playground.',
    color: color as any
  })
}

// Checkbox
const checkboxColors = Object.keys(checkboxTheme.variants.color)
const checkboxVariants = Object.keys(checkboxTheme.variants.variant)

// RadioGroup
const radioGroupColors = Object.keys(radioGroupTheme.variants.color)
const radioGroupVariants = Object.keys(radioGroupTheme.variants.variant)
const radioGroupItems = [{ value: '1', label: 'Option 1' }, { value: '2', label: 'Option 2' }]

// CheckboxGroup
const checkboxGroupColors = Object.keys(checkboxGroupTheme.variants.color)
const checkboxGroupVariants = Object.keys(checkboxGroupTheme.variants.variant)
const checkboxGroupItems = [{ value: '1', label: 'Option 1' }, { value: '2', label: 'Option 2' }]

// Switch
const switchColors = Object.keys(switchTheme.variants.color)

// Slider
const sliderColors = Object.keys(sliderTheme.variants.color)

// Progress
const progressColors = Object.keys(progressTheme.variants.color)

// Stepper
const stepperColors = Object.keys(stepperTheme.variants.color)
const stepperItems = [{ title: 'Address' }, { title: 'Shipping' }, { title: 'Payment' }]

// Timeline
const timelineColors = Object.keys(timelineTheme.variants.color)
const timelineItems = [{ title: 'Kickoff', date: 'Mar 15' }, { title: 'Design', date: 'Mar 22' }]

// Tabs
const tabsColors = Object.keys(tabsTheme.variants.color)
const tabsVariants = Object.keys(tabsTheme.variants.variant)
const tabsItems = [{ label: 'Tab1' }, { label: 'Tab2' }]

// Calendar
const calendarColors = Object.keys(calendarTheme.variants.color)
const calendarVariants = Object.keys(calendarTheme.variants.variant)
const calendarValue = shallowRef(new CalendarDate(2022, 1, 10))

// Breadcrumb
const breadcrumbColors = Object.keys(breadcrumbTheme.variants.color)
const breadcrumbItems = [{ label: 'Home', to: '/' }, { label: 'Colors' }]

// NavigationMenu
const navigationMenuColors = Object.keys(navigationMenuTheme.variants.color)
const navigationMenuItems = [[{
  label: 'Introduction',
  icon: 'i-lucide-house',
  active: true
}, {
  label: 'Installation',
  icon: 'i-lucide-cloud-download'
}] satisfies NavigationMenuItem[]]

// Tree
const treeColors = Object.keys(treeTheme.variants.color)
const treeItems = [
  { label: 'app.vue', icon: 'i-vscode-icons-file-type-vue' },
  { label: 'nuxt.config.ts', icon: 'i-vscode-icons-file-type-nuxt' }
] satisfies TreeItem[]

// PageCard
const pageCardHighlightColors = Object.keys(pageCardTheme.variants.highlightColor)
const pageCardSpotlightColors = Object.keys(pageCardTheme.variants.spotlightColor)

// ChatMessage
const chatMessageColors = Object.keys(chatMessageTheme.variants.color)
const chatMessageVariants = Object.keys(chatMessageTheme.variants.variant)

// Form controls, every variant plus `highlight`
const selectItems = ['Apple', 'Banana', 'Blueberry']
const fields = [
  { name: 'Input', colors: Object.keys(inputTheme.variants.color), variants: Object.keys(inputTheme.variants.variant) },
  { name: 'Textarea', colors: Object.keys(textareaTheme.variants.color), variants: Object.keys(textareaTheme.variants.variant) },
  { name: 'Select', colors: Object.keys(selectTheme.variants.color), variants: Object.keys(selectTheme.variants.variant) },
  { name: 'InputNumber', colors: Object.keys(inputNumberTheme.variants.color), variants: Object.keys(inputNumberTheme.variants.variant) },
  { name: 'PinInput', colors: Object.keys(pinInputTheme.variants.color), variants: Object.keys(pinInputTheme.variants.variant) },
  { name: 'InputDate', colors: Object.keys(inputDateTheme.variants.color), variants: Object.keys(inputDateTheme.variants.variant) },
  { name: 'InputTime', colors: Object.keys(inputTimeTheme.variants.color), variants: Object.keys(inputTimeTheme.variants.variant) }
]
const fileUploadColors = Object.keys(fileUploadTheme.variants.color)
const fileUploadVariants = Object.keys(fileUploadTheme.variants.variant)

// ChatPrompt
const chatPromptColors = Object.keys(chatPromptTheme.variants.color)
const chatPromptVariants = Object.keys(chatPromptTheme.variants.variant)

// Other color-aware components
const inputRatingColors = Object.keys(inputRatingTheme.variants.color)
const listboxColors = Object.keys(listboxTheme.variants.color)
const progressGroupColors = Object.keys(progressGroupTheme.variants.color)
const progressGroupItems = [{ label: 'Used', value: 40 }, { label: 'Reserved', value: 25 }]
const avatarGroupColors = Object.keys(avatarGroupTheme.variants.color)
const tableLoadingColors = Object.keys(tableTheme.variants.loadingColor)
const progressAnimations = Object.keys(progressTheme.variants.animation)

// DropdownMenu / ContextMenu — items carry a color each
const dropdownMenuColors = Object.keys(dropdownMenuTheme.variants.color)
const dropdownMenuItems = computed(() => [
  ...dropdownMenuColors.map(color => ({ label: color, color: color as any })),
  { label: 'active', active: true }
] satisfies DropdownMenuItem[])

const contextMenuColors = Object.keys(contextMenuTheme.variants.color)
const contextMenuItems = computed(() => [
  ...contextMenuColors.map(color => ({ label: color, color: color as any })),
  { label: 'active', active: true }
] satisfies ContextMenuItem[])

// Prose themes aren't generated in the Vue playground, and every component takes the same colors
const calloutColors = buttonColors
const codeColors = buttonColors
</script>

<template>
  <UDashboardNavbar title="Colors" class="absolute top-0 inset-x-0 z-5 bg-default" />

  <div class="flex flex-col gap-10 min-h-0 w-full max-w-full py-6">
    <p class="max-w-lg text-muted">
      Every color-aware component, in every configured color (including neutral), across its variants. Toggle dark mode to check both themes.
    </p>

    <!-- Button -->
    <section class="space-y-3">
      <h2 class="text-lg font-semibold text-strong">
        Button
      </h2>
      <div class="overflow-x-auto">
        <div class="grid gap-x-3 gap-y-2 items-center w-max" :style="gridStyle(buttonColors.length)">
          <div />
          <div v-for="color in buttonColors" :key="color" class="text-xs font-medium text-muted text-center capitalize">
            {{ color }}
          </div>

          <template v-for="variant in buttonVariants" :key="variant">
            <div class="text-xs font-medium text-muted capitalize whitespace-nowrap pe-3">
              {{ variant }}
            </div>
            <div v-for="color in buttonColors" :key="`${variant}-${color}`" class="flex justify-center">
              <UButton :label="color" :color="(color as any)" :variant="(variant as any)" />
            </div>
          </template>

          <div class="text-xs font-medium text-muted whitespace-nowrap pe-3">
            disabled
          </div>
          <div v-for="color in buttonColors" :key="`disabled-${color}`" class="flex justify-center">
            <UButton :label="color" :color="(color as any)" disabled />
          </div>

          <div class="text-xs font-medium text-muted whitespace-nowrap pe-3">
            loading
          </div>
          <div v-for="color in buttonColors" :key="`loading-${color}`" class="flex justify-center">
            <UButton :label="color" :color="(color as any)" loading />
          </div>
        </div>
      </div>
    </section>

    <!-- Badge -->
    <section class="space-y-3">
      <h2 class="text-lg font-semibold text-strong">
        Badge
      </h2>
      <div class="overflow-x-auto">
        <div class="grid gap-x-3 gap-y-2 items-center w-max" :style="gridStyle(badgeColors.length)">
          <div />
          <div v-for="color in badgeColors" :key="color" class="text-xs font-medium text-muted text-center capitalize">
            {{ color }}
          </div>
          <template v-for="variant in badgeVariants" :key="variant">
            <div class="text-xs font-medium text-muted capitalize whitespace-nowrap pe-3">
              {{ variant }}
            </div>
            <div v-for="color in badgeColors" :key="`${variant}-${color}`" class="flex justify-center">
              <UBadge :label="color" :color="(color as any)" :variant="(variant as any)" />
            </div>
          </template>
        </div>
      </div>
    </section>

    <!-- Kbd -->
    <section class="space-y-3">
      <h2 class="text-lg font-semibold text-strong">
        Kbd
      </h2>
      <div class="overflow-x-auto">
        <div class="grid gap-x-3 gap-y-2 items-center w-max" :style="gridStyle(kbdColors.length)">
          <div />
          <div v-for="color in kbdColors" :key="color" class="text-xs font-medium text-muted text-center capitalize">
            {{ color }}
          </div>
          <template v-for="variant in kbdVariants" :key="variant">
            <div class="text-xs font-medium text-muted capitalize whitespace-nowrap pe-3">
              {{ variant }}
            </div>
            <div v-for="color in kbdColors" :key="`${variant}-${color}`" class="flex justify-center">
              <UKbd value="meta" :color="(color as any)" :variant="(variant as any)" />
            </div>
          </template>
        </div>
      </div>
    </section>

    <!-- Alert -->
    <section class="space-y-3">
      <h2 class="text-lg font-semibold text-strong">
        Alert
      </h2>
      <div class="overflow-x-auto">
        <div class="grid gap-x-3 gap-y-2 items-start w-max" :style="gridStyle(alertColors.length)">
          <div />
          <div v-for="color in alertColors" :key="color" class="text-xs font-medium text-muted text-center capitalize">
            {{ color }}
          </div>
          <template v-for="variant in alertVariants" :key="variant">
            <div class="text-xs font-medium text-muted capitalize whitespace-nowrap pe-3">
              {{ variant }}
            </div>
            <div v-for="color in alertColors" :key="`${variant}-${color}`" class="flex justify-center w-48">
              <UAlert
                title="Heads up!"
                description="You can change the primary color in your app config."
                :color="(color as any)"
                :variant="(variant as any)"
              />
            </div>
          </template>
        </div>
      </div>
    </section>

    <!-- Avatar -->
    <section class="space-y-3">
      <h2 class="text-lg font-semibold text-strong">
        Avatar
      </h2>
      <div class="overflow-x-auto">
        <div class="grid gap-x-3 gap-y-2 items-center w-max" :style="gridStyle(avatarColors.length)">
          <div />
          <div v-for="color in avatarColors" :key="color" class="text-xs font-medium text-muted text-center capitalize">
            {{ color }}
          </div>

          <div class="text-xs font-medium text-muted whitespace-nowrap pe-3">
            initials
          </div>
          <div v-for="color in avatarColors" :key="`initials-${color}`" class="flex justify-center">
            <UAvatar :text="color.slice(0, 2).toUpperCase()" :color="(color as any)" />
          </div>

          <div class="text-xs font-medium text-muted whitespace-nowrap pe-3">
            icon
          </div>
          <div v-for="color in avatarColors" :key="`icon-${color}`" class="flex justify-center">
            <UAvatar icon="i-lucide-user" :color="(color as any)" />
          </div>
        </div>
      </div>
    </section>

    <!-- Chip (on an avatar) -->
    <section class="space-y-3">
      <h2 class="text-lg font-semibold text-strong">
        Chip
      </h2>
      <div class="overflow-x-auto">
        <div class="grid gap-x-3 gap-y-2 items-center w-max" :style="gridStyle(chipColors.length)">
          <div />
          <div v-for="color in chipColors" :key="color" class="text-xs font-medium text-muted text-center capitalize">
            {{ color }}
          </div>
          <div class="text-xs font-medium text-muted whitespace-nowrap pe-3">
            chip
          </div>
          <div v-for="color in chipColors" :key="`chip-${color}`" class="flex justify-center">
            <UChip text="1" :color="(color as any)" inset>
              <UAvatar src="https://github.com/benjamincanac.png" />
            </UChip>
          </div>
        </div>
      </div>
    </section>

    <!-- Banner -->
    <section class="space-y-3">
      <h2 class="text-lg font-semibold text-strong">
        Banner
      </h2>
      <div class="flex flex-col gap-2 w-full">
        <UBanner
          v-for="color in bannerColors"
          :key="color"
          :title="`${color} banner`"
          icon="i-lucide-rocket"
          :color="(color as any)"
        />
      </div>
    </section>

    <!-- Separator (with and without label) -->
    <section class="space-y-3">
      <h2 class="text-lg font-semibold text-strong">
        Separator
      </h2>
      <div class="overflow-x-auto">
        <div class="grid gap-3 items-center w-max" :style="gridStyle(separatorColors.length)">
          <div />
          <div v-for="color in separatorColors" :key="color" class="text-xs font-medium text-muted text-center capitalize">
            {{ color }}
          </div>

          <div class="text-xs font-medium text-muted whitespace-nowrap pe-3">
            no label
          </div>
          <div v-for="color in separatorColors" :key="`plain-${color}`" class="w-32">
            <USeparator :color="(color as any)" />
          </div>

          <div class="text-xs font-medium text-muted whitespace-nowrap pe-3">
            with label
          </div>
          <div v-for="color in separatorColors" :key="`label-${color}`" class="w-32">
            <USeparator :label="color" :color="(color as any)" />
          </div>
        </div>
      </div>
    </section>

    <!-- Toast (overlay-based, one button per color) -->
    <section class="space-y-3">
      <h2 class="text-lg font-semibold text-strong">
        Toast
      </h2>
      <div class="flex flex-wrap gap-2">
        <UButton
          v-for="color in toastColors"
          :key="color"
          :label="color"
          :color="(color as any)"
          variant="soft"
          @click="addToast(color)"
        />
      </div>
    </section>

    <!-- Checkbox -->
    <section class="space-y-3">
      <h2 class="text-lg font-semibold text-strong">
        Checkbox
      </h2>
      <div class="overflow-x-auto">
        <div class="grid gap-x-3 gap-y-2 items-center w-max" :style="gridStyle(checkboxColors.length)">
          <div />
          <div v-for="color in checkboxColors" :key="color" class="text-xs font-medium text-muted text-center capitalize">
            {{ color }}
          </div>
          <template v-for="variant in checkboxVariants" :key="variant">
            <div class="text-xs font-medium text-muted capitalize whitespace-nowrap pe-3">
              {{ variant }}
            </div>
            <div v-for="color in checkboxColors" :key="`${variant}-${color}`" class="flex justify-center">
              <UCheckbox :label="color" :color="(color as any)" :variant="(variant as any)" :model-value="true" />
            </div>
          </template>
          <template v-for="state in ['unchecked', 'highlight', 'disabled']" :key="state">
            <div class="text-xs font-medium text-muted whitespace-nowrap pe-3">
              {{ state }}
            </div>
            <div v-for="color in checkboxColors" :key="`${state}-${color}`" class="flex justify-center">
              <UCheckbox :label="color" :color="(color as any)" :model-value="state !== 'unchecked'" :highlight="state === 'highlight'" :disabled="state === 'disabled'" />
            </div>
          </template>
        </div>
      </div>
    </section>

    <!-- RadioGroup -->
    <section class="space-y-3">
      <h2 class="text-lg font-semibold text-strong">
        RadioGroup
      </h2>
      <div class="overflow-x-auto">
        <div class="grid gap-x-3 gap-y-2 items-center w-max" :style="gridStyle(radioGroupColors.length)">
          <div />
          <div v-for="color in radioGroupColors" :key="color" class="text-xs font-medium text-muted text-center capitalize">
            {{ color }}
          </div>
          <template v-for="variant in radioGroupVariants" :key="variant">
            <div class="text-xs font-medium text-muted capitalize whitespace-nowrap pe-3">
              {{ variant }}
            </div>
            <div v-for="color in radioGroupColors" :key="`${variant}-${color}`" class="flex justify-center">
              <URadioGroup
                :items="radioGroupItems"
                default-value="1"
                :color="(color as any)"
                :variant="(variant as any)"
              />
            </div>
          </template>
        </div>
      </div>
    </section>

    <!-- CheckboxGroup -->
    <section class="space-y-3">
      <h2 class="text-lg font-semibold text-strong">
        CheckboxGroup
      </h2>
      <div class="overflow-x-auto">
        <div class="grid gap-x-3 gap-y-2 items-center w-max" :style="gridStyle(checkboxGroupColors.length)">
          <div />
          <div v-for="color in checkboxGroupColors" :key="color" class="text-xs font-medium text-muted text-center capitalize">
            {{ color }}
          </div>
          <template v-for="variant in checkboxGroupVariants" :key="variant">
            <div class="text-xs font-medium text-muted capitalize whitespace-nowrap pe-3">
              {{ variant }}
            </div>
            <div v-for="color in checkboxGroupColors" :key="`${variant}-${color}`" class="flex justify-center">
              <UCheckboxGroup
                :items="checkboxGroupItems"
                :default-value="['1']"
                :color="(color as any)"
                :variant="(variant as any)"
              />
            </div>
          </template>
        </div>
      </div>
    </section>

    <!-- Switch (on) -->
    <section class="space-y-3">
      <h2 class="text-lg font-semibold text-strong">
        Switch
      </h2>
      <div class="overflow-x-auto">
        <div class="grid gap-x-3 gap-y-2 items-center w-max" :style="gridStyle(switchColors.length)">
          <div />
          <div v-for="color in switchColors" :key="color" class="text-xs font-medium text-muted text-center capitalize">
            {{ color }}
          </div>
          <div class="text-xs font-medium text-muted whitespace-nowrap pe-3">
            on
          </div>
          <div v-for="color in switchColors" :key="`on-${color}`" class="flex justify-center">
            <USwitch :default-value="true" :color="(color as any)" />
          </div>
          <div class="text-xs font-medium text-muted whitespace-nowrap pe-3">
            off
          </div>
          <div v-for="color in switchColors" :key="`off-${color}`" class="flex justify-center">
            <USwitch :default-value="false" :color="(color as any)" />
          </div>
          <div class="text-xs font-medium text-muted whitespace-nowrap pe-3">
            disabled
          </div>
          <div v-for="color in switchColors" :key="`disabled-${color}`" class="flex justify-center">
            <USwitch :default-value="true" disabled :color="(color as any)" />
          </div>
        </div>
      </div>
    </section>

    <!-- Slider -->
    <section class="space-y-3">
      <h2 class="text-lg font-semibold text-strong">
        Slider
      </h2>
      <div class="overflow-x-auto">
        <div class="grid gap-3 items-center w-max" :style="gridStyle(sliderColors.length)">
          <div />
          <div v-for="color in sliderColors" :key="color" class="text-xs font-medium text-muted text-center capitalize">
            {{ color }}
          </div>
          <div class="text-xs font-medium text-muted whitespace-nowrap pe-3">
            slider
          </div>
          <div v-for="color in sliderColors" :key="`slider-${color}`" class="flex justify-center w-32">
            <USlider :default-value="50" :color="(color as any)" />
          </div>
        </div>
      </div>
    </section>

    <!-- Progress -->
    <section class="space-y-3">
      <h2 class="text-lg font-semibold text-strong">
        Progress
      </h2>
      <div class="overflow-x-auto">
        <div class="grid gap-3 items-center w-max" :style="gridStyle(progressColors.length)">
          <div />
          <div v-for="color in progressColors" :key="color" class="text-xs font-medium text-muted text-center capitalize">
            {{ color }}
          </div>
          <div class="text-xs font-medium text-muted whitespace-nowrap pe-3">
            progress
          </div>
          <div v-for="color in progressColors" :key="`progress-${color}`" class="flex justify-center w-32">
            <UProgress :model-value="65" :color="(color as any)" />
          </div>
          <template v-for="animation in progressAnimations" :key="animation">
            <div class="text-xs font-medium text-muted whitespace-nowrap pe-3">
              {{ animation }}
            </div>
            <div v-for="color in progressColors" :key="`${animation}-${color}`" class="flex justify-center w-32">
              <UProgress :model-value="null" :animation="(animation as any)" :color="(color as any)" />
            </div>
          </template>
        </div>
      </div>
    </section>

    <!-- Stepper -->
    <section class="space-y-3">
      <h2 class="text-lg font-semibold text-strong">
        Stepper
      </h2>
      <div class="overflow-x-auto">
        <div class="grid gap-3 items-center w-max" :style="gridStyle(stepperColors.length)">
          <div />
          <div v-for="color in stepperColors" :key="color" class="text-xs font-medium text-muted text-center capitalize">
            {{ color }}
          </div>
          <div class="text-xs font-medium text-muted whitespace-nowrap pe-3">
            stepper
          </div>
          <div v-for="color in stepperColors" :key="`stepper-${color}`" class="flex justify-center w-72">
            <UStepper :items="stepperItems" :default-value="1" :color="(color as any)" />
          </div>
        </div>
      </div>
    </section>

    <!-- Timeline -->
    <section class="space-y-3">
      <h2 class="text-lg font-semibold text-strong">
        Timeline
      </h2>
      <div class="overflow-x-auto">
        <div class="grid gap-3 items-start w-max" :style="gridStyle(timelineColors.length)">
          <div />
          <div v-for="color in timelineColors" :key="color" class="text-xs font-medium text-muted text-center capitalize">
            {{ color }}
          </div>
          <div class="text-xs font-medium text-muted whitespace-nowrap pe-3">
            timeline
          </div>
          <div v-for="color in timelineColors" :key="`timeline-${color}`" class="flex justify-center w-40">
            <UTimeline :items="timelineItems" :default-value="1" :color="(color as any)" />
          </div>
        </div>
      </div>
    </section>

    <!-- Tabs -->
    <section class="space-y-3">
      <h2 class="text-lg font-semibold text-strong">
        Tabs
      </h2>
      <div class="overflow-x-auto">
        <div class="grid gap-3 items-center w-max" :style="gridStyle(tabsColors.length)">
          <div />
          <div v-for="color in tabsColors" :key="color" class="text-xs font-medium text-muted text-center capitalize">
            {{ color }}
          </div>
          <template v-for="variant in tabsVariants" :key="variant">
            <div class="text-xs font-medium text-muted capitalize whitespace-nowrap pe-3">
              {{ variant }}
            </div>
            <div v-for="color in tabsColors" :key="`${variant}-${color}`" class="flex justify-center w-40">
              <UTabs :items="tabsItems" :content="false" :color="(color as any)" :variant="(variant as any)" />
            </div>
          </template>
        </div>
      </div>
    </section>

    <!-- Calendar -->
    <section class="space-y-3">
      <h2 class="text-lg font-semibold text-strong">
        Calendar
      </h2>
      <div class="overflow-x-auto">
        <div class="grid gap-3 items-start w-max" :style="gridStyle(calendarColors.length)">
          <div />
          <div v-for="color in calendarColors" :key="color" class="text-xs font-medium text-muted text-center capitalize">
            {{ color }}
          </div>
          <template v-for="variant in calendarVariants" :key="variant">
            <div class="text-xs font-medium text-muted capitalize whitespace-nowrap pe-3">
              {{ variant }}
            </div>
            <div v-for="color in calendarColors" :key="`${variant}-${color}`" class="flex justify-center">
              <UCalendar :model-value="calendarValue" :color="(color as any)" :variant="(variant as any)" />
            </div>
          </template>
        </div>
      </div>
    </section>

    <!-- Breadcrumb -->
    <section class="space-y-3">
      <h2 class="text-lg font-semibold text-strong">
        Breadcrumb
      </h2>
      <div class="overflow-x-auto">
        <div class="grid gap-x-3 gap-y-2 items-center w-max" :style="gridStyle(breadcrumbColors.length)">
          <div />
          <div v-for="color in breadcrumbColors" :key="color" class="text-xs font-medium text-muted text-center capitalize">
            {{ color }}
          </div>
          <div class="text-xs font-medium text-muted whitespace-nowrap pe-3">
            breadcrumb
          </div>
          <div v-for="color in breadcrumbColors" :key="`breadcrumb-${color}`" class="flex justify-center">
            <UBreadcrumb :items="breadcrumbItems" :color="(color as any)" />
          </div>
        </div>
      </div>
    </section>

    <!-- NavigationMenu (with highlight + highlightColor) -->
    <section class="space-y-3">
      <h2 class="text-lg font-semibold text-strong">
        NavigationMenu
      </h2>
      <div class="overflow-x-auto">
        <div class="grid gap-x-3 gap-y-2 items-center w-max" :style="gridStyle(navigationMenuColors.length)">
          <div />
          <div v-for="color in navigationMenuColors" :key="color" class="text-xs font-medium text-muted text-center capitalize">
            {{ color }}
          </div>
          <div class="text-xs font-medium text-muted whitespace-nowrap pe-3">
            highlight
          </div>
          <div v-for="color in navigationMenuColors" :key="`nav-${color}`" class="flex justify-center w-40">
            <UNavigationMenu
              :items="navigationMenuItems"
              orientation="vertical"
              highlight
              :highlight-color="(color as any)"
              class="w-full"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Tree (with a selected item) -->
    <section class="space-y-3">
      <h2 class="text-lg font-semibold text-strong">
        Tree
      </h2>
      <div class="overflow-x-auto">
        <div class="grid gap-x-3 gap-y-2 items-center w-max" :style="gridStyle(treeColors.length)">
          <div />
          <div v-for="color in treeColors" :key="color" class="text-xs font-medium text-muted text-center capitalize">
            {{ color }}
          </div>
          <div class="text-xs font-medium text-muted whitespace-nowrap pe-3">
            tree
          </div>
          <div v-for="color in treeColors" :key="`tree-${color}`" class="flex justify-center w-40">
            <UTree :items="treeItems" :default-value="treeItems[0]" :color="(color as any)" />
          </div>
        </div>
      </div>
    </section>

    <!-- PageCard (highlight + highlightColor, spotlight + spotlightColor) -->
    <section class="space-y-3">
      <h2 class="text-lg font-semibold text-strong">
        PageCard
      </h2>
      <div class="overflow-x-auto">
        <div class="grid gap-3 items-center w-max" :style="gridStyle(pageCardHighlightColors.length)">
          <div />
          <div v-for="color in pageCardHighlightColors" :key="color" class="text-xs font-medium text-muted text-center capitalize">
            {{ color }}
          </div>

          <div class="text-xs font-medium text-muted whitespace-nowrap pe-3">
            highlight
          </div>
          <div v-for="color in pageCardHighlightColors" :key="`highlight-${color}`" class="flex justify-center w-48">
            <UPageCard title="Highlighted" description="Card with highlight." highlight :highlight-color="(color as any)" />
          </div>

          <div class="text-xs font-medium text-muted whitespace-nowrap pe-3">
            spotlight
          </div>
          <div v-for="color in pageCardSpotlightColors" :key="`spotlight-${color}`" class="flex justify-center w-48">
            <UPageCard title="Spotlight" description="Card with spotlight." spotlight :spotlight-color="(color as any)" />
          </div>
        </div>
      </div>
    </section>

    <!-- ChatMessage -->
    <section class="space-y-3">
      <h2 class="text-lg font-semibold text-strong">
        ChatMessage
      </h2>
      <div class="overflow-x-auto">
        <div class="grid gap-3 items-start w-max" :style="gridStyle(chatMessageColors.length)">
          <div />
          <div v-for="color in chatMessageColors" :key="color" class="text-xs font-medium text-muted text-center capitalize">
            {{ color }}
          </div>
          <template v-for="variant in chatMessageVariants" :key="variant">
            <div class="text-xs font-medium text-muted capitalize whitespace-nowrap pe-3">
              {{ variant }}
            </div>
            <div v-for="color in chatMessageColors" :key="`${variant}-${color}`" class="flex justify-center w-56">
              <UChatMessage
                id="1"
                role="assistant"
                :parts="[{ type: 'text', text: `${color} / ${variant}` }]"
                icon="i-lucide-bot"
                :color="(color as any)"
                :variant="(variant as any)"
              />
            </div>
          </template>
        </div>
      </div>
    </section>

    <!-- Form controls: every variant plus `highlight` -->
    <section v-for="field in fields" :key="field.name" class="space-y-3">
      <h2 class="text-lg font-semibold text-strong">
        {{ field.name }}
      </h2>
      <div class="overflow-x-auto">
        <div class="grid gap-x-3 gap-y-2 items-center w-max" :style="gridStyle(field.colors.length)">
          <div />
          <div v-for="color in field.colors" :key="color" class="text-xs font-medium text-muted text-center capitalize">
            {{ color }}
          </div>
          <template v-for="row in [...field.variants, 'highlight']" :key="row">
            <div class="text-xs font-medium text-muted capitalize whitespace-nowrap pe-3">
              {{ row }}
            </div>
            <div v-for="color in field.colors" :key="`${row}-${color}`" class="flex justify-center w-36">
              <UInput v-if="field.name === 'Input'" :placeholder="row" :color="(color as any)" :variant="row === 'highlight' ? undefined : (row as any)" :highlight="row === 'highlight'" />
              <UTextarea
                v-else-if="field.name === 'Textarea'"
                :placeholder="row"
                :rows="1"
                :color="(color as any)"
                :variant="row === 'highlight' ? undefined : (row as any)"
                :highlight="row === 'highlight'"
              />
              <USelect
                v-else-if="field.name === 'Select'"
                :placeholder="row"
                :items="selectItems"
                :color="(color as any)"
                :variant="row === 'highlight' ? undefined : (row as any)"
                :highlight="row === 'highlight'"
              />
              <UInputNumber v-else-if="field.name === 'InputNumber'" :default-value="50" :color="(color as any)" :variant="row === 'highlight' ? undefined : (row as any)" :highlight="row === 'highlight'" />
              <UPinInput
                v-else-if="field.name === 'PinInput'"
                :length="3"
                placeholder="○"
                :color="(color as any)"
                :variant="row === 'highlight' ? undefined : (row as any)"
                :highlight="row === 'highlight'"
              />
              <UInputDate v-else-if="field.name === 'InputDate'" :color="(color as any)" :variant="row === 'highlight' ? undefined : (row as any)" :highlight="row === 'highlight'" />
              <UInputTime v-else :color="(color as any)" :variant="row === 'highlight' ? undefined : (row as any)" :highlight="row === 'highlight'" />
            </div>
          </template>
        </div>
      </div>
    </section>

    <section class="space-y-3">
      <h2 class="text-lg font-semibold text-strong">
        FileUpload
      </h2>
      <div class="overflow-x-auto">
        <div class="grid gap-x-3 gap-y-2 items-center w-max" :style="gridStyle(fileUploadColors.length)">
          <div />
          <div v-for="color in fileUploadColors" :key="color" class="text-xs font-medium text-muted text-center capitalize">
            {{ color }}
          </div>
          <template v-for="row in [...fileUploadVariants, 'highlight']" :key="row">
            <div class="text-xs font-medium text-muted capitalize whitespace-nowrap pe-3">
              {{ row }}
            </div>
            <div v-for="color in fileUploadColors" :key="`file-upload-${row}-${color}`" class="flex justify-center w-40">
              <UFileUpload label="Drop files" :color="(color as any)" :variant="row === 'highlight' ? undefined : (row as any)" :highlight="row === 'highlight'" />
            </div>
          </template>
        </div>
      </div>
    </section>

    <!-- ChatPrompt -->
    <section class="space-y-3">
      <h2 class="text-lg font-semibold text-strong">
        ChatPrompt
      </h2>
      <div class="overflow-x-auto">
        <div class="grid gap-3 items-start w-max" :style="gridStyle(chatPromptColors.length)">
          <div />
          <div v-for="color in chatPromptColors" :key="color" class="text-xs font-medium text-muted text-center capitalize">
            {{ color }}
          </div>
          <template v-for="variant in chatPromptVariants" :key="variant">
            <div class="text-xs font-medium text-muted capitalize whitespace-nowrap pe-3">
              {{ variant }}
            </div>
            <div v-for="color in chatPromptColors" :key="`${variant}-${color}`" class="flex justify-center w-56">
              <UChatPrompt :placeholder="variant" :color="(color as any)" :variant="(variant as any)" :autofocus="false" />
            </div>
          </template>
        </div>
      </div>
    </section>

    <!-- Other color-aware components -->
    <section class="space-y-3">
      <h2 class="text-lg font-semibold text-strong">
        InputRating, Listbox, ProgressGroup, AvatarGroup
      </h2>
      <div class="overflow-x-auto">
        <div class="grid gap-3 items-center w-max" :style="gridStyle(inputRatingColors.length)">
          <div />
          <div v-for="color in inputRatingColors" :key="color" class="text-xs font-medium text-muted text-center capitalize">
            {{ color }}
          </div>
          <div class="text-xs font-medium text-muted whitespace-nowrap pe-3">
            input rating
          </div>
          <div v-for="color in inputRatingColors" :key="`rating-${color}`" class="flex justify-center">
            <UInputRating :default-value="3" :color="(color as any)" />
          </div>
          <div class="text-xs font-medium text-muted whitespace-nowrap pe-3">
            listbox
          </div>
          <div v-for="color in listboxColors" :key="`listbox-${color}`" class="flex justify-center w-36">
            <UListbox :items="selectItems.map(label => ({ label, value: label }))" value-key="value" default-value="Banana" :color="(color as any)" class="w-full" />
          </div>
          <div class="text-xs font-medium text-muted whitespace-nowrap pe-3">
            progress group
          </div>
          <div v-for="color in progressGroupColors" :key="`progress-group-${color}`" class="flex justify-center w-36">
            <UProgressGroup :items="progressGroupItems" :color="(color as any)" class="w-full" />
          </div>
          <div class="text-xs font-medium text-muted whitespace-nowrap pe-3">
            avatar group
          </div>
          <div v-for="color in avatarGroupColors" :key="`avatar-group-${color}`" class="flex justify-center">
            <UAvatarGroup :color="(color as any)">
              <UAvatar text="AB" />
              <UAvatar text="CD" />
            </UAvatarGroup>
          </div>
        </div>
      </div>
    </section>

    <!-- Table loading bar -->
    <section class="space-y-3">
      <h2 class="text-lg font-semibold text-strong">
        Table (loading-color)
      </h2>
      <div class="grid sm:grid-cols-2 gap-3">
        <UTable
          v-for="color in tableLoadingColors"
          :key="color"
          :data="[]"
          :columns="[{ accessorKey: 'name', header: color }]"
          loading
          :loading-color="(color as any)"
        />
      </div>
    </section>

    <!-- DropdownMenu: items carry a color each -->
    <section class="space-y-3">
      <h2 class="text-lg font-semibold text-strong">
        DropdownMenu
      </h2>
      <UDropdownMenu :items="dropdownMenuItems">
        <UButton label="Open" color="neutral" variant="outline" icon="i-lucide-menu" />
      </UDropdownMenu>
    </section>

    <!-- ContextMenu: items carry a color each -->
    <section class="space-y-3">
      <h2 class="text-lg font-semibold text-strong">
        ContextMenu
      </h2>
      <UContextMenu :items="contextMenuItems">
        <div class="flex items-center justify-center rounded-md border border-dashed border-strong text-sm aspect-video w-72">
          Right click here
        </div>
      </UContextMenu>
    </section>

    <!-- Prose (ProseCallout, ProseCode, ProseCard) -->
    <section class="space-y-3">
      <h2 class="text-lg font-semibold text-strong">
        Prose Callout
      </h2>
      <div class="flex flex-col gap-2 max-w-lg *:my-0">
        <ProseCallout v-for="color in calloutColors" :key="color" :color="(color as any)">
          This is a {{ color }} callout.
        </ProseCallout>
      </div>
    </section>

    <section class="space-y-3">
      <h2 class="text-lg font-semibold text-strong">
        Prose Card
      </h2>
      <div class="grid sm:grid-cols-3 gap-3 *:my-0">
        <ProseCard
          v-for="color in calloutColors"
          :key="color"
          :title="`${color} card`"
          icon="i-lucide-box"
          to="#"
          :color="(color as any)"
        >
          A prose card.
        </ProseCard>
      </div>
    </section>

    <section class="space-y-3">
      <h2 class="text-lg font-semibold text-strong">
        Prose Code
      </h2>
      <div class="flex flex-wrap gap-2">
        <ProseCode v-for="color in codeColors" :key="color" :color="(color as any)">
          {{ color }}
        </ProseCode>
      </div>
    </section>
  </div>
</template>
