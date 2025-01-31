export default defineAppConfig({
    modules: [
        {
            id: 'temporary_voice',
            icon: 'lucide:mic-vocal',
            items: [
                {
                    id: 'settings',
                    to: {
                        name: 'temporary_voice-settings',
                    },
                }
            ]
        }
    ]
})
