import { queryCollection } from '@nuxt/content/server'

export default defineCachedEventHandler(async (event) => {
  // Use the same approach as /pages/components.vue
  return await queryCollection(event, 'docs')
    .where('path', 'LIKE', '%/composables/%')
    .where('extension', '=', 'md')
    .select('path', 'title', 'description')
    .all()
}, {
  name: 'mcp-list-composables',
  maxAge: 3600 // 1 hour
})
