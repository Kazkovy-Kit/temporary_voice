import type { GetSettingsResponse, Creator } from "../types";

export function useTemporaryVoice() {
  const getSettings = () =>
    $fetch<GetSettingsResponse>("/api/temporary-voice/settings");

  const updateSettings = (values: { actions: string[]; type: string }) =>
    $fetch<GetSettingsResponse>("/api/temporary-voice/settings", {
      method: "POST",
      body: values,
    });

  const getCreators = () => $fetch<Creator[]>("/api/temporary-voice/creators");

  const createCreator = () =>
    $fetch("/api/temporary-voice/creators", {
      method: "POST",
    });

  const deleteCreator = (creatorId: string) =>
    $fetch(`/api/temporary-voice/creator/${creatorId}/delete`, {
      method: "POST",
    });

  return {
    getSettings,
    updateSettings,
    getCreators,
    createCreator,
    deleteCreator,
  };
}
