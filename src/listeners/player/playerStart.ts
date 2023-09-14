import { GuildQueue, Track, GuildQueueEvent } from "discord-player";
import { EmbedBuilder, GuildTextBasedChannel, TextChannel } from "discord.js";

export default {
  name: GuildQueueEvent.playerStart,
  isPlayerEvent: true,

  /**
   * @param queue - Guild queue
   * @param track - Track playing
   */
  async execute(queue: GuildQueue, track: Track): Promise<void> {
    const metadata = queue.metadata as { channel: GuildTextBasedChannel };
    const channel = metadata.channel as TextChannel;

    const nowPlayingEmbed = new EmbedBuilder()
      .setColor(queue.guild.members.me.displayHexColor)
      .setTitle("Now playing")
      .setDescription(`[**${track.title}**](${track.url}) ~ ${track.requestedBy}`);

    try {
      await channel.send({ embeds: [nowPlayingEmbed] });
    } catch (error) {
      console.error("Error sending now-playing message:", error);
      return;
    }
  },
};
