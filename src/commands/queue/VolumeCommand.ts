import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  GuildMember,
  SlashCommandBuilder,
} from "discord.js";
import { createEmbedResponse } from "../../utils/functions/CreateEmbedResponse.js";
import { useMainPlayer } from "discord-player";

export default {
  data: new SlashCommandBuilder()
    .setName("volume")
    .setDescription("Changes the volume of the player.")
    .addIntegerOption((option) =>
      option
        .setName("input")
        .setDescription("Adjusts the volume of the playback.")
        .setRequired(false)
    ),

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
      await createEmbedResponse(interaction, "error", "There is no song currently playing.");
      return;
    }

    const volume = interaction.options.getInteger("input");

    if (!volume) {
      await createEmbedResponse(interaction, "info", `The current volume is **${queue.node.volume}%**.`);
      return;
    }

    if (volume < 0 || volume > 100) { 
      await createEmbedResponse(interaction, "error", "The volume must be between 0 and 100.");
      return;
    }

    try {
      queue.node.setVolume(volume);
      await createEmbedResponse(interaction, "success", `The volume has been set to **${volume}%**.`);
    } catch (error) {
      console.log(`Error while setting the volume: `, error);
      await createEmbedResponse(interaction, "error", "There was an error while setting the volume.");
    }
  },
};
