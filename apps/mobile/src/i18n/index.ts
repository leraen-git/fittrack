import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { NativeModules, Platform } from 'react-native'
import { en } from './en'
import { fr } from './fr'

export const resources = {
  en: { translation: en },
  fr: { translation: fr },
} as const

// Detect device language without requiring a native rebuild.
// iOS:     NativeModules.SettingsManager.settings.AppleLanguages[0]  (e.g. "fr-FR")
// Android: NativeModules.I18nManager.localeIdentifier                (e.g. "fr_FR")
// Fallback: Intl API (may return en-US on some Hermes builds regardless of locale)
function getDeviceLocale(): string {
  try {
    if (Platform.OS === 'ios') {
      const settings = NativeModules.SettingsManager?.settings
      const lang =
        settings?.AppleLanguages?.[0] ??
        settings?.AppleLocale ??
        ''
      if (lang) return lang
    }
    if (Platform.OS === 'android') {
      const locale = NativeModules.I18nManager?.localeIdentifier ?? ''
      if (locale) return locale
    }
    return Intl.DateTimeFormat().resolvedOptions().locale ?? 'en'
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
