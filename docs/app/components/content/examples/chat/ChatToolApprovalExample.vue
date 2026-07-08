<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui'

const state = ref<'approval-requested' | 'output-available' | 'output-denied'>('approval-requested')
const result = ref('')

const text = computed(() => {
  if (state.value === 'approval-requested') return 'Run terminal command'
  if (state.value === 'output-denied') return 'Command cancelled'
  return result.value ? 'Ran terminal command' : 'Running terminal command'
})

const output = computed(() => result.value || '$ pnpm run lint')

const actions = computed<ButtonProps[] | undefined>(() => {
  if (state.value !== 'approval-requested') return undefined

  return [
    { label: 'Approve', onClick: onApprove },
    { label: 'Deny', color: 'neutral', variant: 'soft', onClick: onDeny }
  ]
})

let timer: ReturnType<typeof setTimeout> | undefined

function onApprove() {
  state.value = 'output-available'

  timer = setTimeout(() => {
    result.value = `$ pnpm run lint

> eslint .

✔ No lint errors found.
`
  }, 2000)
}

function onDeny() {
  state.value = 'output-denied'
}

function reset() {
  state.value = 'approval-requested'
  result.value = ''
}

onUnmounted(() => {
  clearTimeout(timer)
})
</script>

<template>
  <div class="flex flex-col items-start gap-4">
    <UChatTool
      :text="text"
      icon="i-lucide-terminal"
      variant="card"
      :streaming="state === 'output-available' && !result"
      :actions="actions"
      class="w-80"
    >
      <pre language="bash" v-text="output" />
    </UChatTool>

    <UButton
      v-if="state !== 'approval-requested'"
      label="Reset"
      color="neutral"
      variant="link"
      size="xs"
      icon="i-lucide-rotate-ccw"
      class="p-0 absolute top-4 right-4"
      @click="reset"
    />
  </div>
</template>
