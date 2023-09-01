import { GuildQueue, GuildQueueEvent, Track } from "discord-player"
import colors from "colors";

export default {
  name: GuildQueueEvent.playerFinish,
  once: false,

  /**
   * @param {GuildQueue} queue
   * @param {Track} track
   */
  async execute(queue, track) {
    try {
      const msg = await queue.metadata.channel.messages.fetch(queue.lastMessage) || null  ;
      if (msg) await msg.delete().catch(() => null);
    } catch (error) { 
      console.error(`${colors.blue(new Date().toLocaleString())} ${colors.red(`[TRACK_END_EVENT]: Error encountered while trying to delete the last 'now-playing' message:\n${error.stack}`)}`);
    }
  }
}