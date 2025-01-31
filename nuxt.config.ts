// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: {enabled: true},
    extends: [
        '@kazkovy-kit/ui',
        '@kazkovy-kit/auth'
    ],
    i18n: {
        locales: [
            {
                code: 'en',
                file: 'en.js'
            },
            {
                code: 'uk',
                file: 'uk.js'
            }
        ]
    }
})
