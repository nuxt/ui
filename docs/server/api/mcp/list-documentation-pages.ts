export default defineCachedEventHandler(async (event) => {
  // @ts-expect-error TODO: This will be fixed when the tsconfig is setup correctly
  const page = await queryCollection(event, 'docs').all()

  return page.map(doc => ({
    title: doc.title,
    description: doc.description,
    path: doc.path
  }))
}, {
  name: 'mcp-list-documentation-pages',
  maxAge: 3600 // 1 hour
})
