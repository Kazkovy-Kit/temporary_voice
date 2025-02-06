export type Type = 'personal' | 'public'

export type Action = 'rename' | 'limit_add' | 'limit_remove' | 'limit_edit' |
    'add_user_to_block_list' | 'remove_user_from_block_list' | 'add_user_to_whitelist' | 'remove_user_from_whitelist' |
    'private' | 'history' | 'transfer' | 'owner'

export type Creator = {
  id: string;
  name: string
  source_parent_id: string,
  channel: {
    name: string
  }
}

export type GetSettingsResponse = {
  actions: Action[],
  type: Type,
  creators: Creator[]
}

export type BotModuleResponse = {
  [key: string]: {
    id: string;
    enabled: boolean;
  };
};