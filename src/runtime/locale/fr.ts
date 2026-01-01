import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Français',
  code: 'fr',
  messages: {
    alert: {
      close: 'Fermer'
    },
    authForm: {
      hidePassword: 'Masquer le mot de passe',
      showPassword: 'Afficher le mot de passe',
      submit: 'Continuer'
    },
    banner: {
      close: 'Fermer'
    },
    calendar: {
      nextMonth: 'Mois suivant',
      nextYear: 'Année suivante',
      prevMonth: 'Mois précédent',
      prevYear: 'Année précédente'
    },
    carousel: {
      dots: 'Choisir la diapositive à afficher',
      goto: 'Aller à {slide}',
      next: 'Suivant',
      prev: 'Précédent'
    },
    chatPrompt: {
      placeholder: 'Écrivez votre message ici…'
    },
    chatPromptSubmit: {
      label: 'Envoyer'
    },
    colorMode: {
      dark: 'Sombre',
      light: 'Clair',
      switchToDark: 'Passer en mode sombre',
      switchToLight: 'Passer en mode clair',
      system: 'Système'
    },
    commandPalette: {
      back: 'Retour',
      close: 'Fermer',
      noData: 'Aucune donnée',
      noMatch: 'Aucune donnée correspondante',
      placeholder: 'Tapez une commande ou recherchez…'
    },
    contentSearch: {
      links: 'Liens',
      theme: 'Thème'
    },
    contentSearchButton: {
      label: 'Rechercher…'
    },
    contentToc: {
      title: 'Sur cette page'
    },
    dashboardSearch: {
      theme: 'Thème'
    },
    dashboardSearchButton: {
      label: 'Rechercher…'
    },
    dashboardSidebarCollapse: {
      collapse: 'Replier la barre latérale',
      expand: 'Déployer la barre latérale'
    },
    dashboardSidebarToggle: {
      close: 'Fermer la barre latérale',
      open: 'Ouvrir la barre latérale'
    },
    error: {
      clear: 'Retour à l\'accueil'
    },
    fileUpload: {
      removeFile: 'Supprimer {filename}'
    },
    header: {
      close: 'Fermer le menu',
      open: 'Ouvrir le menu'
    },
    inputMenu: {
      create: 'Créer "{label}"',
      noData: 'Aucune donnée',
      noMatch: 'Aucune donnée correspondante'
    },
    inputNumber: {
      decrement: 'Diminuer',
      increment: 'Augmenter'
    },
    modal: {
      close: 'Fermer'
    },
    pricingTable: {
      caption: 'Comparaison des plans de prix'
    },
    prose: {
      codeCollapse: {
        closeText: 'Réduire',
        name: 'code',
        openText: 'Développer'
      },
      collapsible: {
        closeText: 'Masquer',
        name: 'propriétés',
        openText: 'Afficher'
      },
      pre: {
        copy: 'Copier le code dans le presse-papiers'
      }
    },
    selectMenu: {
      create: 'Créer "{label}"',
      noData: 'Aucune donnée',
      noMatch: 'Aucune donnée correspondante',
      search: 'Rechercher…'
    },
    slideover: {
      close: 'Fermer'
    },
    table: {
      noData: 'Aucune donnée'
    },
    toast: {
      close: 'Fermer'
    }
  }
})
