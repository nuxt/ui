// This route will be pre-rendered as /api/navigation.json
import { defineEventHandler } from 'h3'
import { queryCollectionNavigation } from '@nuxt/content/server'

export default defineEventHandler((event) => {
  return queryCollectionNavigation(event, 'docs', ['framework', 'category', 'description', 'to', 'target'])
})
