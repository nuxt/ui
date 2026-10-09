import type { Messages } from '../types/locale'
import { defineLocale } from '../composables/defineLocale'

export default defineLocale<Messages>({
  name: 'עברית',
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
    breadcrumb: {
      label: 'פירורי לחם'
    },
    calendar: {
      label: 'תאריך האירוע',
      monthPicker: 'בורר חודש',
      nextMonth: 'חודש הבא',
      nextYear: 'שנה הבאה',
      prevMonth: 'חודש קודם',
      prevYear: 'שנה קודמת',
      yearPicker: 'בורר שנה'
    },
    carousel: {
      dots: 'בחר שקופית להצגה',
      goto: 'מעבר ל {slide}',
      next: 'הבא',
      prev: 'הקודם',
      roledescription: 'קרוסלה',
      slide: 'שקופית'
    },
    chatMessages: {
      autoScroll: 'גלול למטה'
    },
    chatPrompt: {
      placeholder: 'כתוב את ההודעה שלך כאן…'
    },
    chatPromptSubmit: {
      label: 'שלח',
      reload: 'נסה שוב',
      stop: 'עצור את היצירה'
    },
    chatReasoning: {
      thinking: 'חושב…',
      thought: 'חשב',
      thoughtFor: 'חשב במשך {duration}'
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
      search: 'תוצאות',
      theme: 'ערכת נושא'
    },
    contentSearchButton: {
      label: 'חיפוש…'
    },
    contentToc: {
      title: 'בדף זה'
    },
    dropdownMenu: {
      noMatch: 'לא נמצאה התאמה',
      search: 'חפש…'
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
    drawer: {
      close: 'סגור'
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
    inputDate: {
      day: 'יום',
      dayPeriod: 'לפנה״צ/אחה״צ',
      era: 'תקופה',
      hour: 'שעה',
      minute: 'דקה',
      month: 'חודש',
      second: 'שנייה',
      timeZoneName: 'אזור זמן',
      year: 'שנה'
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
    inputRating: {
      rate: 'דירוג {value} מתוך {length}'
    },
    inputTime: {
      dayPeriod: 'לפנה״צ/אחה״צ',
      hour: 'שעה',
      minute: 'דקה',
      second: 'שנייה',
      timeZoneName: 'אזור זמן'
    },
    listbox: {
      noData: 'אין נתונים',
      noMatch: 'לא נמצאה התאמה',
      search: 'חפש…'
    },
    modal: {
      close: 'סגור'
    },
    pagination: {
      first: 'עמוד ראשון',
      last: 'עמוד אחרון',
      next: 'עמוד הבא',
      page: 'עמוד {page}',
      prev: 'עמוד הקודם'
    },
    pinInput: {
      input: 'קוד PIN, תו {index} מתוך {length}'
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
      },
      prompt: {
        copy: 'העתק הנחיה',
        openIn: 'פתח ב-{name}'
      }
    },
    sidebar: {
      close: 'סגור',
      toggle: 'החלף'
    },
    selectMenu: {
      create: 'צור "{label}"',
      noData: 'אין נתונים',
      noMatch: 'לא נמצאה התאמה',
      search: 'חפש…'
    },
    skeleton: {
      label: 'טוען'
    },
    slideover: {
      close: 'סגור'
    },
    slider: {
      max: 'מקסימום',
      min: 'מינימום',
      thumb: 'מחוון',
      value: 'ערך {index} מתוך {total}'
    },
    table: {
      noData: 'אין נתונים להצגה'
    },
    toast: {
      close: 'סגור'
    },
    toaster: {
      label: 'התראה',
      viewport: 'התראות ({hotkey})'
    }
  }
})
