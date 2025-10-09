import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Hindi',
  code: 'hi',
  messages: {
    alert: {
      close: 'बंद करें'
    },
    authForm: {
      hidePassword: 'पासवर्ड छिपाएं',
      showPassword: 'पासवर्ड दिखाएं',
      submit: 'जारी रखें'
    },
    banner: {
      close: 'बंद करें'
    },
    calendar: {
      nextMonth: 'अगला महीना',
      nextYear: 'अगला वर्ष',
      prevMonth: 'पिछला महीना',
      prevYear: 'पिछला वर्ष'
    },
    carousel: {
      dots: 'प्रदर्शित करने के लिए स्लाइड चुनें',
      goto: 'स्लाइड {slide} पर जाएं',
      next: 'अगला',
      prev: 'पिछला'
    },
    chatPrompt: {
      placeholder: 'यहाँ आपका संदेश लिखें…'
    },
    chatPromptSubmit: {
      label: 'भेजें'
    },
    colorMode: {
      dark: 'गहरा',
      light: 'हल्का',
      switchToDark: 'गहरे मोड में बदलें',
      switchToLight: 'हल्के मोड में बदलें',
      system: 'सिस्टम'
    },
    commandPalette: {
      back: 'वापस',
      close: 'बंद करें',
      noData: 'कोई डेटा नहीं',
      noMatch: 'कोई मेल खाता डेटा नहीं',
      placeholder: 'एक आदेश या खोज टाइप करें…'
    },
    contentSearch: {
      links: 'लिंक्स',
      theme: 'थीम'
    },
    contentSearchButton: {
      label: 'खोजें…'
    },
    contentToc: {
      title: 'इस पृष्ठ पर'
    },
    dashboardSearch: {
      theme: 'थीम'
    },
    dashboardSearchButton: {
      label: 'खोजें…'
    },
    dashboardSidebarCollapse: {
      collapse: 'साइडबार संकुचित करें',
      expand: 'साइडबार विस्तारित करें'
    },
    dashboardSidebarToggle: {
      close: 'साइडबार बंद करें',
      open: 'साइडबार खोलें'
    },
    error: {
      clear: 'होम पेज पर वापस जाएं'
    },
    fileUpload: {
      removeFile: '{filename} हटाएं'
    },
    header: {
      close: 'मेनू बंद करें',
      open: 'मेनू खोलें'
    },
    inputMenu: {
      create: '"{label}" बनाएँ',
      noData: 'कोई डेटा नहीं',
      noMatch: 'कोई मेल खाता डेटा नहीं'
    },
    inputNumber: {
      decrement: 'घटाना',
      increment: 'बढ़ाना'
    },
    modal: {
      close: 'बंद करें'
    },
    pricingTable: {
      caption: 'कीमत योजनाओं की तुलना'
    },
    prose: {
      codeCollapse: {
        closeText: 'संकुचित करें',
        name: 'कोड',
        openText: 'विस्तार करें'
      },
      collapsible: {
        closeText: 'छिपाएँ',
        name: 'गुण',
        openText: 'दिखाएँ'
      },
      pre: {
        copy: 'कोड को क्लिपबोर्ड पर कॉपी करें'
      }
    },
    selectMenu: {
      create: '"{label}" बनाएँ',
      noData: 'कोई डेटा नहीं',
      noMatch: 'कोई मेल खाता डेटा नहीं',
      search: 'खोजें…'
    },
    slideover: {
      close: 'बंद करें'
    },
    table: {
      noData: 'कोई डेटा नहीं'
    },
    toast: {
      close: 'बंद करें'
    }
  }
})
