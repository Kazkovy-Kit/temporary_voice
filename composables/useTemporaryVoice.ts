import type {GetSettingsResponse, Creator} from '../types'

export function useTemporaryVoice() {
    const config = useAppConfig()

    let getSettings = () => $fetch<GetSettingsResponse>('/api/modules/temporary_voice/settings')

    let updateSettings = (values: { actions: string[], type: string }) =>
        $fetch<GetSettingsResponse>('/api/modules/temporary_voice/settings', {
            method: 'POST',
            body: values,
        })

    if (config.playground) {
        //mock fake data
        getSettings = async (): Promise<GetSettingsResponse> => ({
            actions: ['rename', 'limit_add', 'limit_remove', 'limit_edit'],
            type: 'personal',
            creators: [
                {
                    id: "1",
                    name: 'Test creator',
                    source_parent_id: "1",
                    channel: {
                        name: "Test channel"
                    }
                }
            ]
        })


        updateSettings = async (values: { actions: string[], type: string }) => ({
            actions: ['rename', 'limit_add', 'limit_remove', 'limit_edit'],
            type: 'personal',
            creators: [
                {
                    id: "1",
                    name: 'Test creator',
                    source_parent_id: "1",
                    channel: {
                        name: "Test channel"
                    }
                }
            ]
        })
    }

    const getCreators = () => $fetch<Creator[]>('/api/modules/temporary_voice/creators')

    const createCreator = () =>
        $fetch('/api/modules/temporary_voice/creators', {
            method: 'POST',
        })

    const deleteCreator = (creatorId: string) =>
        $fetch(`/api/modules/temporary_voice/creator/${creatorId}/delete`, {
            method: 'POST',
        })

    return {
        getSettings,
        updateSettings,
        getCreators,
        createCreator,
        deleteCreator,
    }
}