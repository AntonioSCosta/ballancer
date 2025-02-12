
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import all translations
import enTranslations from "./locales/en.json";
import ptPTTranslations from "./locales/pt-PT.json";
import ptBRTranslations from "./locales/pt-BR.json";
import frTranslations from "./locales/fr.json";
import esTranslations from "./locales/es.json";
import itTranslations from "./locales/it.json";

const resources = {
  en: {
    translation: enTranslations,
  },
  "pt-PT": {
    translation: ptPTTranslations,
  },
  "pt-BR": {
    translation: ptBRTranslations,
  },
  fr: {
    translation: frTranslations,
  },
  es: {
    translation: esTranslations,
  },
  it: {
    translation: itTranslations,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem("language") || "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
