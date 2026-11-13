<script setup lang="ts">
import theme from '#build/ui/drawer'

const sides = Object.keys(theme.variants.side)

const open = ref(false)
const inset = ref(true)
const handle = ref(true)
const side = ref<any>('bottom')

const snapPoints = [0.4, 0.75, 1]
const snapPoint = ref<string | number | null>(0.4)
</script>

<template>
  <Navbar>
    <USwitch v-model="inset" label="Inset" />
    <USwitch v-model="handle" label="Handle" />
    <USelect v-model="side" :items="sides" class="w-32" />
  </Navbar>

  <div class="flex flex-col gap-2 min-h-0">
    <UDrawer
      v-model:open="open"
      title="Drawer with v-model"
      :side="side"
      :inset="inset"
      :handle="handle"
      close
    >
      <UButton color="neutral" variant="outline" label="Open with v-model" />

      <template #body>
        <Placeholder class="min-h-48 size-full" />
      </template>

      <template #footer>
        <UButton label="Submit" color="neutral" class="justify-center" />
        <UButton label="Cancel" color="neutral" variant="outline" class="justify-center" @click="open = false" />
      </template>
    </UDrawer>

    <UDrawer
      title="Drawer"
      description="Open another one from the same side."
      :side="side"
      :inset="inset"
      :handle="handle"
      close
    >
      <UButton color="neutral" variant="outline" label="Open nested" />

      <template #body>
        <Placeholder class="min-h-48 size-full" />
      </template>

      <template #footer>
        <UDrawer
          title="Nested drawer"
          description="The parent stays mounted behind this one."
          :side="side"
          :inset="inset"
          :handle="handle"
          close
        >
          <UButton color="neutral" variant="outline" label="Open nested" class="justify-center" />

          <template #body>
            <Placeholder class="min-h-48 size-full" />
          </template>

          <template #footer>
            <UDrawer
              title="Third drawer"
              description="Two drawers are stacked behind this one."
              :side="side"
              :inset="inset"
              :handle="handle"
              close
            >
              <UButton color="neutral" variant="outline" label="Open third" class="justify-center" />

              <template #body>
                <Placeholder class="min-h-48 size-full" />
              </template>

              <template #footer>
                <UDrawer
                  title="Fourth drawer"
                  description="This one is the frontmost of the stack."
                  :side="side"
                  :inset="inset"
                  :handle="handle"
                  close
                >
                  <UButton color="neutral" variant="outline" label="Open fourth" class="justify-center" />

                  <template #body>
                    <Placeholder class="min-h-48 size-full" />
                  </template>
                </UDrawer>
              </template>
            </UDrawer>
          </template>
        </UDrawer>
      </template>
    </UDrawer>

    <UDrawer
      v-model:snap-point="snapPoint"
      title="Drawer with snap points"
      :description="`Snapped at ${snapPoint}.`"
      :snap-points="snapPoints"
      side="bottom"
      :inset="inset"
      :handle="handle"
      close
    >
      <UButton color="neutral" variant="outline" label="Open with snap points" />

      <template #body>
        <Placeholder class="size-full" />
      </template>
    </UDrawer>

    <UDrawer
      title="Drawer prevent close"
      description="This drawer has `dismissible: false` so clicking outside, pressing escape and swiping are all blocked."
      :dismissible="false"
      :side="side"
      :inset="inset"
      :handle="handle"
      close
      @close:prevent="console.log('close:prevent')"
    >
      <UButton label="Open unclosable" color="neutral" variant="outline" />

      <template #body>
        <Placeholder class="min-h-96 size-full" />
      </template>
    </UDrawer>

    <UDrawer
      title="Drawer without overlay"
      :modal="false"
      :overlay="false"
      :side="side"
      :inset="inset"
      :handle="handle"
      close
    >
      <UButton label="Open without overlay" color="neutral" variant="outline" />

      <template #body>
        <Placeholder class="min-h-96 size-full" />
      </template>
    </UDrawer>
  </div>
</template>
