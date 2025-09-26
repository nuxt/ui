<script setup lang="ts">
const open = ref(false)
const inset = ref(false)
const testFormValue = ref('')
const testSelectValue = ref('')
const interactiveDrawerOpen = ref(false)
</script>

<template>
  <div class="flex flex-col gap-2">
    <USwitch v-model="inset" label="Inset" class="mb-4" />

    <UDrawer v-model:open="open" title="Drawer with v-model" description="This is useful to control the state yourself." :inset="inset">
      <UButton color="neutral" variant="outline" label="Open with v-model" />

      <template #body>
        <Placeholder class="h-48 w-full" />
      </template>

      <template #footer>
        <UButton label="Submit" color="neutral" class="justify-center" />
        <UButton label="Cancel" color="neutral" variant="outline" class="justify-center" @click="open = false" />
      </template>
    </UDrawer>

    <UDrawer should-scale-background title="Drawer with `should-scale-background`" description="You need to add the `data-vaul-drawer-wrapper` directive to your content to make it work." :inset="inset">
      <UButton color="neutral" variant="outline" label="Open with scale" />

      <template #body>
        <Placeholder class="h-screen w-full" />
      </template>
    </UDrawer>

    <UDrawer 
      v-model:open="interactiveDrawerOpen"
      id="dismissible-drawer" 
      :dismissible="false" 
      :overlay="false" 
      :handle="false" 
      :modal="false" 
      title="Drawer with interactive background" 
      :inset="inset"  
      direction="bottom"
      :ui="{ header: 'flex items-center justify-between' }"
    >
      <UButton color="neutral" variant="outline" label="Open with interactive background" />

      <template #header>
        <h2 class="text-highlighted font-semibold">Drawer non-dismissible</h2>

        <UButton id="close" color="neutral" variant="ghost" icon="i-lucide-x" @click="interactiveDrawerOpen = false" />
      </template>

      <template #body>
        <div class="space-y-4">
          <p class="text-sm text-gray-600">
            This drawer should NOT close when you interact with background elements like the form below.
            The `Switch` above should remain clickable without closing this drawer.
          </p>
          <Placeholder class="h-48 w-full" />
        </div>
      </template>
    </UDrawer>

    <!-- Test form to demonstrate the bug -->
    <div class="mt-8 p-4 border border-gray-200 rounded-lg bg-gray-50">
      <h3 class="text-lg font-semibold mb-4">Background Form (for testing)</h3>
      <p class="text-sm text-gray-600 mb-4">
        Open the "interactive background" drawer above, then try interacting with these elements. 
        The drawer should NOT close when clicking on these background elements.
      </p>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Test Input</label>
          <UInput v-model="testFormValue" placeholder="Click here to test - drawer should not close" />
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-1">Test Select</label>
          <USelect 
            v-model="testSelectValue" 
            :options="[{label: 'Option 1', value: '1'}, {label: 'Option 2', value: '2'}]"
            placeholder="Select an option - drawer should not close"
          />
        </div>
        
        <UButton color="primary" label="Test Button - drawer should not close" />
      </div>
    </div>

    <UDrawer title="Drawer with nested" :inset="inset" :ui="{ content: 'h-full' }" should-scale-background>
      <UButton color="neutral" variant="outline" label="Open nested" />

      <template #footer>
        <UDrawer :inset="inset" nested :ui="{ content: 'h-full' }">
          <UButton color="neutral" variant="outline" label="Open nested" />

          <template #content>
            <Placeholder class="flex-1 m-4" />
          </template>
        </UDrawer>
      </template>
    </UDrawer>

    <UDrawer title="Drawer with bottom direction" direction="bottom" :inset="inset">
      <UButton color="neutral" variant="outline" label="Open on bottom" />

      <template #body>
        <Placeholder class="h-96 w-full" />
      </template>
    </UDrawer>

    <UDrawer title="Drawer with left direction" direction="left" :inset="inset">
      <UButton color="neutral" variant="outline" label="Open on left" />

      <template #body>
        <Placeholder class="w-96 h-full" />
      </template>
    </UDrawer>

    <UDrawer title="Drawer with top direction" direction="top" :inset="inset">
      <UButton color="neutral" variant="outline" label="Open on top" />

      <template #body>
        <Placeholder class="h-96 w-full" />
      </template>
    </UDrawer>

    <UDrawer title="Drawer with right direction" direction="right" :inset="inset">
      <UButton color="neutral" variant="outline" label="Open on right" />

      <template #body>
        <Placeholder class="w-96 h-full" />
      </template>
    </UDrawer>
  </div>
</template>
