import { GuildQueue, GuildQueueEvent, Track, QueueRepeatMode } from "discord-player"
import { EmbedBuilder, GuildTextBasedChannel, TextChannel } from "discord.js";

export default {
  name: GuildQueueEvent.playerError,
  isPlayerEvent: true,
  
  /**
   * @param queue - Guild queue
   * @param error - Error
   * @param track - Track playing
   */
  async execute(queue: GuildQueue, error: Error, track: Track): Promise<void> { 
    console.error(`Error playing track ${track.title} in guild ${queue.guild.name}: ${error}`)

    const metadata = queue.metadata as { channel: GuildTextBasedChannel };
    const channel = metadata.channel as TextChannel;

    if (queue.tracks.toArray().length === 0 && queue.repeatMode === QueueRepeatMode.OFF) {
      queue.delete();

      const errorEmbed = new EmbedBuilder()
        .setColor("#E92C3A")
        .setDescription("The queue has ended due to an error.");     
      
      try {
        await channel.send({ embeds: [errorEmbed] });
      } catch (error) { 
        console.error("Error sending error message:", error);
        return;
      }
    }
  }
}