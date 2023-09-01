import { GuildQueue, GuildQueueEvent } from "discord-player"
import colors from 'colors';

export default {
  name: GuildQueueEvent.debug,
  once: false,

  /**
   * @param {GuildQueue} queue
   * @param {String} message
   */
  async execute(queue, message) {
    // console.log(`[DEBUG MESSAGE] => ${message}`);
  }
}