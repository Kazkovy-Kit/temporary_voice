import {z} from "zod";
import type {BotModuleResponse} from "../../../types";


export default defineEventHandler(async (event) => {
    await requireUserSession(event)

    const guildId = getGuildID(event)

    const {data: body} = await readValidatedBody(event, z.object({
        type: z.string(),
        actions: z.array(z.string()),
    }).safeParse)

    return callBotAPI<BotModuleResponse>(event, `modules/${guildId}/temporary_voice/settings`, {method: 'post', body});
});
