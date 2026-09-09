export default defineEventHandler(async () => {
  // the notes are served per release by releases/[tag]
  return (await fetchReleases()).map(({ markdown, ...release }) => release)
})
