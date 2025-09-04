export default defineCachedEventHandler(async (event) => {
  // Use the same approach as /pages/components.vue
  // @ts-expect-error TODO: This will be fixed when the tsconfig is setup correctly
  const components = await queryCollection(event, 'docs')
    .where('path', 'LIKE', '%/components/%')
    .where('extension', '=', 'md')
    // @ts-expect-error TODO: This will be fixed when the tsconfig is setup correctly
    .select('path', 'title', 'description', 'category')
    .all()

  // Group components by category
  const componentsPerCategory = components.reduce((acc, component) => {
    // @ts-expect-error TODO: This will be fixed when the tsconfig is setup correctly
    const category = component.category || 'uncategorized'
    acc[category] = [...(acc[category] || []), component]
    return acc
  }, {} as Record<string, any[]>)

  // Extract component names from paths
  const componentNames = components
    .map(comp => comp.path?.split('/').pop()?.toLowerCase())
    .filter((name): name is string => !!name)
    .sort()

  return {
    repository: 'https://github.com/nuxt/ui',
    documentation: 'https://ui.nuxt.com/components',
    components: componentNames,
    total: componentNames.length,
    categories: componentsPerCategory
  }
}, {
  name: 'mcp-list-components',
  maxAge: 3600 // 1 hour
})
