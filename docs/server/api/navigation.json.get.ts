// This route will be pre-rendered as /api/navigation.json
import { defineEventHandler } from 'h3'
import { queryCollectionNavigation } from '@nuxt/content/server'
import type { ContentNavigationItem } from '@nuxt/content'

// The tree lands in the payload of every page. Each requested field comes back as `null` on
// the pages that don't set it, and `stem` is only read by `findPageHeadline` without
// `indexAsChild`, which the docs never call.
function compact(items: ContentNavigationItem[]): ContentNavigationItem[] {
  return items.map((item) => {
    const { stem, children, ...rest } = item
    const entries = Object.entries(rest).filter(([, value]) => value !== null)

    return {
      ...Object.fromEntries(entries),
      ...(children ? { children: compact(children) } : {})
    } as ContentNavigationItem
  })
}

export default defineEventHandler(async (event) => {
  return compact(await queryCollectionNavigation(event, 'docs', ['framework', 'category', 'description', 'to', 'target']))
})
