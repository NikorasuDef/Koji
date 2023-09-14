import { ChatInputCommandInteraction, EmbedBuilder, GuildMember, SlashCommandBuilder } from "discord.js";
import { createEmbedResponse } from "../../utils/functions/CreateEmbedResponse.js";
import { useMainPlayer } from "discord-player";

export default {
  data: new SlashCommandBuilder()
    .setName("replay")
    .setDescription("Replays the current song."),

  /**
   * @param interaction - Discord interaction
   */
  async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const memberChannel = (interaction.member as GuildMember).voice.channel;
    const botChannel = interaction.guild.members.me.voice.channel;

    if (!memberChannel) {
      await createEmbedResponse(
        interaction,
        "error",
        "You must be in a voice channel to use this command."
      );
      return;
    }

    if (botChannel && memberChannel.id !== botChannel.id) {
      await createEmbedResponse(
        interaction,
        "error",
        `You must be in ${botChannel} to use this command.`
      );
      return;
    }

    const player = useMainPlayer();
    const queue = player.nodes.resolve(interaction.guild);

    if (!queue || !queue.currentTrack) {
      await createEmbedResponse(
        interaction,
        "error",
        "There is no song currently playing."
      );
      return;
    }

    try {
      queue.node.seek(0);
      await createEmbedResponse(interaction, "success", "Replaying the song.");
    } catch (error) {
      console.error("Error replaying song:", error);
      await createEmbedResponse(
        interaction,
        "error",
        "There was an error replaying the song."
      );
    }
  },
};
