<script setup lang="ts">

import type {FormContext} from "vee-validate";

const {form} = defineProps<{
  form: FormContext<any, any>
}>()

const {currentBot} = useBotsStore()

const {t} = useI18n({
  useScope: 'local'
})

const actions = ref([
  {icon: "lucide:pencil-line", id: 'rename', name: t('actions.rename')},
  {icon: "lucide:user-plus", id: 'limit_add', name: t('actions.limit_add')},
  {icon: "lucide:user-minus", id: 'limit_remove', name: t('actions.limit_remove')},
  {icon: "lucide:user-pen", id: 'limit_edit', name: t('actions.limit_edit')},

  {icon: "lucide:lock-keyhole", id: 'add_user_to_block_list', name: t('actions.block_add')},
  {icon: "lucide:lock-keyhole-open", id: 'remove_user_from_block_list', name: t('actions.block_remove')},
  {icon: "lucide:scan-face", id: 'add_user_to_whitelist', name: t('actions.whitelist_add')},
  {icon: "lucide:scan-line", id: 'remove_user_from_whitelist', name: t('actions.whitelist_remove')},

  {icon: "lucide:globe-lock", id: 'private', name: t('actions.private')},
  {icon: "lucide:list-ordered", id: 'history', name: t('actions.history')},
  {icon: "lucide:send-to-back", id: 'transfer', name: t('actions.transfer')},
  {icon: "lucide:crown", id: 'owner', name: t('actions.owner')},
])


function handleAction(action: any) {
  const activeActions = form.values['actions'] || []
  if (activeActions.findIndex((actionId: string) => actionId === action.id) !== -1) {
    form.setFieldValue('actions', [...activeActions.filter((actionId: string) => action.id !== actionId)].sort())
  } else {
    form.setFieldValue('actions', [...activeActions, action.id])
  }
}
</script>

<template>
  <Alert v-if="currentBot === null" variant="destructive">
    <AlertTitle>{{ t('error.title') }}</AlertTitle>
    <AlertDescription>
      {{ t('error.description') }}
    </AlertDescription>
  </Alert>

  <div class="flex gap-4 bg-slate-100 dark:bg-[#36393e] p-4 rounded-lg" v-else>
    <!-- Bot Avatar -->
    <Avatar>
      <AvatarImage :src="currentBot.data.icon"/>
    </Avatar>

    <!-- Message Content -->
    <div class="flex-1">
      <!-- Message Header -->
      <div class="flex items-center gap-2 mb-1">
        <span class="font-medium">{{ currentBot.data?.name }}</span>
        <span class="px-1 bg-[#5865F2] rounded text-xs font-medium text-white">{{ t('bot_label') }}</span>
        <span class="text-[#B5BAC1] text-xs">17.09.24, 21:52</span>
      </div>

      <div class="mb-4 p-4 bg-slate-200 dark:bg-zinc-600 rounded-md border-l-4 border-black">
        <span class="text-md font-semibold mb-2">{{ t('panel.title') }}</span>
        <p class="text-xs my-3">
          {{ t('panel.description') }} <br>
          <span class="font-bold">{{ t('panel.command') }}</span>.
        </p>

        <!-- Command Buttons -->
        <div class="grid grid-cols-4 gap-1 text-xs mb-4">
          <div class="flex text-xs items-center gap-1 py-1 px-1.5 rounded-sm bg-gray-500 text-white"
               :class="{'hidden': !(form.values['actions'] ?? []).includes(action.id)}"
               v-for="action in actions">
            <Icon :name="action.icon" class="w-4 h-4"/>
            {{ action.name }}
          </div>
        </div>

        <!-- Bottom Text -->
        <div class="flex items-center gap-2 mt-4">
          <Icon name="lucide:settings-2" class="w-5 h-5"/>
          <p class="text-xs">{{ t('interface_hint') }}</p>
        </div>
      </div>

      <!-- Interactive Buttons Grid -->
      <div class="grid grid-cols-4 gap-2">
        <TooltipProvider>
          <Tooltip v-for="(action, index) in actions">
            <TooltipTrigger>
              <Button
                  :key="index"
                  class="w-full bg-transparent  rounded transition-colors duration-200 flex items-center justify-center"
                  :class="{'bg-gray-500 text-white hover:bg-gray-700': form.values['actions']?.includes(action.id), 'border dark:hover:bg-gray-500 dark:text-white text-gray-800 border-gray-500 hover:bg-slate-200': !form.values['actions']?.includes(action.id)}"
                  @click.prevent="handleAction(action)">
                <Icon :name="action.icon" class="w-5 h-5 "/>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <b v-if="form.values['actions']?.includes(action.id)">Вимкнути</b>
              <b v-else>Увімкнути</b>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  </div>
</template>

<i18n lang="json">
{
  "en": {
    "error": {
      "title": "Error",
      "description": "Failed to get bot information."
    },
    "bot_label": "BOT",
    "panel": {
      "title": "Control Panel",
      "description": "This interface can be used to manage temporary voice channels. More options are available using the command /voice.",
      "interface_label": "interface",
      "command": "/voice"
    },
    "actions": {
      "rename": "Name",
      "limit_add": "Limit+",
      "limit_remove": "Limit-",
      "limit_edit": "Limit",
      "block_add": "Block+",
      "block_remove": "Block-",
      "whitelist_add": "Trusted+",
      "whitelist_remove": "Trusted-",
      "private": "Privacy",
      "history": "History",
      "transfer": "Transfer",
      "owner": "Take over"
    },
    "tooltips": {
      "enable": "Enable",
      "disable": "Disable"
    },
    "interface_hint": "Click the buttons below to use the interface"
  },
  "uk": {
    "error": {
      "title": "Помилка",
      "description": "Не вдалось отримати інформації про бота."
    },
    "bot_label": "БОТ",
    "panel": {
      "title": "Панель керування",
      "description": "Цей інтерфейс можна використовувати для управління тимчасовими голосовими каналами. Більше параметрів доступно за допомогою команди /voice.",
      "interface_label": "інтерфейс",
      "command": "/voice"
    },
    "actions": {
      "rename": "Назва",
      "limit_add": "Ліміт+",
      "limit_remove": "Ліміт-",
      "limit_edit": "Ліміт",
      "block_add": "Блок+",
      "block_remove": "Блок-",
      "whitelist_add": "Довірені+",
      "whitelist_remove": "Довірені-",
      "private": "Приватність",
      "history": "Історія",
      "transfer": "Перенести",
      "owner": "Захопити"
    },
    "tooltips": {
      "enable": "Увімкнути",
      "disable": "Вимкнути"
    },
    "interface_hint": "Натисніть на кнопки нижче, щоб скористатися інтерфейсом"
  }
}
</i18n>

<style>
:root {

}
</style>