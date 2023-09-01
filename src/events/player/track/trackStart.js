import { GuildQueue, GuildQueueEvent, Track } from "discord-player";
import { MusiCore } from "../../../structures/Client.js";
import { EmbedBuilder } from "discord.js"
import colors from "colors";

export default {
  name: GuildQueueEvent.playerStart,
  once: false,

  /**
   * @param {GuildQueue} queue
   * @param {Track} track
   * @param {MusiCore} client
   */
  async execute(queue, track, client) {
    try {
      const duration = track.raw.live ? "🔴 Live" : track.duration;

      const playingEmbed = new EmbedBuilder()
        .setColor("#69B0BF")
        .setTitle("Now Playing")
        .setDescription(`[${track.title}](${track.url})`)
        .addFields([
          { name: "**Requested by**", value: `${track.requestedBy}`, inline: true },
          { name: "**Duration**", value: `\`${duration}\``, inline: true },
          { name: "**Loop Mode**", value: `\`${client.player.getLoopMode(queue)}\``, inline: true }
        ])
        .setThumbnail(track.thumbnail);

      const msg = await queue.metadata.channel.send({ embeds: [playingEmbed], fetchReply: true });
      queue.lastMessage = msg.id;
    } catch (error) {
      console.error(`${colors.blue(new Date().toLocaleString())} ${colors.red(`[TRACK_START_EVENT]: Error encountered while trying to start playing a track:\n${error.stack}`)}`);
    }
  }
}