<script setup lang="ts">
import { onMounted, computed, reactive, resolveComponent } from 'vue'

const props = defineProps<{
  slug: string
}>()

const componentExamples: Record<string, any> = {
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

const component = computed(() => componentExamples[props.slug])

const state = reactive<{ slots?: any, props?: any }>({})

onMounted(() => {
  window.parent.addEventListener('nuxt-ui-devtools:update-renderer', (event: Event & { data?: any }) => {
    state.props = { ...event.data.props }
    state.slots = { ...event.data.slots }
  })

  window.parent.addEventListener('nuxt-ui-devtools:slot-hover', (event: Event & { data?: any }) => {
    const element = window.document.querySelector(`[data-slot=${event.data.slot}]`)
    if (element) {
      element.classList.add('nuxt-ui-slot-highlight')
    }
  })

  window.parent.addEventListener('nuxt-ui-devtools:slot-leave', (event: Event & { data?: any }) => {
    const element = window.document.querySelector(`[data-slot=${event.data.slot}]`)
    if (element) {
      element.classList.remove('nuxt-ui-slot-highlight')
    }
  })
})

onMounted(() => {
  const event: Event & { data?: any } = new Event('nuxt-ui-devtools:component-loaded')
  event.data = componentExamples[props.slug]
  window.parent.dispatchEvent(event)
})
</script>

<template>
  <div class="nuxt-ui-component-renderer h-screen w-screen p-8">
    <component :is="component.component" v-if="component" v-bind="{ ...component?.props, ...state.props }" :class="state?.slots?.base" :ui="state.slots" />
  </div>
</template>

<style>
.nuxt-ui-component-renderer {
  display: flex;
  justify-content: center;
  align-items: center;
  background: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' transform='scale(3)'%3E%3Crect width='100%25' height='100%25' fill='%23fff'/%3E%3Cpath fill='none' stroke='hsla(0, 0%25, 98%25, 1)' stroke-width='.2' d='M10 0v20ZM0 10h20Z'/%3E%3C/svg%3E");
  background-size: 40px 40px;
}

.nuxt-ui-slot-highlight {
  outline-color: blue !important;
  outline-width: 1.5px !important;
  outline-offset: 2px !important;
  outline-style: dashed !important;
}
</style>
