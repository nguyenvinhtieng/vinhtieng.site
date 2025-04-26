import { type ModuleOptions } from "@nuxtjs/i18n";

export const i18n: ModuleOptions = {
  defaultLocale: "en",
  locales: [
    {
      code: "en",
      name: "English",
      file: "en.json",
    },
    {
      code: "vi",
      name: "Tiếng Việt",
      file: "vi.json",
    },
  ],
  strategy: "prefix",
  detectBrowserLanguage: {
    useCookie: true,
    cookieKey: "i18n_redirected",
    fallbackLocale: "en",
	 redirectOn: 'root',
  },
  langDir: "locales/",
  lazy: true,
};
