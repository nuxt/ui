import { ref } from 'vue'
import type { ContentNavigationItem } from '@nuxt/content'
import { createSharedComposable } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { sanitizeSnippet } from '../utils/search'
import type { ContentSearchFile, ContentSearchItem, ContentSearchLink } from '../components/content/ContentSearch.vue'

function _useContentSearch() {
  const open = ref(false)
  const appConfig = useAppConfig()

  /**
   * Map a file to a ContentSearchItem
   */
  function mapFile(
    file: ContentSearchFile,
    link: ContentNavigationItem,
    parent?: ContentNavigationItem
  ): ContentSearchItem {
    const prefix = [...new Set([parent?.title, ...file.titles].filter(Boolean))]

    return {
      prefix: prefix?.length ? (prefix.join(' > ') + ' >') : undefined,
      label: file.id === link.path ? link.title : file.title,
      suffix: file.content.replaceAll('<', '&lt;').replaceAll('>', '&gt;'),
      to: file.id,
      icon: (link.icon || parent?.icon || (file.level > 1 ? appConfig.ui.icons.hash : appConfig.ui.icons.file)) as string,
      level: file.level
    }
  }

  /**
   * Map navigation items to ContentSearchItems
   */
  function mapNavigationItems(
    children: ContentNavigationItem[],
    files: ContentSearchFile[],
    parent?: ContentNavigationItem
  ): ContentSearchItem[] {
    // Build a path -> files index once per call to turn the per-leaf
    // `files.filter(...)` scan into an O(1) lookup. Without this, a large
    // navigation tree is O(leaves * files) on every re-map.
    const filesByPath = new Map<string, ContentSearchFile[]>()
    for (const file of files || []) {
      const basePath = file.id.split('#')[0] || file.id
      let bucket = filesByPath.get(basePath)
      if (!bucket) {
        bucket = []
        filesByPath.set(basePath, bucket)
      }
      bucket.push(file)
    }

    function visit(
      nodes: ContentNavigationItem[],
      nodeParent?: ContentNavigationItem
    ): ContentSearchItem[] {
      return nodes.flatMap((link) => {
        if (link.children?.length) {
          return visit(link.children, link)
        }

        const matched = link.path ? filesByPath.get(link.path) : undefined
        return matched?.map(file => mapFile(file, link, nodeParent)) || []
      })
    }

    return visit(children, parent)
  }

  /**
   * Map links to ContentSearchItems
   */
  function mapLinks(links: ContentSearchLink[]): ContentSearchItem[] {
    return links.flatMap(link => [{
      ...link,
      suffix: link.description,
      description: undefined,
      icon: link.icon || appConfig.ui.icons.file,
      children: undefined
    } as ContentSearchItem, ...(link.children?.map(child => ({
      ...child,
      prefix: link.label + ' >',
      suffix: child.description,
      description: undefined,
      icon: child.icon || link.icon || appConfig.ui.icons.file
    } as ContentSearchItem)) || [])])
  }

  /**
   * Find a navigation item by path
   */
  function findNavItem(path: string, nodes?: ContentNavigationItem[], root?: ContentNavigationItem, parent?: ContentNavigationItem): { link?: ContentNavigationItem, parent?: ContentNavigationItem, root?: ContentNavigationItem } {
    for (const node of nodes || []) {
      const currentRoot = root || node
      if (node.path === path) return { link: node, parent, root: currentRoot }
      if (node.children?.length) {
        const found = findNavItem(path, node.children, currentRoot, node)
        if (found.link) return found
      }
    }
    return {}
  }

  /**
   * Map search results to ContentSearchItems.
   * Caches `findNavItem` lookups by base path so multiple sections
   * of the same page don't each trigger a full tree walk.
   */
  function mapSearchResults(
    results: (ContentSearchFile & { snippets?: { title?: string, content?: string } })[],
    navigation?: ContentNavigationItem[]
  ): ContentSearchItem[] {
    const navCache = new Map<string, ReturnType<typeof findNavItem>>()

    return results.reduce<ContentSearchItem[]>((acc, result) => {
      const basePath = result.id.split('#')[0]!
      let nav = navCache.get(basePath)
      if (!nav) {
        nav = findNavItem(basePath, navigation)
        navCache.set(basePath, nav)
      }
      const { link, parent, root } = nav

      if (navigation?.length && !link) return acc

      acc.push({
        label: result.title,
        labelHtml: result.snippets?.title ? sanitizeSnippet(result.snippets.title) : undefined,
        prefix: result.titles.length ? (result.titles.join(' > ') + ' >') : undefined,
        description: result.content.replaceAll('<', '&lt;').replaceAll('>', '&gt;'),
        descriptionHtml: result.snippets?.content ? sanitizeSnippet(result.snippets.content) : undefined,
        to: result.id,
        icon: (link?.icon || parent?.icon || root?.icon || (result.level > 1 ? appConfig.ui.icons.hash : appConfig.ui.icons.file)) as string,
        level: result.level
      })

      return acc
    }, [])
  }

  /**
   * Post-filter function to filter only first level items when no query
   */
  function postFilter(query: string, items: ContentSearchItem[]): ContentSearchItem[] {
    if (!query) {
      return items?.filter(item => item.level === 1)
    }
    return items
  }

  return {
    open,
    findNavItem,
    mapFile,
    mapNavigationItems,
    mapLinks,
    mapSearchResults,
    postFilter
  }
}

export const useContentSearch = /* @__PURE__ */ createSharedComposable(_useContentSearch)
