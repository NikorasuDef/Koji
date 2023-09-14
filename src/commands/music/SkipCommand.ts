import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder } from "discord.js";
import { createEmbedResponse } from "../../utils/functions/CreateEmbedResponse.js";
import { useMainPlayer } from "discord-player";

export default {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skip the current song or to a specific song in the queue.")
    .addIntegerOption((option) =>
      option
        .setName("position")
        .setDescription("The position of the song to skip to")
        .setRequired(false)
  ),
  
  /**
   * @param interaction - Discord interaction
   */
  async execute(interaction: ChatInputCommandInteraction): Promise<void> { 
    const memberChannel = (interaction.member as GuildMember).voice.channel;
    const botChannel = interaction.guild.members.me.voice.channel;

    if (!memberChannel) { 
      await createEmbedResponse(interaction, "error", "You must be in a voice channel to use this command.");
      return;
    }

    if (botChannel && memberChannel.id !== botChannel.id) { 
      await createEmbedResponse(interaction, "error", `You must be in ${botChannel} to use this command.`);
      return;
    }

    const player = useMainPlayer();
    const queue = player.nodes.resolve(interaction.guild);
    
    if (!queue || !queue.currentTrack) { 
      await createEmbedResponse(interaction, "error", "There is no song currently playing.");
      return;
    }

    const positionToSkip = interaction.options.getInteger("position");
    const song = queue.tracks.toArray()[positionToSkip - 1];

    if (positionToSkip) { 
      if (positionToSkip < 1 || positionToSkip > queue.tracks.size) { 
        await createEmbedResponse(interaction, "error", "Invalid song position.");
        return;
      }

      try {
        queue.node.skipTo(positionToSkip - 1);
        await createEmbedResponse(interaction, "success", `Skipped to [**${song.title}**](${song.url}).`);
      } catch (error) {
        await createEmbedResponse(interaction, "error", `An error occurred while trying to skip to [**${song.title}**](${song.url}).`);
        return;
      }
    } else {
      try {
        queue.node.skip();
        await createEmbedResponse(interaction, "success", `Skipped [**${queue.currentTrack.title}**](${queue.currentTrack.url}).`);
        return;
      } catch (error) { 
        await createEmbedResponse(interaction, "error", `An error occurred while trying to skip [**${queue.currentTrack.title}**](${queue.currentTrack.url}).`);
        return;
      }
    }
  }
};
