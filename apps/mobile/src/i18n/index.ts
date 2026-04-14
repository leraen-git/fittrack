import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { getLocales } from 'expo-localization'
import { en } from './en'
import { fr } from './fr'

export const resources = {
  en: { translation: en },
  fr: { translation: fr },
} as const

// Detect device language, fall back to English
const deviceLocale = getLocales()[0]?.languageCode ?? 'en'
const supportedLocale = deviceLocale.startsWith('fr') ? 'fr' : 'en'

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: supportedLocale,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React Native handles escaping
    },
  })

export default i18n
export type { Translations } from './en'
