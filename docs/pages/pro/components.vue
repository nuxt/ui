<template>
  <UContainer>
    <UPage>
      <template #left>
        <UAside>
          <UNavigationTree :links="links" default-open="/components" />
        </UAside>
      </template>

      <NuxtPage />
    </UPage>
  </UContainer>
</template>

<script setup lang="ts">
import type { Link } from '#ui-pro/types'
import { upperFirst } from 'scule'

type ComponentMeta = {
  [key: string]: {
    shortPath: string
    pascalName: string
  }
}

const runtimeConfig = useRuntimeConfig().public

const { data: components } = await useAsyncData('components', () => $fetch<ComponentMeta>('/api/component-meta'))

const links = computed(() => {
  const proComponents = Object.values(components.value).filter(component => runtimeConfig.uiProPath ? component.shortPath.startsWith(`${runtimeConfig.uiProPath}`) : false)
  // build tree with children as array
  return proComponents.reduce((acc: Link[], component: any) => {
    const categoryName = component.shortPath.split('/')[2]
    if (categoryName.endsWith('.vue')) {
      return acc
    }
    const slug = component.pascalName.replace(/^U/, '')
    const link: Link = {
      label: slug,
      to: `/pro/components/${categoryName}/${slug}`
    }
    if (link.label.startsWith('Prose')) {
      return acc
    }
    const category = acc.find(category => category.to === `/${categoryName}`)
    if (!category) {
      acc.push({
        to: `/${categoryName}`,
        label: upperFirst(categoryName),
        children: [link]
      })
    } else {
      category.children.push(link)
    }
    return acc
  }, [])
})
</script>
