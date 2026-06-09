<script setup lang="ts">
import buttonTheme from '#build/ui/button'
import inputTheme from '#build/ui/input'
import {
  UInput,
  UTextarea,
  USelect,
  USelectMenu,
  UInputMenu,
  UInputNumber,
  UInputTags,
  UInputDate,
  UInputTime,
  UPinInput,
  UCheckbox,
  USwitch,
  URadioGroup,
  UCheckboxGroup,
  USlider
} from '#components'
import { CalendarDate } from '@internationalized/date'

const defaultDate = shallowRef(new CalendarDate(2026, 6, 9))

// https://github.com/nuxt/ui/issues/6066
// Page to compare and uniformize `focus-visible` styles across components,
// variants and colors. Tab through the controls to inspect each focus ring.

const colors = Object.keys(buttonTheme.variants.color)
const buttonVariants = Object.keys(buttonTheme.variants.variant)
const inputVariants = Object.keys(inputTheme.variants.variant)

const selectedColors = ref<string[]>(['primary', 'error', 'neutral'])

const activeColors = computed(() => colors.filter(color => selectedColors.value.includes(color)))

const items = ['Backlog', 'Todo', 'In Progress']

// Input-style components: all share the `outline / soft / subtle / ghost / none`
// variant set and the same focus behavior (ring on outline/subtle, bg on the rest).
const inputFields = [
  { label: 'Input', is: UInput, props: { placeholder: 'Input', class: 'w-36' } },
  { label: 'Textarea', is: UTextarea, props: { rows: 1, placeholder: 'Textarea', class: 'w-36' } },
  { label: 'Select', is: USelect, props: { items, placeholder: 'Select', class: 'w-36' } },
  { label: 'SelectMenu', is: USelectMenu, props: { items, placeholder: 'SelectMenu', class: 'w-36' } },
  { label: 'InputMenu', is: UInputMenu, props: { items, placeholder: 'InputMenu', class: 'w-36' } },
  { label: 'InputNumber', is: UInputNumber, props: { placeholder: 'Number', class: 'w-32' } },
  { label: 'InputTags', is: UInputTags, props: { defaultValue: ['Tag'], class: 'w-36' } },
  { label: 'InputDate', is: UInputDate, props: { class: 'w-36' } },
  { label: 'InputTime', is: UInputTime, props: { class: 'w-36' } },
  { label: 'PinInput', is: UPinInput, props: { length: 3 } }
]

// Color-only components (no variant prop).
const toggleFields = [
  { label: 'Checkbox', is: UCheckbox, props: { defaultValue: true, label: 'Checkbox' } },
  { label: 'Switch', is: USwitch, props: { defaultValue: true, label: 'Switch' } },
  { label: 'RadioGroup', is: URadioGroup, props: { items: ['One', 'Two'], defaultValue: 'One' } },
  { label: 'CheckboxGroup', is: UCheckboxGroup, props: { items: ['One', 'Two'], defaultValue: ['One'] } },
  { label: 'Slider', is: USlider, props: { defaultValue: 50, class: 'w-40' } }
]

const tabItems = [
  { label: 'Account', icon: 'i-lucide-user' },
  { label: 'Password', icon: 'i-lucide-lock' }
]

const accordionItems = [
  { label: 'First', icon: 'i-lucide-info', content: 'Lorem ipsum dolor sit amet.' },
  { label: 'Second', icon: 'i-lucide-download', content: 'Lorem ipsum dolor sit amet.' }
]

const breadcrumbItems = [
  { label: 'Home', icon: 'i-lucide-house' },
  { label: 'Components' },
  { label: 'Focus' }
]

const navigationItems = [
  { label: 'Docs', icon: 'i-lucide-book' },
  { label: 'Components', icon: 'i-lucide-box' }
]

const treeItems = [
  { label: 'app', icon: 'i-lucide-folder', defaultExpanded: true, children: [{ label: 'index.vue', icon: 'i-lucide-file' }, { label: 'app.vue', icon: 'i-lucide-file' }] }
]

const stepperItems = [
  { title: 'Address', icon: 'i-lucide-map-pin' },
  { title: 'Shipping', icon: 'i-lucide-truck' },
  { title: 'Payment', icon: 'i-lucide-credit-card' }
]

// "Show all focus rings": force the `focus-visible` treatment on every control
// at once so rings can be compared without tabbing through them one by one.
// We can't fake `:focus-visible`, so under `.force-focus` we re-apply the same
// outcome by matching the utility tokens (covers `focus:`, `focus-visible:` and
// `has-focus-visible:` prefixes via substring match):
//   - force the outline halo to render (color is already preset at rest)
//   - recolor the border ring to the control's semantic color
const forceFocus = ref(true)

const forceFocusCss = [
  '.force-focus :is([class*=":outline-3"]):not([class*=":before:outline-3"]) { outline-width: 3px !important; outline-style: solid !important; }',
  // before-highlight families (NavigationMenu, Tree, ...) put the halo on `::before`
  '.force-focus :is([class*=":before:outline-3"])::before { outline-width: 3px !important; outline-style: solid !important; }',
  // Preserve the outline offset on controls that use it (e.g. Slider thumb)
  '.force-focus :is([class*=":outline-offset-2"]) { outline-offset: 2px !important; }',
  // Force the inset border ring to render on variants that only add it on focus
  // (solid/soft/ghost). Variants with a resting ring just get recolored below.
  '.force-focus :is([class~="focus-visible:ring"]) { box-shadow: inset 0 0 0 1px var(--tw-ring-color) !important; }',
  ...colors.map((color) => {
    const token = color === 'neutral' ? ':ring-inverted' : `:ring-${color}`
    const value = color === 'neutral' ? 'var(--ui-border-inverted)' : `var(--ui-${color})`
    return `.force-focus :is([class*="${token}"]) { --tw-ring-color: ${value} !important; }`
  }),
  // Recolor the real `border` on variants that recolor it on focus (e.g. FileUpload)
  ...colors.map((color) => {
    const token = color === 'neutral' ? 'inverted' : color
    const value = color === 'neutral' ? 'var(--ui-border-inverted)' : `var(--ui-${color})`
    return `.force-focus :is([class*="focus-visible:border-${token}"]) { border-color: ${value} !important; }`
  }),
  // Don't force-focus nested controls like InputNumber's increment/decrement buttons
  '.force-focus :is([data-slot="increment"],[data-slot="decrement"]) :is([class*=":outline-3"],[class~="focus-visible:ring"]) { outline-width: 0 !important; box-shadow: none !important; }'
].join('\n')

useHead({
  style: [{ id: 'focus-force-style', innerHTML: forceFocusCss }]
})
</script>

<template>
  <div class="flex flex-col gap-10 p-8" :class="{ 'force-focus': forceFocus }">
    <header class="flex flex-col gap-2">
      <h1 class="text-2xl font-bold text-highlighted">
        Focus styles
      </h1>
      <p class="text-muted text-sm max-w-2xl">
        Tab through the components below to compare <code class="text-primary">focus-visible</code> styles across every
        variant and color. The goal is to uniformize focus rings, see
        <ULink to="https://github.com/nuxt/ui/issues/6066" target="_blank" class="text-primary">#6066</ULink>.
      </p>

      <div class="flex flex-wrap items-center gap-4 mt-2">
        <USelect v-model="selectedColors" :items="colors" multiple placeholder="Colors" class="w-72" />
        <USwitch v-model="forceFocus" label="Show all focus rings" />
      </div>
    </header>

    <!-- Button -->
    <section class="flex flex-col gap-4">
      <h2 class="text-lg font-semibold text-highlighted">
        Button
      </h2>
      <div class="overflow-x-auto">
        <table class="border-separate border-spacing-3">
          <thead>
            <tr>
              <th class="text-left text-xs font-medium text-dimmed" />
              <th v-for="variant in buttonVariants" :key="variant" class="text-left text-xs font-medium text-dimmed capitalize">
                {{ variant }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="color in activeColors" :key="color">
              <td class="text-xs font-medium text-dimmed capitalize pr-2">
                {{ color }}
              </td>
              <td v-for="variant in buttonVariants" :key="variant">
                <UButton :color="color" :variant="variant" label="Button" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Inputs -->
    <section class="flex flex-col gap-8">
      <h2 class="text-lg font-semibold text-highlighted">
        Inputs
      </h2>

      <div v-for="field in inputFields" :key="field.label" class="flex flex-col gap-2">
        <h3 class="text-sm font-medium text-default">
          {{ field.label }}
        </h3>
        <div class="overflow-x-auto">
          <table class="border-separate border-spacing-3">
            <thead>
              <tr>
                <th class="text-left text-xs font-medium text-dimmed" />
                <th v-for="variant in inputVariants" :key="variant" class="text-left text-xs font-medium text-dimmed capitalize">
                  {{ variant }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="color in activeColors" :key="color">
                <td class="text-xs font-medium text-dimmed capitalize pr-2">
                  {{ color }}
                </td>
                <td v-for="variant in inputVariants" :key="variant" class="align-top">
                  <component :is="field.is" :color="color" :variant="variant" v-bind="field.props" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- Toggles -->
    <section class="flex flex-col gap-6">
      <h2 class="text-lg font-semibold text-highlighted">
        Toggles
      </h2>

      <div v-for="field in toggleFields" :key="field.label" class="flex flex-col gap-2">
        <span class="text-xs font-medium text-dimmed">{{ field.label }}</span>
        <div class="flex flex-wrap items-center gap-6">
          <component :is="field.is" v-for="color in activeColors" :key="color" :color="color" v-bind="field.props" />
        </div>
      </div>
    </section>

    <!-- Other -->
    <section class="flex flex-col gap-6">
      <h2 class="text-lg font-semibold text-highlighted">
        Other
      </h2>

      <div class="flex flex-col gap-2">
        <span class="text-xs font-medium text-dimmed">FileUpload</span>
        <div class="flex flex-wrap gap-4">
          <UFileUpload v-for="color in activeColors" :key="color" :color="color" class="w-40 h-24" />
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <span class="text-xs font-medium text-dimmed">Tabs (pill)</span>
        <div class="flex flex-wrap gap-4">
          <UTabs
            v-for="color in activeColors"
            :key="color"
            :color="color"
            variant="pill"
            :items="tabItems"
            :content="false"
          />
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <span class="text-xs font-medium text-dimmed">Tabs (link)</span>
        <div class="flex flex-wrap gap-4">
          <UTabs
            v-for="color in activeColors"
            :key="color"
            :color="color"
            variant="link"
            :items="tabItems"
            :content="false"
          />
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <span class="text-xs font-medium text-dimmed">Accordion</span>
        <UAccordion :items="accordionItems" class="w-96" />
      </div>

      <div class="flex flex-col gap-2">
        <span class="text-xs font-medium text-dimmed">Link (no color/variant — bare <code class="text-primary">outline-primary</code>)</span>
        <div class="flex flex-wrap items-center gap-6">
          <ULink to="#active" active>
            Active
          </ULink>
          <ULink to="#inactive">
            Inactive
          </ULink>
          <ULink to="#disabled" disabled>
            Disabled
          </ULink>
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <span class="text-xs font-medium text-dimmed">Breadcrumb</span>
        <div class="flex flex-col gap-3">
          <UBreadcrumb v-for="color in activeColors" :key="color" :color="color" :items="breadcrumbItems" />
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <span class="text-xs font-medium text-dimmed">NavigationMenu</span>
        <div class="flex flex-wrap gap-4">
          <UNavigationMenu v-for="color in activeColors" :key="color" :color="color" :items="navigationItems" />
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <span class="text-xs font-medium text-dimmed">Tree</span>
        <div class="flex flex-wrap gap-4">
          <UTree v-for="color in activeColors" :key="color" :color="color" :items="treeItems" class="w-48" />
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <span class="text-xs font-medium text-dimmed">Stepper</span>
        <div class="flex flex-col gap-4">
          <UStepper v-for="color in activeColors" :key="color" :color="color" :items="stepperItems" class="w-96" />
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <span class="text-xs font-medium text-dimmed">Calendar</span>
        <div class="flex flex-wrap gap-4">
          <UCalendar v-for="color in activeColors" :key="color" :default-value="defaultDate" :color="color" />
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <span class="text-xs font-medium text-dimmed">Carousel</span>
        <UCarousel
          v-slot="{ item }"
          :items="[1, 2, 3, 4, 5]"
          :ui="{ item: 'basis-1/3' }"
          arrows
          dots
          class="w-80 mb-4"
        >
          <div class="bg-elevated rounded-md flex items-center justify-center size-20 text-2xl font-bold">
            {{ item }}
          </div>
        </UCarousel>
      </div>
    </section>
  </div>
</template>
