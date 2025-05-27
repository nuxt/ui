import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Français',
  code: 'fr',
  messages: {
    inputMenu: {
      noMatch: 'Aucune donnée correspondante',
      noData: 'Aucune donnée',
      create: 'Créer "{label}"'
    },
    calendar: {
      prevYear: 'Année précédente',
      nextYear: 'Année suivante',
      prevMonth: 'Mois précédent',
      nextMonth: 'Mois suivant'
    },
    inputNumber: {
      increment: 'Augmenter',
      decrement: 'Diminuer'
    },
    commandPalette: {
      placeholder: 'Tapez une commande ou recherchez...',
      noMatch: 'Aucune donnée correspondante',
      noData: 'Aucune donnée',
      close: 'Fermer',
      back: 'Retour'
    },
    selectMenu: {
      noMatch: 'Aucune donnée correspondante',
      noData: 'Aucune donnée',
      create: 'Créer "{label}"',
      search: 'Rechercher...'
    },
    toast: {
      close: 'Fermer'
    },
    carousel: {
      prev: 'Précédent',
      next: 'Suivant',
      goto: 'Aller à {slide}'
    },
    modal: {
      close: 'Fermer'
    },
    slideover: {
      close: 'Fermer'
    },
    alert: {
      close: 'Fermer'
    },
    table: {
      noData: 'Aucune donnée'
    }
  }
})
