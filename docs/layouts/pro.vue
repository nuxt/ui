<template>
  <UMain>
    <UContainer>
      <UPage>
        <template #left>
          <UAside>
            <UNavigationTree :links="links" default-open :multiple="false" />
          </UAside>
        </template>

        <slot />
      </UPage>
    </UContainer>
  </UMain>
</template>

<script setup lang="ts">
import { upperFirst, camelCase } from 'scule'
import type { NavItem } from '@nuxt/content/dist/runtime/types'
import type { Link } from '#ui-pro/types'

const nav = inject<Ref<NavItem[]>>('navigation')

const runtimeConfig = useRuntimeConfig().public

const navigation = computed(() => nav.value.find(item => item._path === '/pro')?.children ?? [])

type ComponentMeta = {
  [key: string]: {
    shortPath: string
    pascalName: string
  }
}

const { data: components } = await useAsyncData('components', () => $fetch<ComponentMeta>('/api/component-meta'))

const links = computed(() => {
  const proComponents = Object.values(components.value).filter(component => runtimeConfig.uiProPath ? component.shortPath.startsWith(`${runtimeConfig.uiProPath}`) : false)

  const proComponentsTree = proComponents.reduce((acc: Link[], component: any) => {
    const categoryName = component.shortPath.split('/').reverse()[1]
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
    const category = acc.find(category => category.to === `/pro/components/${categoryName}`)
    if (!category) {
      acc.push({
        to: `/pro/components/${categoryName}`,
        label: upperFirst(camelCase(categoryName)),
        children: [link]
      })
    } else {
      category.children.push(link)
    }
    return acc
  }, [])

  return [
    ...mapContentNavigation(navigation.value),
    {
      label: 'Components',
      to: '/pro/components',
      children: proComponentsTree
    }
  ]
})
</script>
