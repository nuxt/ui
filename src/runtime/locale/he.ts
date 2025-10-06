import type { Messages } from '../types'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'Hebrew',
  code: 'he',
  dir: 'rtl',
  messages: {
    alert: {
      close: 'סגור'
    },
    authForm: {
      hidePassword: 'הסתר סיסמה',
      showPassword: 'הצג סיסמה',
      submit: 'המשך'
    },
    banner: {
      close: 'סגור'
    },
    calendar: {
      nextMonth: 'חודש הבא',
      nextYear: 'שנה הבאה',
      prevMonth: 'חודש קודם',
      prevYear: 'שנה קודמת'
    },
    carousel: {
      dots: 'בחר שקופית להצגה',
      goto: 'מעבר ל {slide}',
      next: 'הבא',
      prev: 'הקודם'
    },
    chatPrompt: {
      placeholder: 'כתוב את ההודעה שלך כאן…'
    },
    chatPromptSubmit: {
      label: 'שלח'
    },
    colorMode: {
      dark: 'כהה',
      light: 'בהיר',
      switchToDark: 'עבור למצב כהה',
      switchToLight: 'עבור למצב בהיר',
      system: 'מערכת'
    },
    commandPalette: {
      back: 'חזור',
      close: 'סגור',
      noData: 'אין נתונים זמינים',
      noMatch: 'לא נמצאה התאמה',
      placeholder: 'הקלד פקודה…'
    },
    contentSearch: {
      links: 'קישורים',
      theme: 'ערכת נושא'
    },
    contentSearchButton: {
      label: 'חיפוש…'
    },
    contentToc: {
      title: 'בדף זה'
    },
    dashboardSearch: {
      theme: 'ערכת נושא'
    },
    dashboardSearchButton: {
      label: 'חיפוש…'
    },
    dashboardSidebarCollapse: {
      collapse: 'כווץ סרגל צד',
      expand: 'הרחב סרגל צד'
    },
    dashboardSidebarToggle: {
      close: 'סגור סרגל צד',
      open: 'פתח סרגל צד'
    },
    error: {
      clear: 'חזרה לדף הבית'
    },
    fileUpload: {
      removeFile: 'הסר {filename}'
    },
    header: {
      close: 'סגור תפריט',
      open: 'פתח תפריט'
    },
    inputMenu: {
      create: 'צור "{label}"',
      noData: 'אין נתונים',
      noMatch: 'אין התאמה'
    },
    inputNumber: {
      decrement: 'הפחת',
      increment: 'הוסף'
    },
    modal: {
      close: 'סגור'
    },
    pricingTable: {
      caption: 'שיפור מחירון'
    },
    prose: {
      codeCollapse: {
        closeText: 'כווץ',
        name: 'קוד',
        openText: 'הרחב'
      },
      collapsible: {
        closeText: 'הסתר',
        name: 'מאפיינים',
        openText: 'הצג'
      },
      pre: {
        copy: 'העתק קוד ללוח'
      }
    },
    selectMenu: {
      create: 'צור "{label}"',
      noData: 'אין נתונים',
      noMatch: 'לא נמצאה התאמה',
      search: 'חפש…'
    },
    slideover: {
      close: 'סגור'
    },
    table: {
      noData: 'אין נתונים להצגה'
    },
    toast: {
      close: 'סגור'
    }
  }
})
