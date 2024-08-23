<script lang="ts" setup>
import { SlideoverExampleComponentB } from '#components'

const props = defineProps({
  count: {
    type: Number,
    default: 0
  },
  side: {
    type: String as PropType<'left' | 'right'>,
    default: 'right'
  }
})

const emits = defineEmits<{
  close: [];
  switch: [];
}>()

const slideover = useSlideover()
const anotherCount = ref(0)


function openAnotherSlideover () {
  anotherCount.value += 1

  slideover.open(SlideoverExampleComponentB)

}
</script>

<template>
  <USlideover :side="props.side">
    <UCard class="flex flex-col flex-1" :ui="{ body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            Opened programmatically: {{ props.count }} times
          </h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="emits('close')" />
        </div>
      </template>

      <div class="flex gap-2 flex-col h-full">
        <div class="flex justify-around flex-col">
          <pre>{{ $props }}</pre>
          <UButton label="Reveal another slideover" @click="openAnotherSlideover" />
          <UButton label="Switch" @click="$emit('switch')" />
        </div>
      </div>
    </UCard>
  </USlideover>
</template>