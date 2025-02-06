<script setup lang="ts">
import z from "zod";
import {useForm} from "vee-validate";
import {toTypedSchema} from "@vee-validate/zod";
import {useTemporaryVoice} from '../../composables/useTemporaryVoice'
import type {Creator} from '../../types'

const temporaryVoice = useTemporaryVoice()
const {pushBreadcrumb} = useBreadcrumbs()

onBeforeMount(() => {
  pushBreadcrumb({
    id: 'settings',
    title: 'Налаштування'
  })
})

const {t} = useI18n()

const {data: settings} = await useAsyncData('temporary_voice:settings', () => temporaryVoice.getSettings())

const {
  data: creators,
  execute: fetchCreators
} = useLazyAsyncData('temporary_voice:creators', () => temporaryVoice.getCreators(), {
  immediate: false,
  default: () => settings.value?.creators
})

const types = shallowRef({
  personal: {
    icon: '👱🏼‍♂️👩🏼‍🦳',
    title: 'Індивідуальна панель',
    description: 'Персональна панель керування голосовим чатом для автора каналу. Публікується при створенні голосового каналу.',
  },
  public: {
    icon: '🌐',
    title: 'Глобальна панель',
    description: 'Глобальна панель керування голосовим чатом для авторів каналів. Публікується 1 раз в обраному вами чаті з можливістю оновити повідомлення.',
  }
})

const schema = z.object({
  actions: z.array(z.enum([
    'rename', 'limit_add', 'limit_remove', 'limit_edit',
    'add_user_to_block_list', 'remove_user_from_block_list', 'add_user_to_whitelist', 'remove_user_from_whitelist',
    'private', 'history', 'transfer', 'owner'
  ])),
  type: z.enum(['personal', 'public']),
})

const form = useForm({
  validationSchema: toTypedSchema(schema),
  initialValues: {
    actions: settings.value?.actions,
    type: settings.value?.type
  },
})

const newCreatorCreating = ref(false)
const newCreatorDeleting = ref(false)
const formIsSubmitting = ref(false)
const currentEditedCreator = ref<Creator | null>(null)

function setCurrentEditedCreator(creator: Creator) {
  if (newCreatorDeleting.value) return;
  currentEditedCreator.value = creator
}

async function handleUpdateCreatorEvent() {
  await fetchCreators()
  currentEditedCreator.value = null
}

async function createNewCreator() {
  try {
    newCreatorCreating.value = true
    await temporaryVoice.createCreator()
    toast({
      variant: 'success',
      title: 'Успішно',
      description: 'Ми створили вам канал на вашому сервері.',
      duration: 5000,
    })
    await fetchCreators()
  } catch (error) {
    toast({
      variant: 'destructive',
      title: 'Помилка',
      description: 'Не вдалося створити канал',
    })
  } finally {
    newCreatorCreating.value = false
  }
}


async function deleteCreator(creator: Creator) {
  try {
    newCreatorDeleting.value = true
    await temporaryVoice.deleteCreator(creator.id)
    toast({
      variant: 'success',
      title: 'Успішно',
      description: 'Ми успішно видалили ваш канал',
      duration: 5000,
    })
    await fetchCreators()
  } catch (error) {
    toast({
      variant: 'destructive',
      title: 'Помилка',
      description: 'Не вдалося видалити канал',
    })
  } finally {
    newCreatorDeleting.value = false
  }
}

const onSubmit = form.handleSubmit(async (values, actions) => {
  try {
    formIsSubmitting.value = true
    const response = await temporaryVoice.updateSettings(values)
    actions.resetForm({
      values: {
        actions: response.actions,
        type: response.type,
      }
    })
    toast({
      variant: "success",
      title: "Успішно",
      description: "Зміни успішно збережені"
    })
  } catch (error) {
    toast({
      variant: 'destructive',
      title: 'Помилка',
      description: 'Не вдалося зберегти налаштування',
    })
  } finally {
    formIsSubmitting.value = false
  }
})
</script>

<template>
  <CardHeader>
    <CardTitle>
      ⚙️ {{ t('title') }}
    </CardTitle>
    <CardDescription>
      {{ t('description') }}
    </CardDescription>
  </CardHeader>

  <div class="flex flex-col gap-2">
    <form @submit="onSubmit">
      <div class="flex gap-6">
        <Card class="w-full text-left hover:cursor-pointer" v-for="(type, id) in types"
              :class="{'ring-2': form.values['type'] === id}"
        >
          <CardHeader @click="form.setFieldValue('type', id)">
            <CardTitle>{{ type.icon }} {{ t(`types.${id}.title`) }}</CardTitle>
            <CardDescription>{{ t(`types.${id}.description`) }}</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card class="flex gap-2 mt-4 p-2">
        <div class="w-full">
          <CardHeader>
            <CardTitle class="before:content-['⠏']">
              {{ t('creators.title') }}
            </CardTitle>
            <CardDescription>
              {{ t('creators.description') }} <b>3</b>
            </CardDescription>
          </CardHeader>
          <CardContent class="flex flex-col gap-2">
            <Button variant="outline" class="w-full" :disabled="creators && creators.length >= 3"
                    :loading="newCreatorCreating" @click.prevent="createNewCreator">
              <Icon name="lucide:plus" class="w-6 h-6"/>
              {{ t('creators.add') }}
            </Button>
            <div class="flex gap-2 items-center" v-for="creator in creators">
              <Card
                  :class="{'blur-sm': newCreatorDeleting}"
                  @click.prevent="setCurrentEditedCreator(creator)"
                  class="flex items-center gap-2 p-2 flex-grow border border-neutral-500 text-zinc-600 dark:text-gray-200 dark:hover:hover:bg-accent text-sm h-10 justify-center hover:bg-zinc-100 hover:cursor-pointer">
                <Icon name="lucide:audio-lines"/>
                {{ creator.channel.name }}
              </Card>
              <Button variant="destructive" class="h-10" :loading="newCreatorDeleting"
                      @click.prevent="deleteCreator(creator)">
                <Icon name="lucide:trash"/>
              </Button>
            </div>
            <ModalsCreatorFormModal
                v-if="currentEditedCreator"
                :creator="currentEditedCreator"
                @update:creator="handleUpdateCreatorEvent"
                @update:open="currentEditedCreator = null"
            />
          </CardContent>
        </div>
        ¬

        <div class="w-full">
          <CardHeader>
            <CardTitle class="before:content-['⠏']">
              {{ t('interface.title') }}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EmbedConfigurator :form="form"/>
          </CardContent>
        </div>
        <ChangesCardConfirm
            :submit-loading="formIsSubmitting"
            :reset="form.resetForm"
            :show="form.meta.value.dirty"
        />

      </Card>
    </form>
  </div>
</template>

<i18n lang="json">
{
  "en": {
    "title": "Temporary Rooms Settings",
    "description": "On this page, you can configure the functionality of the \"Temp Voice\" module for your Discord server. This module allows creating temporary voice channels that are automatically deleted when the last participant leaves.",
    "types": {
      "personal": {
        "title": "Individual Panel",
        "description": "Personal voice chat control panel for the channel creator. Published when creating a voice channel."
      },
      "public": {
        "title": "Global Panel",
        "description": "Global voice chat control panel for channel creators. Published once in your chosen chat with the ability to update the message."
      }
    },
    "creators": {
      "title": "Creators",
      "description": "Maximum",
      "add": "Add"
    },
    "interface": {
      "title": "Interface"
    },
    "toasts": {
      "creator": {
        "create": {
          "success": "Success",
          "success_description": "We created a channel on your server.",
          "error": "Error",
          "error_description": "Failed to create channel"
        },
        "delete": {
          "success": "Success",
          "success_description": "We successfully deleted your channel",
          "error": "Error",
          "error_description": "Failed to delete channel"
        }
      },
      "settings": {
        "success": "Success",
        "success_description": "Changes saved successfully",
        "error": "Error",
        "error_description": "Failed to save settings"
      }
    }
  },
  "uk": {
    "title": "Налаштування модулю \"Авто-кімнати\"",
    "description": "На цій сторінці ви можете налаштувати функціонал модуля \"Temp Voice\" для вашого сервера Discord. Цей модуль дозволяє створювати тимчасові голосові канали, які автоматично видаляються після виходу останнього учасника.",
    "types": {
      "personal": {
        "title": "Індивідуальна панель",
        "description": "Персональна панель керування голосовим чатом для автора каналу. Публікується при створенні голосового каналу."
      },
      "public": {
        "title": "Глобальна панель",
        "description": "Глобальна панель керування голосовим чатом для авторів каналів. Публікується 1 раз в обраному вами чаті з можливістю оновити повідомлення."
      }
    },
    "creators": {
      "title": "Утворювачі",
      "description": "Максимально",
      "add": "Додати"
    },
    "interface": {
      "title": "Інтерфейс"
    },
    "toasts": {
      "creator": {
        "create": {
          "success": "Успішно",
          "success_description": "Ми створили вам канал на вашому сервері.",
          "error": "Помилка",
          "error_description": "Не вдалося створити канал"
        },
        "delete": {
          "success": "Успішно",
          "success_description": "Ми успішно видалили ваш канал",
          "error": "Помилка",
          "error_description": "Не вдалося видалити канал"
        }
      },
      "settings": {
        "success": "Успішно",
        "success_description": "Зміни успішно збережені",
        "error": "Помилка",
        "error_description": "Не вдалося зберегти налаштування"
      }
    }
  }
}
</i18n>