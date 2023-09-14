import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder } from "discord.js";
import { createEmbedResponse } from "../../utils/functions/CreateEmbedResponse.js";
import { useMainPlayer } from "discord-player";

export default {
  data: new SlashCommandBuilder()
    .setName("autoplay")
    .setDescription("Toggles autoplay mode on or off.")
    .addBooleanOption((option) =>
      option
        .setName("enable")
        .setDescription("Enables or disables autoplay mode.")
        .setRequired(true)
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

    const autoplayToggle = interaction.options.getBoolean("enable");
    const mode = autoplayToggle ? 3 : 0;
    try {
      queue.setRepeatMode(mode);
      await createEmbedResponse(interaction, "info", `Autoplay mode has been **${autoplayToggle ? "enabled" : "disabled"}**.`)
    } catch (error) {
      console.log("Error toggling autoplay mode: ", error)
      await createEmbedResponse(interaction, "error", "There was an error toggling autoplay mode.")
    }
  },
};
