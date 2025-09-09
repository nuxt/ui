export default defineCachedEventHandler(async (event) => {
  // Use the same approach as /pages/components.vue
  // @ts-expect-error TODO: This will be fixed when the tsconfig is setup correctly
  const componentDocs = await queryCollection(event, 'docs')
    .where('path', 'LIKE', '%/components/%')
    .where('extension', '=', 'md')
    // @ts-expect-error TODO: This will be fixed when the tsconfig is setup correctly
    .select('path', 'title', 'description', 'category')
    .all()

  // Extract component names from paths
  return componentDocs
    .map(comp => comp.path?.split('/').pop()?.toLowerCase())
    .filter((name): name is string => !!name)
    .sort()
}, {
  name: 'mcp-list-components',
  maxAge: 3600 // 1 hour
})
