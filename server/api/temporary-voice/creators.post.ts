import type { BotModuleResponse } from "../../../types";

export default defineEventHandler(async (event) => {
  await requireUserSession(event);

  const guildId = getGuildID(event);

  return callBotAPI<BotModuleResponse>(
    event,
    `modules/${guildId}/temporary-voice/creators`,
    { method: "post" },
  );
});
