<template>
  <div class="h-full flex flex-col justify-between gap-4 relative">
    <ComponentPlaceholder v-for="(component, index) in components" :key="index" v-bind="component" />
  </div>
</template>


<script setup lang="ts">
const components = [{
  name: 'UHeader',
  class: 'h-16 w-full justify-between',
  children: [{
    name: '#left',
    type: 'slot',
    class: 'w-48 justify-start'
  }, {
    name: '#center',
    type: 'slot',
    class: 'flex-1 justify-center'
  }, {
    name: '#right',
    type: 'slot',
    class: 'w-48 justify-end'
  }]
}, {
  name: 'UMain',
  class: 'flex-1',
  children: [{
    name: 'UPage',
    class: 'flex-1',
    children: [{
      name: '#left',
      type: 'slot',
      class: 'flex-col w-72 !items-start',
      children: [{
        name: 'UAside',
        class: 'flex-col w-full !items-start',
        children: [{
          name: '#top',
          type: 'slot',
          class: 'w-full'
        }, {
          name: 'UNavigationTree',
          class: 'w-full',
          children: [{
            name: 'UNavigationLinks',
            class: 'flex-1 ',
            children: [{
              type: 'placeholder',
              class: 'flex-1'
            }]
          }]
        }]
      }]
    }, {
      name: 'UPage',
      class: 'w-full  flex items-start ',
      children: [{
        name: 'UPageHeader',
        class: 'h-12 w-full'
      }, {
        name: '#right',
        type: 'slot',
        class: 'flex-col w-64 !items-end'
      }]
    }]
  }]
}, {
  name: 'UFooter',
  class: 'h-16 w-full justify-between',
  children: [{
    name: '#left',
    type: 'slot',
    class: 'w-48 justify-start'
  }, {
    name: '#center',
    type: 'slot',
    class: 'flex-1 justify-center'
  }, {
    name: '#right',
    type: 'slot',
    class: 'w-48 justify-end'
  }]
}]
</script>
