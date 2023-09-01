import { GuildQueueEvent, GuildQueue, Track, Player } from "discord-player"
import { createEmbed } from "../../../utils/functions/createEmbed.js"
import { Colors, Emojis } from "../../../utils/functions/constants.js"

export default {
  name: GuildQueueEvent.playerError,
  once: false,

  /**
   * @param {GuildQueue} queue The queue that encountered an error
   * @param {Error} error  The error that was encountered
   * @param {Track} track The track that was playing when the error was encountered
   */

  async execute(queue, error, track) {

    switch (error.message) {
      case 'Could not extract stream from this track.':
        if (queue.tracks.size > 1) queue.node.skip();

        await queue.metadata.channel.send({
          embeds: [createEmbed(Colors.ERROR, `${Emojis.FAIL} The player encountered an error while playing [${track.title}](${track.url}). Skipping to the next track.`)]
        });
        break;
      
      default:
        console.error(`${Colors.BLUE(new Date().toLocaleString())} ${Colors.RED(`[PLAYER_ERROR_EVENT]: Error encountered while trying to play a track:\n${error.stack}`)}`);
    }
  }
}