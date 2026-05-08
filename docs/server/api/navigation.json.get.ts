// This route will be pre-rendered as /api/navigation.json
import { queryCollectionNavigation } from '@nuxt/content/server'

export default defineEventHandler((event) => {
  return queryCollectionNavigation(event, 'docs', ['framework', 'category'])
})
