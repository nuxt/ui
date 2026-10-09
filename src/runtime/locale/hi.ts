import type { Messages } from '../types/locale'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'हिन्दी',
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
    breadcrumb: {
      label: 'ब्रेडक्रंब'
    },
    calendar: {
      label: 'इवेंट की तारीख',
      monthPicker: 'महीना चयनकर्ता',
      nextMonth: 'अगला महीना',
      nextYear: 'अगला वर्ष',
      prevMonth: 'पिछला महीना',
      prevYear: 'पिछला वर्ष',
      yearPicker: 'वर्ष चयनकर्ता'
    },
    carousel: {
      dots: 'प्रदर्शित करने के लिए स्लाइड चुनें',
      goto: 'स्लाइड {slide} पर जाएं',
      next: 'अगला',
      prev: 'पिछला',
      roledescription: 'कैरोसेल',
      slide: 'स्लाइड'
    },
    chatMessages: {
      autoScroll: 'नीचे स्क्रॉल करें'
    },
    chatPrompt: {
      placeholder: 'यहाँ आपका संदेश लिखें…'
    },
    chatPromptSubmit: {
      label: 'भेजें',
      reload: 'फिर से कोशिश करें',
      stop: 'जनरेट करना रोकें'
    },
    chatReasoning: {
      thinking: 'सोच रहा है…',
      thought: 'सोचा',
      thoughtFor: '{duration} सोचा'
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
      search: 'परिणाम',
      theme: 'थीम'
    },
    contentSearchButton: {
      label: 'खोजें…'
    },
    contentToc: {
      title: 'इस पृष्ठ पर'
    },
    dropdownMenu: {
      noMatch: 'कोई मेल खाता डेटा नहीं',
      search: 'खोजें…'
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
    drawer: {
      close: 'बंद करें'
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
    inputDate: {
      day: 'दिन',
      dayPeriod: 'AM/PM',
      era: 'युग',
      hour: 'घंटा',
      minute: 'मिनट',
      month: 'महीना',
      second: 'सेकंड',
      timeZoneName: 'समय क्षेत्र',
      year: 'वर्ष'
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
    inputRating: {
      rate: '{length} में से {value} रेटिंग दें'
    },
    inputTime: {
      dayPeriod: 'AM/PM',
      hour: 'घंटा',
      minute: 'मिनट',
      second: 'सेकंड',
      timeZoneName: 'समय क्षेत्र'
    },
    listbox: {
      noData: 'कोई डेटा नहीं',
      noMatch: 'कोई मेल खाता डेटा नहीं',
      search: 'खोजें…'
    },
    modal: {
      close: 'बंद करें'
    },
    pagination: {
      first: 'पहला पृष्ठ',
      last: 'अंतिम पृष्ठ',
      next: 'अगला पृष्ठ',
      page: 'पृष्ठ {page}',
      prev: 'पिछला पृष्ठ'
    },
    pinInput: {
      input: 'पिन कोड, {length} में से वर्ण {index}'
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
      },
      prompt: {
        copy: 'प्रॉम्प्ट कॉपी करें',
        openIn: '{name} में खोलें'
      }
    },
    sidebar: {
      close: 'बंद करें',
      toggle: 'टॉगल करें'
    },
    selectMenu: {
      create: '"{label}" बनाएँ',
      noData: 'कोई डेटा नहीं',
      noMatch: 'कोई मेल खाता डेटा नहीं',
      search: 'खोजें…'
    },
    skeleton: {
      label: 'लोड हो रहा है'
    },
    slideover: {
      close: 'बंद करें'
    },
    slider: {
      max: 'अधिकतम',
      min: 'न्यूनतम',
      thumb: 'हैंडल',
      value: '{total} में से मान {index}'
    },
    table: {
      noData: 'कोई डेटा नहीं'
    },
    toast: {
      close: 'बंद करें'
    },
    toaster: {
      label: 'सूचना',
      viewport: 'सूचनाएं ({hotkey})'
    }
  }
})
