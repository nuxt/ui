import { createError } from 'nuxt/server'
import { checkBotId } from 'botid/server'

/**
 * Rejects requests BotID classifies as bots on the routes that call paid models. The routes
 * must also be listed in `app/plugins/botid.client.ts`. Bypassed in development.
 */
export async function assertNotBot() {
  const { isBot } = await checkBotId()
  if (isBot) {
    throw createError({ status: 403, message: 'Access denied' })
  }
}
