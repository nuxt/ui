<script setup lang="ts">
import { ref, computed } from 'vue'
import * as ui from '#build/ui'
import { pascalCase } from 'scule'
import { updateAppConfig } from '#app'
import { definePageMeta, resolveComponent } from '#imports'

definePageMeta({
  layout: false
})

const componentExample = {
  accordion: {
    component: resolveComponent('UAccordion'),
    props: {
      items: [
        {
          label: 'Getting Started',
          icon: 'i-heroicons-information-circle',
          content:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
        },
        {
          label: 'Installation',
          icon: 'i-heroicons-arrow-down-tray',
          disabled: true,
          content:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
        },
        {
          label: 'Theming',
          icon: 'i-heroicons-eye-dropper',
          content:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
        },
        {
          label: 'Layouts',
          icon: 'i-heroicons-rectangle-group',
          content:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
        },
        {
          label: 'Components',
          icon: 'i-heroicons-square-3-stack-3d',
          content:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
        },
        {
          label: 'Utilities',
          slot: 'custom' as const,
          icon: 'i-heroicons-wrench-screwdriver',
          content:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem nec arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.'
        }
      ]
    }
  },
  alert: {
    component: resolveComponent('UAlert'),
    props: {
      title: 'Heads up!',
      description: 'You can change the primary color in your app config.',
      icon: 'i-heroicons-command-line',
      close: true
    }
  },
  avatar: {
    component: resolveComponent('UAvatar'),
    props: {
      src: 'https://github.com/benjamincanac.png'
    }
  },
  badge: {
    component: resolveComponent('UBadge'),
    props: {
      label: 'badge'
    }
  },
  breadcrumb: {
    component: resolveComponent('UBreadcrumb'),
    props: {
      items: [
        {
          label: 'Home',
          to: '/'
        },
        {
          slot: 'dropdown' as const,
          icon: 'i-heroicons-ellipsis-horizontal',
          children: [
            {
              label: 'Documentation'
            },
            {
              label: 'Themes'
            },
            {
              label: 'GitHub'
            }
          ]
        },
        {
          label: 'Components',
          disabled: true
        },
        {
          label: 'Breadcrumb',
          to: '/components/breadcrumb'
        }
      ]
    }
  },
  button: {
    component: resolveComponent('UButton'),
    props: {
      label: 'Click me!',
      icon: 'i-heroicons-rocket-launch-20-solid'
    }
  },
  buttonGroup: {
    component: resolveComponent('UButtonGroup'),
    props: {}
  },
  card: {
    component: resolveComponent('UCard'),
    props: {}
  },
  checkbox: {
    component: resolveComponent('UCheckbox'),
    props: {
      label: 'Check me!'
    }
  },
  chip: {
    component: resolveComponent('UChip'),
    props: {
      icon: 'i-heroicons-bell',
      count: 3
    }
  },
  collapsible: {
    component: resolveComponent('UCollapsible'),
    props: {}
  },
  contextMenu: {
    component: resolveComponent('UContextMenu'),
    props: {}
  },
  commandPalette: {
    component: resolveComponent('UCommandPalette'),
    props: {}
  },
  drawer: {
    component: resolveComponent('UDrawer'),
    props: {}
  },
  dropdownMenu: {
    component: resolveComponent('UDropdownMenu'),
    props: {}
  },
  form: {
    component: resolveComponent('UForm'),
    props: {}
  },
  formField: {
    component: resolveComponent('UFormField'),
    props: {}
  },
  input: {
    component: resolveComponent('UInput'),
    props: {}
  },
  inputMenu: {
    component: resolveComponent('UInputMenu'),
    props: {}
  },
  kbd: {
    component: resolveComponent('UKbd'),
    props: {}
  },
  link: {
    component: resolveComponent('ULink'),
    props: {}
  },
  modal: {
    component: resolveComponent('UModal'),
    props: {}
  },
  navigationMenu: {
    component: resolveComponent('UNavigationMenu'),
    props: {}
  },
  pagination: {
    component: resolveComponent('UPagination'),
    props: {}
  },
  popover: {
    component: resolveComponent('UPopover'),
    props: {}
  },
  progress: {
    component: resolveComponent('UProgress'),
    props: {}
  },
  radioGroup: {
    component: resolveComponent('URadioGroup'),
    props: {}
  },
  select: {
    component: resolveComponent('USelect'),
    props: {}
  },
  selectMenu: {
    component: resolveComponent('USelectMenu'),
    props: {}
  },
  separator: {
    component: resolveComponent('USeparator'),
    props: {}
  },
  shortcuts: {
    component: resolveComponent('UShortcuts'),
    props: {}
  },
  skeleton: {
    component: resolveComponent('USkeleton'),
    props: {}
  },
  slideover: {
    component: resolveComponent('USlideover'),
    props: {}
  },
  slider: {
    component: resolveComponent('USlider'),
    props: {}
  },
  switch: {
    component: resolveComponent('USwitch'),
    props: {}
  },
  tabs: {
    component: resolveComponent('UTabs'),
    props: {}
  },
  textarea: {
    component: resolveComponent('UTextarea'),
    props: {}
  },
  toast: {
    component: resolveComponent('UToast'),
    props: {}
  },
  tooltip: {
    component: resolveComponent('UTooltip'),
    props: {}
  }
}
const appConfig = useAppConfig()

const components = Object.keys(ui).map((key) => {
  const slots = (ui as any)[key].slots

  return {
    key,
    value: key,
    label: `U${pascalCase(key)}`,
    slots: slots
      ? Object.keys(slots)?.map(id => ({
        id,
        value: appConfig.ui?.[key]?.slots?.[id] // TODO: default to app.config value
      }))
      : [{ id: 'base', value: '' }]
  }
})

const component = ref(components.find(c => c.key === 'button'))

const preview = ref()
const computedUI = computed(() => {
  if (!component.value) return

  return component.value.slots?.reduce(
    (acc, slot) => {
      acc[slot.id] = slot.value
      return acc
    },
    {} as Record<string, any>
  )
})

function onHover(slotId: string) {
  const element = preview.value.querySelector(`[data-slot=${slotId}]`)
  if (element) {
    element.classList.add('highlight')
  }
}

function onLeave(slotId: string) {
  const element = preview.value.querySelector(`[data-slot=${slotId}]`)
  if (element) {
    element.classList.remove('highlight')
  }
}

function saveConfig() {
  if (!component.value) return
  updateAppConfig({
    ui: { [component.value.key]: { slots: computedUI.value } }
  })

  $fetch('/_ui/config', {
    method: 'POST',
    body: appConfig
  })
}
</script>

<template>
  <div class="relative w-full h-screen">
    <div
      class="top-0 h-[49px] border-b border-gray-100 bg-white flex justify-center items-center"
    >
      <UInputMenu
        v-model="component"
        variant="none"
        :items="components"
        class="grow"
        placeholder="Search component..."
      />

      <UButton variant="ghost" @click="saveConfig">
        Save config
      </UButton>
    </div>
    <div
      class="absolute top-[49px] inset-x-0 bottom-0 overflow-y-scroll grid grid-cols-3 gap-4"
    >
      <div
        v-if="component"
        ref="preview"
        class="col-span-2 flex justify-center items-center p-8"
      >
        <component
          :is="componentExample[component.key].component"
          v-bind="{ ui: computedUI, ...componentExample[component.key].props, class: computedUI.base }"
        />
      </div>

      <div class="border-l border-gray-200 overflow-y-scroll">
        <div
          v-for="slot in component?.slots"
          :id="slot.id"
          :key="slot.id"
          ref="slotsRef"
          class="border-b p-4 border-gray-200 font-mono hover:bg-gray-50 transition ease"
          @mouseenter="onHover(slot.id)"
          @mouseleave="onLeave(slot.id)"
        >
          <p class="text-sm">
            {{ slot.id }}
          </p>
          <UInput v-model="slot.value" variant="ghost" class="w-full px-0" />
        </div>
      </div>

      <!-- This is to include tailwind css classes for testing -->
      <div
        class="hidden rounded-full bg-black border border-4 border-black border-cool-100 border-red-800 text-black p-1 p-2 p-3 p-4"
      />
    </div>
  </div>
</template>

<style>
.highlight {
  outline: dashed;
  outline-color: blue;
  outline-width: 1.5px;
  outline-offset: 2px;
}
</style>
