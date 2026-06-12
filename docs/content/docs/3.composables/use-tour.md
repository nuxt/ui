---
title: useTour
description: 'A composable to build guided tours by re-anchoring a single Popover across steps.'
navigation.badge: Soon
---

## Usage

Use the auto-imported `useTour` composable to drive a guided tour with a single [Popover](/docs/components/popover) whose anchor moves between steps. The composable owns the step state and resolves each step's `target` into a `reference` you bind to `<UPopover>`, while you keep full control over the content and navigation.

::component-example
---
collapse: true
name: 'use-tour-example'
---
::

Each step requires a `target` that the popover anchors to. It accepts a CSS selector, an element, a virtual element (anything with `getBoundingClientRect`), or a ref/getter returning one of those. Pass `null` to anchor the step to the center of the viewport. Any other field on a step (`title`, `body`, `side`, …) is passed through untouched and available via `current`.

```vue
<script setup lang="ts">
const card = useTemplateRef('card')

const tour = useTour([
  { target: '#cta', title: 'Get started' },
  { target: () => card.value, title: 'Profile', side: 'right' },
  { target: null, title: 'All set' }
])
</script>

<template>
  <UButton @click="tour.start()">Start tour</UButton>

  <UPopover :open="tour.open.value" :reference="tour.reference.value" :dismissible="false">
    <template #content>
      <!-- your content + buttons -->
      <UButton :disabled="!tour.hasPrev.value" @click="tour.prev()">Back</UButton>
      <UButton @click="tour.next()">{{ tour.hasNext.value ? 'Next' : 'Finish' }}</UButton>
    </template>
  </UPopover>
</template>
```

- Built on the Popover's reactive `reference` prop, so the popover smoothly repositions when the active step changes.
- The active target is scrolled into view automatically when a step becomes active.
- Since you render the content yourself, there is no extra theme or locale to maintain.

## API

`useTour(steps, options?)`{lang="ts-type"}

### Parameters

::field-group

  ::field{name="steps" type="MaybeRefOrGetter<TourStep[]>" required}
  The list of tour steps. Can be a static array, a `ref`, or a getter for reactive steps.

    ::collapsible

      ::field-group
        ::field{name="target" type="MaybeRefOrGetter<string | ReferenceElement | null | undefined>"}
        The element the step anchors to. Accepts a CSS selector (`'#id'`, `'.class'`, or a bare id resolved as `#id`), an element, a virtual element, or a ref/getter returning one. Use `null` to center the step in the viewport.
        ::

        ::field{name="[key: string]" type="any"}
        Any additional fields (`title`, `body`, `side`, …) are passed through and available via `current`.
        ::
      ::
    ::
  ::

  ::field{name="options" type="UseTourOptions"}
  Configuration options for the tour.

    ::collapsible

      ::field-group
        ::field{name="initialStep" type="number" default="0"}
        The step index the tour starts on.
        ::

        ::field{name="loop" type="boolean" default="false"}
        Loop back to the first step after the last one.
        ::

        ::field{name="scrollIntoView" type="boolean | ScrollIntoViewOptions" default="true"}
        Scroll the target into view when a step becomes active.
        ::
      ::
    ::
  ::
::

### Return

::field-group

  ::field{name="open" type="Ref<boolean>"}
  Whether the tour is currently open.
  ::

  ::field{name="index" type="Ref<number>"}
  The current step index, clamped to the steps range.
  ::

  ::field{name="current" type="ComputedRef<TourStep | undefined>"}
  The current step object, or `undefined` when there are no steps.
  ::

  ::field{name="reference" type="ComputedRef<ReferenceElement | undefined>"}
  The resolved anchor for the current step, to pass to `<UPopover :reference>`.
  ::

  ::field{name="total" type="ComputedRef<number>"}
  The total number of steps.
  ::

  ::field{name="hasNext" type="ComputedRef<boolean>"}
  Whether a next step exists.
  ::

  ::field{name="hasPrev" type="ComputedRef<boolean>"}
  Whether a previous step exists.
  ::

  ::field{name="start" type="(index?: number) => void"}
  Open the tour, optionally at a given index.
  ::

  ::field{name="next" type="() => void"}
  Go to the next step. Loops or finishes at the end depending on the `loop` option.
  ::

  ::field{name="prev" type="() => void"}
  Go to the previous step.
  ::

  ::field{name="goTo" type="(index: number) => void"}
  Jump to a specific step and open the tour.
  ::

  ::field{name="finish" type="() => void"}
  Close the tour.
  ::
::
