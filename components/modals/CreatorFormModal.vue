<script setup lang="ts">
import {useForm, Field} from "vee-validate";
import {toTypedSchema} from "@vee-validate/zod";
import z from "zod";

type Response = [
  { [key: string]: any }
]

type Creator = {
  id: string;
  name: string
  source_parent_id: string,
}

const props = defineProps<{
  creator: Creator | null
}>()

const emits = defineEmits(['update:creator'])

const {data: categories} = await useAsyncData<Response>('categories', () => $fetch(`/api/guilds/categories`));

const form = useForm({
  validationSchema: toTypedSchema(z.object({
    name: z.string(),
    source_parent_id: z.enum(Object.keys(categories.value)).nullish(),
  })),
  initialValues: {
    name: props.creator?.name,
    source_parent_id: props.creator?.source_parent_id,
  }
})

function pushPlaceholder(name: string) {
  form.setFieldValue('name', `${form.values.name ?? ''}{${name}}`)
}

const onSubmit = form.handleSubmit(async (values: any) => {
  await $fetch('/api/modules/temporary_voice/creator/' + props.creator.id + '/edit', {
    method: 'POST',
    body: values,
  })
  toast({
    variant: "success",
    title: "Успішно",
    description: "Зміни успішно збережені"
  })
  emits('update:creator')
})


</script>

<template>
  <Dialog :open="creator !== null" @update:open="emits('update:creator')">
    <DialogTrigger as-child>
      <slot/>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Створити новий "утворювач"</DialogTitle>
        <DialogDescription>
          Додайте новий список правил для каналу з якого будуть утворюватись тимчасові канали.
        </DialogDescription>
      </DialogHeader>
      <form id="creatorForm" @submit="onSubmit">

        <Field v-slot="{componentField}" name="name">
          <FormItem>
            <FormLabel>
              Назва
            </FormLabel>
            <Input type="text" v-bind="componentField"/>
            <FormMessage/>
            <FormDescription class="flex items-center gap-2">
              Доступні плейсхолдери:
              <div class="inline-flex gap-2">
                <Tooltip>
                  <TooltipTrigger>
                    <Badge variant="secondary" @click.prevent="pushPlaceholder('member')">
                      {member}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    Нікнейм учасника який створює кімнату
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger>
                    <Badge variant="secondary" @click.prevent="pushPlaceholder('count')">
                      {count}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    Номер кімнати в прогресивному порядку
                  </TooltipContent>
                </Tooltip>
              </div>
            </FormDescription>
          </FormItem>
        </Field>

        <Field v-slot="{componentField}" name="source_parent_id">
          <FormItem>
            <FormLabel>
              Основна категорія для каналу
            </FormLabel>
            <Select v-bind="componentField">
              <SelectTrigger>
                <SelectValue placeholder="Оберіть канал"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="category in categories" :value="category.id">
                  {{ category.name }}
                </SelectItem>
              </SelectContent>
            </Select>
            <FormMessage/>
            <FormDescription class="flex items-center gap-2">

            </FormDescription>
          </FormItem>
        </Field>
      </form>

      <DialogFooter>
        <Button type="submit" form="creatorForm">
          Зберегти
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>