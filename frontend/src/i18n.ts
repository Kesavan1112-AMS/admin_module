import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../src/language/en.json";
import id from "../src/language/in.json";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
    id: {
      translation: id,
    },
  },
  fallbackLng: "en",
  debug: true,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
