<template>
  <UPage>
    <UPageHeader
      :title="component.pascalName"
      :description="component.meta.description"
      :headline="category"
      :links="headerLinks"
    />

    <UPageBody prose>
      <template v-if="component.meta.props?.length">
        <h2 id="props">
          Props
        </h2>

        <FieldGroup>
          <ComponentField v-for="prop in component.meta.props" :key="prop.name" :prop="prop" />
        </FieldGroup>
      </template>

      <template v-if="component.meta.slots?.length">
        <h2 id="slots">
          Slots
        </h2>

        <FieldGroup>
          <Field v-for="slot in component.meta.slots" :key="slot.name" v-bind="slot" />
        </FieldGroup>
      </template>

      <DocsFooter />
    </UPageBody>

    <template v-if="tocLinks.length" #right>
      <UDocsToc :links="tocLinks" />
    </template>
  </UPage>
</template>

<script setup lang="ts">
const route = useRoute()

const [category, name] = route.params.slug

const { data: component } = await useAsyncData(`component-${name}`, () => $fetch(`/api/component-meta/${category !== 'content' ? 'U' : ''}${name}`))
if (!component.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

const headerLinks = computed(() => [{
  label: 'GitHub',
  icon: 'i-simple-icons-github',
  to: `https://github.com/nuxtlabs/elements/blob/dev/components/${category}/${name}.vue`
}])

const tocLinks = computed(() => {
  return [component.value.meta.props?.length && {
    id: 'props',
    text: 'Props',
    depth: 2
  }, component.value.meta.slots?.length && {
    id: 'slots',
    text: 'Slots',
    depth: 2
  }].filter(Boolean)
})
</script>
