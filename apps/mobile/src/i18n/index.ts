import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { getLocales } from 'expo-localization'
import { en } from './en'
import { fr } from './fr'

export const resources = {
  en: { translation: en },
  fr: { translation: fr },
} as const

// expo-localization getLocales() is synchronous and uses TurboModules —
// compatible with React Native New Architecture (bridgeless mode).
// NativeModules.SettingsManager was unreliable in New Architecture.
function getDeviceLocale(): string {
  try {
    const locales = getLocales()
    return locales[0]?.languageCode ?? locales[0]?.languageTag ?? 'en'
  } catch {
    return 'en'
  }
}

const supportedLocale = getDeviceLocale().startsWith('fr') ? 'fr' : 'en'

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
