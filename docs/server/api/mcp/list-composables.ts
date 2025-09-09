export default defineCachedEventHandler(async (event) => {
  // Use the same approach as /pages/components.vue
  // @ts-expect-error TODO: This will be fixed when the tsconfig is setup correctly
  return await queryCollection(event, 'docs')
    .where('path', 'LIKE', '%/composables/%')
    .where('extension', '=', 'md')
    .select('path', 'title', 'description')
    .all()
}, {
  name: 'mcp-list-composables',
  maxAge: 3600 // 1 hour
})
