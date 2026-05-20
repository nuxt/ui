import { ref } from 'vue'
import type { ContentNavigationItem } from '@nuxt/content'
import { createSharedComposable } from '@vueuse/core'
import { useAppConfig } from '#imports'
import { sanitizeSnippet } from '../utils/search'
import type { ContentSearchFile, ContentSearchItem, ContentSearchLink, ContentSearchResult } from '../components/content/ContentSearch.vue'

function _useContentSearch() {
  const open = ref(false)
  const appConfig = useAppConfig()

  /**
   * Map a file to a ContentSearchItem
   */
  function mapFile(
    file: ContentSearchFile,
    link: ContentNavigationItem,
    ancestors: ContentNavigationItem[] = []
  ): ContentSearchItem {
    // Top-level section title is omitted — items render under their section's group label.
    const prefix = [...new Set([...ancestors.map(a => a.title), ...file.titles].filter(Boolean))]
    const ancestorIcon = ancestors.findLast(a => a.icon)?.icon

    return {
      prefix: prefix?.length ? (prefix.join(' > ') + ' >') : undefined,
      label: file.id === link.path ? link.title : file.title,
      suffix: file.content.replaceAll('<', '&lt;').replaceAll('>', '&gt;'),
      to: file.id,
      icon: (link.icon || ancestorIcon || (file.level > 1 ? appConfig.ui.icons.hash : appConfig.ui.icons.file)) as string,
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
      ancestors: ContentNavigationItem[]
    ): ContentSearchItem[] {
      return nodes.flatMap((link) => {
        if (link.children?.length) {
          return visit(link.children, [...ancestors, link])
        }

        const matched = link.path ? filesByPath.get(link.path) : undefined
        return matched?.map(file => mapFile(file, link, ancestors)) || []
      })
    }

    return visit(children, parent ? [parent] : [])
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
      prefix: link.label ? link.label + ' >' : undefined,
      suffix: child.description,
      description: undefined,
      icon: child.icon || link.icon || appConfig.ui.icons.file
    } as ContentSearchItem)) || [])])
  }

  /**
   * Find a navigation item by path, returning the full ancestor chain (root → parent).
   */
  function findNavItem(path: string, nodes?: ContentNavigationItem[], ancestors: ContentNavigationItem[] = []): { link?: ContentNavigationItem, ancestors?: ContentNavigationItem[] } {
    for (const node of nodes || []) {
      if (node.path === path) return { link: node, ancestors }
      if (node.children?.length) {
        const found = findNavItem(path, node.children, [...ancestors, node])
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
    results: ContentSearchResult[],
    navigation?: ContentNavigationItem[]
  ): ContentSearchItem[] {
    const navCache = new Map<string, ReturnType<typeof findNavItem>>()

    return results.reduce<ContentSearchItem[]>((acc, result) => {
      const basePath = result.id.split('#')[0] ?? result.id
      let nav = navCache.get(basePath)
      if (!nav) {
        nav = findNavItem(basePath, navigation)
        navCache.set(basePath, nav)
      }
      const { link, ancestors = [] } = nav

      if (navigation?.length && !link) return acc

      // Fall back to the matched link when ancestors is empty so top-level
      // index-page results still show their section title (results are flat
      // here — no group label like `mapFile`).
      const sectionChain = ancestors.length ? ancestors : (link ? [link] : [])
      const prefixParts = [...new Set([...sectionChain.map(s => s.title), ...result.titles].filter(Boolean))]
      const prefix = prefixParts.length ? (prefixParts.join(' > ') + ' >') : undefined

      const ancestorIcon = ancestors.findLast(a => a.icon)?.icon

      acc.push({
        label: result.title,
        labelHtml: result.snippets?.title ? sanitizeSnippet(result.snippets.title) : undefined,
        prefix,
        description: result.content.replaceAll('<', '&lt;').replaceAll('>', '&gt;'),
        descriptionHtml: result.snippets?.content ? sanitizeSnippet(result.snippets.content) : undefined,
        to: result.id,
        icon: (link?.icon || ancestorIcon || (result.level > 1 ? appConfig.ui.icons.hash : appConfig.ui.icons.file)) as string,
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
    mapFile,
    mapNavigationItems,
    mapLinks,
    mapSearchResults,
    postFilter
  }
}

export const useContentSearch = /* @__PURE__ */ createSharedComposable(_useContentSearch)
