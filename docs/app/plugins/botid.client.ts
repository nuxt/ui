import { initBotId } from 'botid/client/core'

// Attaches the BotID challenge headers to the AI routes, `assertNotBot` checks them server-side
export default defineNuxtPlugin({
  enforce: 'pre',
  setup() {
    initBotId({
      protect: [
        { path: '/api/ai', method: 'POST' },
        { path: '/api/chat', method: 'POST' },
        { path: '/api/completion', method: 'POST' }
      ]
    })
  }
})
