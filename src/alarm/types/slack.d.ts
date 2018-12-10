import { AlarmDb } from '../../common/types/docs'

export interface SlackWebHook {
  channel: string;
  userName: string;
}

export interface SlackBody extends SlackWebHook {
  text: string;
  icon_emoji: string;
}
