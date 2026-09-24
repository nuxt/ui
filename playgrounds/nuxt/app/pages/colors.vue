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
import calloutTheme from '#build/ui/prose/callout'
import codeTheme from '#build/ui/prose/code'

// Compact grid: header row of color names, one row per variant (or relevant boolean).
function gridStyle(n: number) {
  return { gridTemplateColumns: `max-content repeat(${n}, minmax(0, 1fr))` }
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

// Form controls with `highlight`
const inputColors = Object.keys(inputTheme.variants.color)
const textareaColors = Object.keys(textareaTheme.variants.color)
const selectColors = Object.keys(selectTheme.variants.color)
const selectItems = ['Apple', 'Banana', 'Blueberry']
const inputNumberColors = Object.keys(inputNumberTheme.variants.color)
const pinInputColors = Object.keys(pinInputTheme.variants.color)
const fileUploadColors = Object.keys(fileUploadTheme.variants.color)

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

// Prose
const calloutColors = Object.keys(calloutTheme.variants.color)
const codeColors = Object.keys(codeTheme.variants.color)
</script>

<template>
  <UDashboardNavbar title="Colors" class="absolute top-0 inset-x-0 lg:border-b-0" />

  <div class="flex flex-col gap-10 min-h-0 w-full max-w-full pt-16 pb-10 px-4">
    <p class="max-w-lg text-muted">
      Every color-aware component, in every configured color (including neutral), across its variants. Toggle dark mode to check both themes.
    </p>

    <!-- Button -->
    <section class="space-y-3">
      <h2 class="text-lg font-semibold text-highlighted">
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
      <h2 class="text-lg font-semibold text-highlighted">
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
      <h2 class="text-lg font-semibold text-highlighted">
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
      <h2 class="text-lg font-semibold text-highlighted">
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
      <h2 class="text-lg font-semibold text-highlighted">
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
      <h2 class="text-lg font-semibold text-highlighted">
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
            <UChip text="1" :color="(color as any)">
              <UAvatar src="https://github.com/benjamincanac.png" />
            </UChip>
          </div>
        </div>
      </div>
    </section>

    <!-- Banner -->
    <section class="space-y-3">
      <h2 class="text-lg font-semibold text-highlighted">
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
      <h2 class="text-lg font-semibold text-highlighted">
        Separator
      </h2>
      <div class="overflow-x-auto">
        <div class="grid gap-x-3 gap-y-3 items-center w-max" :style="gridStyle(separatorColors.length)">
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
      <h2 class="text-lg font-semibold text-highlighted">
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
      <h2 class="text-lg font-semibold text-highlighted">
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
        </div>
      </div>
    </section>

    <!-- RadioGroup -->
    <section class="space-y-3">
      <h2 class="text-lg font-semibold text-highlighted">
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
      <h2 class="text-lg font-semibold text-highlighted">
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
      <h2 class="text-lg font-semibold text-highlighted">
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
        </div>
      </div>
    </section>

    <!-- Slider -->
    <section class="space-y-3">
      <h2 class="text-lg font-semibold text-highlighted">
        Slider
      </h2>
      <div class="overflow-x-auto">
        <div class="grid gap-x-3 gap-y-3 items-center w-max" :style="gridStyle(sliderColors.length)">
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
      <h2 class="text-lg font-semibold text-highlighted">
        Progress
      </h2>
      <div class="overflow-x-auto">
        <div class="grid gap-x-3 gap-y-3 items-center w-max" :style="gridStyle(progressColors.length)">
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
        </div>
      </div>
    </section>

    <!-- Stepper -->
    <section class="space-y-3">
      <h2 class="text-lg font-semibold text-highlighted">
        Stepper
      </h2>
      <div class="overflow-x-auto">
        <div class="grid gap-x-3 gap-y-3 items-center w-max" :style="gridStyle(stepperColors.length)">
          <div />
          <div v-for="color in stepperColors" :key="color" class="text-xs font-medium text-muted text-center capitalize">
            {{ color }}
          </div>
          <div class="text-xs font-medium text-muted whitespace-nowrap pe-3">
            stepper
          </div>
          <div v-for="color in stepperColors" :key="`stepper-${color}`" class="flex justify-center w-56">
            <UStepper :items="stepperItems" default-value="1" :color="(color as any)" />
          </div>
        </div>
      </div>
    </section>

    <!-- Timeline -->
    <section class="space-y-3">
      <h2 class="text-lg font-semibold text-highlighted">
        Timeline
      </h2>
      <div class="overflow-x-auto">
        <div class="grid gap-x-3 gap-y-3 items-start w-max" :style="gridStyle(timelineColors.length)">
          <div />
          <div v-for="color in timelineColors" :key="color" class="text-xs font-medium text-muted text-center capitalize">
            {{ color }}
          </div>
          <div class="text-xs font-medium text-muted whitespace-nowrap pe-3">
            timeline
          </div>
          <div v-for="color in timelineColors" :key="`timeline-${color}`" class="flex justify-center w-40">
            <UTimeline :items="timelineItems" default-value="0" :color="(color as any)" />
          </div>
        </div>
      </div>
    </section>

    <!-- Tabs -->
    <section class="space-y-3">
      <h2 class="text-lg font-semibold text-highlighted">
        Tabs
      </h2>
      <div class="overflow-x-auto">
        <div class="grid gap-x-3 gap-y-3 items-center w-max" :style="gridStyle(tabsColors.length)">
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
      <h2 class="text-lg font-semibold text-highlighted">
        Calendar
      </h2>
      <div class="overflow-x-auto">
        <div class="grid gap-x-3 gap-y-3 items-start w-max" :style="gridStyle(calendarColors.length)">
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
      <h2 class="text-lg font-semibold text-highlighted">
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
      <h2 class="text-lg font-semibold text-highlighted">
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
      <h2 class="text-lg font-semibold text-highlighted">
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
      <h2 class="text-lg font-semibold text-highlighted">
        PageCard
      </h2>
      <div class="overflow-x-auto">
        <div class="grid gap-x-3 gap-y-3 items-center w-max" :style="gridStyle(pageCardHighlightColors.length)">
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
      <h2 class="text-lg font-semibold text-highlighted">
        ChatMessage
      </h2>
      <div class="overflow-x-auto">
        <div class="grid gap-x-3 gap-y-3 items-start w-max" :style="gridStyle(chatMessageColors.length)">
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

    <!-- Form controls with `highlight` -->
    <section class="space-y-3">
      <h2 class="text-lg font-semibold text-highlighted">
        Input
      </h2>
      <div class="overflow-x-auto">
        <div class="grid gap-x-3 gap-y-2 items-center w-max" :style="gridStyle(inputColors.length)">
          <div />
          <div v-for="color in inputColors" :key="color" class="text-xs font-medium text-muted text-center capitalize">
            {{ color }}
          </div>
          <div class="text-xs font-medium text-muted whitespace-nowrap pe-3">
            highlight
          </div>
          <div v-for="color in inputColors" :key="`input-${color}`" class="flex justify-center w-32">
            <UInput placeholder="Highlight" highlight :color="(color as any)" />
          </div>
        </div>
      </div>
    </section>

    <section class="space-y-3">
      <h2 class="text-lg font-semibold text-highlighted">
        Textarea
      </h2>
      <div class="overflow-x-auto">
        <div class="grid gap-x-3 gap-y-2 items-center w-max" :style="gridStyle(textareaColors.length)">
          <div />
          <div v-for="color in textareaColors" :key="color" class="text-xs font-medium text-muted text-center capitalize">
            {{ color }}
          </div>
          <div class="text-xs font-medium text-muted whitespace-nowrap pe-3">
            highlight
          </div>
          <div v-for="color in textareaColors" :key="`textarea-${color}`" class="flex justify-center w-32">
            <UTextarea placeholder="Highlight" highlight :rows="1" :color="(color as any)" />
          </div>
        </div>
      </div>
    </section>

    <section class="space-y-3">
      <h2 class="text-lg font-semibold text-highlighted">
        Select
      </h2>
      <div class="overflow-x-auto">
        <div class="grid gap-x-3 gap-y-2 items-center w-max" :style="gridStyle(selectColors.length)">
          <div />
          <div v-for="color in selectColors" :key="color" class="text-xs font-medium text-muted text-center capitalize">
            {{ color }}
          </div>
          <div class="text-xs font-medium text-muted whitespace-nowrap pe-3">
            highlight
          </div>
          <div v-for="color in selectColors" :key="`select-${color}`" class="flex justify-center w-32">
            <USelect placeholder="Highlight" highlight :items="selectItems" :color="(color as any)" />
          </div>
        </div>
      </div>
    </section>

    <section class="space-y-3">
      <h2 class="text-lg font-semibold text-highlighted">
        InputNumber
      </h2>
      <div class="overflow-x-auto">
        <div class="grid gap-x-3 gap-y-2 items-center w-max" :style="gridStyle(inputNumberColors.length)">
          <div />
          <div v-for="color in inputNumberColors" :key="color" class="text-xs font-medium text-muted text-center capitalize">
            {{ color }}
          </div>
          <div class="text-xs font-medium text-muted whitespace-nowrap pe-3">
            highlight
          </div>
          <div v-for="color in inputNumberColors" :key="`input-number-${color}`" class="flex justify-center w-32">
            <UInputNumber :default-value="50" highlight :color="(color as any)" />
          </div>
        </div>
      </div>
    </section>

    <section class="space-y-3">
      <h2 class="text-lg font-semibold text-highlighted">
        PinInput
      </h2>
      <div class="overflow-x-auto">
        <div class="grid gap-x-3 gap-y-2 items-center w-max" :style="gridStyle(pinInputColors.length)">
          <div />
          <div v-for="color in pinInputColors" :key="color" class="text-xs font-medium text-muted text-center capitalize">
            {{ color }}
          </div>
          <div class="text-xs font-medium text-muted whitespace-nowrap pe-3">
            highlight
          </div>
          <div v-for="color in pinInputColors" :key="`pin-input-${color}`" class="flex justify-center">
            <UPinInput placeholder="○" highlight :color="(color as any)" />
          </div>
        </div>
      </div>
    </section>

    <section class="space-y-3">
      <h2 class="text-lg font-semibold text-highlighted">
        FileUpload
      </h2>
      <div class="overflow-x-auto">
        <div class="grid gap-x-3 gap-y-2 items-center w-max" :style="gridStyle(fileUploadColors.length)">
          <div />
          <div v-for="color in fileUploadColors" :key="color" class="text-xs font-medium text-muted text-center capitalize">
            {{ color }}
          </div>
          <div class="text-xs font-medium text-muted whitespace-nowrap pe-3">
            highlight
          </div>
          <div v-for="color in fileUploadColors" :key="`file-upload-${color}`" class="flex justify-center w-40">
            <UFileUpload label="Drop files" highlight :color="(color as any)" />
          </div>
        </div>
      </div>
    </section>

    <!-- DropdownMenu: items carry a color each -->
    <section class="space-y-3">
      <h2 class="text-lg font-semibold text-highlighted">
        DropdownMenu
      </h2>
      <UDropdownMenu :items="dropdownMenuItems">
        <UButton label="Open" color="neutral" variant="outline" icon="i-lucide-menu" />
      </UDropdownMenu>
    </section>

    <!-- ContextMenu: items carry a color each -->
    <section class="space-y-3">
      <h2 class="text-lg font-semibold text-highlighted">
        ContextMenu
      </h2>
      <UContextMenu :items="contextMenuItems">
        <div class="flex items-center justify-center rounded-md border border-dashed border-accented text-sm aspect-video w-72">
          Right click here
        </div>
      </UContextMenu>
    </section>

    <!-- Prose (ProseCallout, ProseCode) -->
    <section class="space-y-3">
      <h2 class="text-lg font-semibold text-highlighted">
        Prose Callout
      </h2>
      <div class="flex flex-col gap-2 max-w-lg">
        <ProseCallout v-for="color in calloutColors" :key="color" :color="(color as any)">
          This is a {{ color }} callout.
        </ProseCallout>
      </div>
    </section>

    <section class="space-y-3">
      <h2 class="text-lg font-semibold text-highlighted">
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
