import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { getLocales } from 'expo-localization'
import { AppState, type AppStateStatus } from 'react-native'
import { en } from './en'
import { fr } from './fr'

export const resources = {
  en: { translation: en },
  fr: { translation: fr },
} as const

function getDeviceLocale(): string {
  try {
    const locales = getLocales()
    return locales[0]?.languageCode ?? locales[0]?.languageTag ?? 'en'
  } catch {
    return 'en'
  }
}

function toSupported(locale: string): 'fr' | 'en' {
  return locale.startsWith('fr') ? 'fr' : 'en'
}

const supportedLocale = toSupported(getDeviceLocale())

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: supportedLocale,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  })

AppState.addEventListener('change', (state: AppStateStatus) => {
  if (state !== 'active') return
  const lang = toSupported(getDeviceLocale())
  if (lang !== i18n.language) {
    i18n.changeLanguage(lang)
  }
})

export default i18n
export type { Translations } from './en'
