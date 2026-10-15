import type { Messages } from '../types/locale'
import { defineLocale } from '../composables/defineLocale'
import de from './de'

export default defineLocale<Messages>({
  name: 'Deutsch (Österreich)',
  code: 'de-AT',
  messages: de.messages
})
