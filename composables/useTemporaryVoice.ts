import type {GetSettingsResponse, Creator} from '../types'

export function useTemporaryVoice() {
    const getSettings = () => $fetch<GetSettingsResponse>('/api/temporary_voice/settings')

    const updateSettings = (values: { actions: string[], type: string }) =>
        $fetch<GetSettingsResponse>('/api/temporary_voice/settings', {
            method: 'POST',
            body: values,
        })

    const getCreators = () => $fetch<Creator[]>('/api/temporary_voice/creators')

    const createCreator = () =>
        $fetch('/api/temporary_voice/creators', {
            method: 'POST',
        })

    const deleteCreator = (creatorId: string) =>
        $fetch(`/api/temporary_voice/creator/${creatorId}/delete`, {
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