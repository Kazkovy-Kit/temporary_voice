// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: {enabled: true},
    extends: ['@kazkovy-kit/modules'],
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
