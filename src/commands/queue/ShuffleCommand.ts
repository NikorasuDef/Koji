import { SlashCommandBuilder, ChatInputCommandInteraction, GuildMember } from "discord.js";
import { createEmbedResponse } from "../../utils/functions/CreateEmbedResponse.js";
import { useMainPlayer } from "discord-player";

export default {
  data: new SlashCommandBuilder()
    .setName("shuffle")
    .setDescription("Shuffles the queue."),

  async execute(interaction: ChatInputCommandInteraction) {
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

    if (queue.tracks.toArray().length < 5) {
      await createEmbedResponse(interaction, "error", "There not enough songs in the queue to shuffle.");
      return;
    }

    try {
      queue.tracks.shuffle();
      await createEmbedResponse(interaction, "success", "The queue has been shuffled.");
    } catch (error) {
      console.error("Error shuffling queue:", error);
      await createEmbedResponse(interaction, "error", "There was an error shuffling the queue.");
    }
  },
};
