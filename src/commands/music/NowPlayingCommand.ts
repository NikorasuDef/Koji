import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  GuildMember,
  SlashCommandBuilder,
} from "discord.js";
import { createEmbedResponse } from "../../utils/functions/CreateEmbedResponse.js";
import { PlayerProgressbarOptions, useMainPlayer } from "discord-player";

export default {
  data: new SlashCommandBuilder()
    .setName("nowplaying")
    .setDescription("Get the currently playing song."),

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

    const progressBarOptions: PlayerProgressbarOptions = {
      leftChar: "▇",
      indicator: "‎",
      rightChar: "▁",
      separator: "‎",
      timecodes: true,
      queue: true
    };

    const progressBar = queue.node.createProgressBar(progressBarOptions);
    const progressBarEmbed = new EmbedBuilder()
      .setColor("#1E73CC")
      .setTitle("Now Playing")
      .setDescription(`[${queue.currentTrack.title}](${queue.currentTrack.url}) by **${queue.currentTrack.author}**\n\n${progressBar}`);
    
    try {
      await interaction.reply({ embeds: [progressBarEmbed] });
    } catch (error) {
      await createEmbedResponse(interaction, "error", "There was an error getting the currently playing song.");
      return;
    }
  },
};
