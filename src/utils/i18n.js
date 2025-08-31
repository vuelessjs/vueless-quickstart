import { createI18n } from "vue-i18n";

/* Import all locales. */
import en from "@/i18n/en.yaml";

export const FALLBACK_LOCALE = "en";
export const LOCALE_KEY = "language";

/**
 * Create Vue i18n instance.
 */
export const i18nInstance = createI18n({
  legacy: false,
  messages: {
    en,
  },
  locale: getActiveLanguage(),
  fallbackLocale: FALLBACK_LOCALE,
  missing: (locale, key) => {
    const isLocaleKey = i18nInstance.global.te(key);

    if (!isLocaleKey) {
      /* eslint-disable no-console */
      console.warn(
        `Missing translation for key "${key}" in locale "${locale}". Please check the translation files.`,
      );
      console.groupCollapsed(`${key} trace`);
      console.trace();
      console.groupEnd();
      /* eslint-enable no-console */
    }
  },
  fallbackWarn: false,
  missingWarn: false,
  pluralRules: {
    ru: pluralizationRules,
    ua: pluralizationRules,
  },
});

/**
 * Pluralization rules for Ukrainian and other Slavic languages.
 */
function pluralizationRules(value, plurals) {
  let pluralIndex = 0;

  if (value) {
    const remainder = value % 10;
    const teen = value > 10 && value < 20;
    const endsWithOne = remainder === 1;

    if (plurals < 4) {
      pluralIndex = !teen && endsWithOne ? 1 : 2;
    } else {
      pluralIndex = 3;
      if (!teen && endsWithOne) pluralIndex = 1;
      if (!teen && remainder >= 2 && remainder <= 4) pluralIndex = 2;
    }
  }

  return pluralIndex;
}

/**
 * Save the active language to the localStorage.
 */
export function setActiveLanguage(lang) {
  i18nInstance.global.locale.value = lang;
  localStorage.setItem(LOCALE_KEY, lang);

  window.location.reload();
}

/**
 * Get the current active language from localStorage or set default if non exists.
 */
export function getActiveLanguage() {
  return localStorage.getItem(LOCALE_KEY) || FALLBACK_LOCALE;
}

export const i18n = i18nInstance.global;
