<script setup lang="ts">
import { onDevtoolsClientConnected } from '@nuxt/devtools-kit/iframe-client'
import type { ClientFunctions, ServerFunctions, Component } from '../../src/devtools/rpc'

const components = useState<Array<Component & { value: string }>>('ui-devtools-components')
const component = useState<Component>('ui-devtools-component')

onDevtoolsClientConnected(async (client) => {
  const rpc = client.devtools.extendClientRpc<ServerFunctions, ClientFunctions>('nuxt/ui/devtools', { })

  // call server RPC functions
  components.value = (await rpc.getComponents()).map(component => ({ ...component, value: component.slug }))

  if (!component.value || !components.value.find(c => c.slug === component.value.slug)) {
    component.value = components.value.find(comp => comp.slug === 'button')
  }
})
</script>

<template>
  <UApp class="h-screen w-full relative">
    <div
      class="top-0 h-[49px] border-b border-gray-200 bg-white flex justify-center items-center px-2"
    >
      <UInputMenu
        v-model="component"
        variant="none"
        :items="components"
        class="grow"
        placeholder="Search component..."
        size="xl"
      />
    </div>
    <div v-if="component" class="absolute top-[49px] bottom-0 inset-x-0 grid grid-cols-2 border-l border-gray-100">
      <div class="bg-white">
        <!-- TODO: Add component configuration and documentation -->
      </div>
      <div>
        <iframe class="h-full w-full" :src="`/_ui/components/${component.slug}`" />
      </div>
    </div>
  </UApp>
</template>

<style>
@import 'tailwindcss';
@import '@nuxt/ui';
</style>
