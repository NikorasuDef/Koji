import { GuildQueueEvent, GuildQueue } from "discord-player"
import { EmbedBuilder } from "discord.js"

export default {
  name: GuildQueueEvent.error,
  once: false,

  /**
   * @param {GuildQueue} queue The queue that encountered an error
   * @param {Error} error The error that was encountered
   */

  async execute(queue, error) {
    switch (error.message) {
      case 'Could not extract stream from this track.':
        if (queue.tracks.size > 1) queue.node.skip();

        await queue.metadata.channel.send({
          embeds: [createEmbed(Colors.ERROR, `${Emojis.FAIL} Couldn't find a source for this track. Skipping to the next track.`)]
        });
        break;
      
      default:
        console.error(`${Colors.BLUE(new Date().toLocaleString())} ${Colors.RED(`[QUEUE_ERROR_EVENT]: The queue at server ${queue.guild.name} encountered an error:\n${error.stack}`)}`);
    }
  }
}