import { AlarmDb } from '../../common/types/docs'

export interface SlackWebHook {
  channel: string;
  userName: string;
}

export interface SlackBody {
  channel: string;
  userName: string;
  text: string;
  icon_emoji: string;
}
