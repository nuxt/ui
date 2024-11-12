import { defineLocale } from '../composables/defineLocale'

export default defineLocale('Français', 'fr', {
  inputMenu: {
    noMatch: 'Aucune donnée correspondante',
    noData: 'Aucune donnée',
    create: 'Créer "{label}"'
  },
  commandPalette: {
    noMatch: 'Aucune donnée correspondante',
    noData: 'Aucune donnée',
    close: 'Fermer'
  },
  selectMenu: {
    noMatch: 'Aucune donnée correspondante',
    noData: 'Aucune donnée',
    create: 'Créer "{label}"'
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
})
