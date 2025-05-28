---
description: 'A set of steps that are used to indicate progress through a multi-step process.'
category: nagivation
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/tree/v3/src/runtime/components/Timeline.vue
---

## Usage

### Items

Use the `items` prop as an array of objects with the following properties:
- `date?: string`{lang="ts-type"}
- `title?: string`{lang="ts-type"}
- `description?: AvatarProps`{lang="ts-type"}
- `icon?: string`{lang="ts-type"}
- `avatar?: AvatarProps`{lang="ts-type"}
- `value?: string | number`{lang="ts-type"}
- [`slot?: string`{lang="ts-type"}](#with-custom-slot)
- `class?: any`{lang="ts-type"}
- `ui?: { item?: ClassNameValue, container?: ClassNameValue, indicator?: ClassNameValue, separator?: ClassNameValue, wrapper?: ClassNameValue, separator?: ClassNameValue, date?: ClassNameValue, title?: ClassNameValue, description?: ClassNameValue }`{lang="ts-type"}

::component-code
---
ignore:
  - items
  - class
external:
  - items
externalTypes:
  - TimelineItem[]
props:
  items:
    - date: 'Mar 15, 2025'
      title: 'Project Kickoff'
      description: 'Kicked off the project with team alignment. Set up project milestones and allocated resources.'
      icon: 'i-lucide-rocket'
      value: 1
    - date: 'Mar 22 2025'
      title: 'Design Phase'
      description: 'User research and design workshops. Created wireframes and prototypes for user testing'
      icon: 'i-lucide-palette'
      value: 2
    - date: 'Mar 29 2025'
      title: 'Development Sprint'
      description: 'Frontend and backend development. Implemented core features and integrated with APIs.'
      icon: 'i-lucide-code'
      value: 3
    - date: 'Apr 5 2025'
      title: 'Testing & Deployment'
      description: 'QA testing and performance optimization. Deployed the application to production.'
      icon: 'i-lucide-check-circle'
      value: 4
  class: 'w-full'
---
::

### Color

Use the `color` prop to change the color of the Timeline.

::component-code
---
ignore:
  - items
  - class
external:
  - items
externalTypes:
  - TimelineItem[]
props:
  color: neutral
  items:
    - date: 'Mar 15, 2025'
      title: 'Project Kickoff'
      description: 'Kicked off the project with team alignment. Set up project milestones and allocated resources.'
      icon: 'i-lucide-rocket'
      value: 1
    - date: 'Mar 22 2025'
      title: 'Design Phase'
      description: 'User research and design workshops. Created wireframes and prototypes for user testing'
      icon: 'i-lucide-palette'
      value: 2
    - date: 'Mar 29 2025'
      title: 'Development Sprint'
      description: 'Frontend and backend development. Implemented core features and integrated with APIs.'
      icon: 'i-lucide-code'
      value: 3
    - date: 'Apr 5 2025'
      title: 'Testing & Deployment'
      description: 'QA testing and performance optimization. Deployed the application to production.'
      icon: 'i-lucide-check-circle'
      value: 4
  modelValue: 4
  class: 'w-full'
---
::

### Size

Use the `size` prop to change the size of the Timeline.

::component-code
---
ignore:
  - items
  - class
external:
  - items
externalTypes:
  - TimelineItem[]
props:
  size: xl
  items:
    - date: 'Mar 15, 2025'
      title: 'Project Kickoff'
      description: 'Kicked off the project with team alignment. Set up project milestones and allocated resources.'
      icon: 'i-lucide-rocket'
      value: 1
    - date: 'Mar 22 2025'
      title: 'Design Phase'
      description: 'User research and design workshops. Created wireframes and prototypes for user testing'
      icon: 'i-lucide-palette'
      value: 2
    - date: 'Mar 29 2025'
      title: 'Development Sprint'
      description: 'Frontend and backend development. Implemented core features and integrated with APIs.'
      icon: 'i-lucide-code'
      value: 3
    - date: 'Apr 5 2025'
      title: 'Testing & Deployment'
      description: 'QA testing and performance optimization. Deployed the application to production.'
      icon: 'i-lucide-check-circle'
      value: 4
  class: 'w-full'
---
::
### Orientation

Use the `orientation` prop to change the orientation of the Timeline.

::component-code
---
ignore:
  - items
  - class
external:
  - items
externalTypes:
  - TimelineItem[]
props:
  orientation: 'horizontal'
  items:
    - date: 'Mar 15, 2025'
      title: 'Project Kickoff'
      description: 'Kicked off the project with team alignment. Set up project milestones and allocated resources.'
      icon: 'i-lucide-rocket'
      value: 1
    - date: 'Mar 22 2025'
      title: 'Design Phase'
      description: 'User research and design workshops. Created wireframes and prototypes for user testing'
      icon: 'i-lucide-palette'
      value: 2
    - date: 'Mar 29 2025'
      title: 'Development Sprint'
      description: 'Frontend and backend development. Implemented core features and integrated with APIs.'
      icon: 'i-lucide-code'
      value: 3
    - date: 'Apr 5 2025'
      title: 'Testing & Deployment'
      description: 'QA testing and performance optimization. Deployed the application to production.'
      icon: 'i-lucide-check-circle'
      value: 4
  class: 'w-full'
---
::

## Examples

### Control active item

You can control the active item by using the `default-value` prop or the `v-model` directive with the index of the item.

:component-example{name="timeline-model-value-example"}

::tip
You can also pass the `value` of one of the items if provided.
::

### With custom slot

Use the `slot` prop to customize a specific item.

:component-example{name="timeline-custom-slot-example"}

### Alternate

Use the `ui` prop to create a Timeline with alternating sides.

:component-example{name="timeline-alternate-example"}

### With slots

Create a more complex timeline using slots.

:component-example{name="timeline-slots-example"}

## API

### Props

:component-props

### Slots

:component-slots

### Emits

:component-emits

## Theme

:component-theme
