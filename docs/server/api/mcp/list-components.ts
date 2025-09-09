export default defineCachedEventHandler(async (event) => {
  // Use the same approach as /pages/components.vue
  // @ts-expect-error TODO: This will be fixed when the tsconfig is setup correctly
  return await queryCollection(event, 'docs')
    .where('path', 'LIKE', '%/components/%')
    .where('extension', '=', 'md')
    // @ts-expect-error TODO: This will be fixed when the tsconfig is setup correctly
    .select('path', 'title', 'description', 'category')
    .all()
}, {
  name: 'mcp-list-components',
  maxAge: 3600 // 1 hour
})
