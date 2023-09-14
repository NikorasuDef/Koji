import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  GuildMember,
  PermissionsBitField,
  PermissionResolvable,
} from "discord.js";
import { GuildNodeCreateOptions, useMainPlayer } from "discord-player";
import { createEmbedResponse } from "../../utils/functions/CreateEmbedResponse.js";
import { processQuery } from "../../utils/functions/ProcessQuery.js";

export default {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play a song by name or URL")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("The song to play")
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

    const requiredPermissions: PermissionResolvable[] = ["Connect", "Speak", "ViewChannel"];
    const missingPermissions = memberChannel.permissionsFor(interaction.guild.members.me).missing(new PermissionsBitField(requiredPermissions));

    if (missingPermissions.length) {
      await createEmbedResponse(interaction, "error", `I am missing the following permissions: \`${missingPermissions.join(", ")}\``);
      return;
    }

    const queueOptions = {
      leaveOnEmpty: true,
      leaveOnEmptyCooldown: 60000,
      leaveOnEnd: false,
      leaveOnStop: false,
      metadata: {
        interaction,
        channel: interaction.channel,
      },
      volume: 50,
      skipOnNoStream: true,
    } as GuildNodeCreateOptions;

    await interaction.deferReply();

    const player = useMainPlayer();
    const query = processQuery(interaction.options.getString("query"));
    const queue = player.nodes.resolve(interaction.guild) || player.nodes.create(interaction.guild, queueOptions);

    const searchResult = await player.search(query, {
      requestedBy: interaction.user,
    });

    if (!searchResult || !searchResult.tracks.length) {
      await createEmbedResponse(interaction, "error", "No results were found for your query.");
      return;
    }

    try {
      if (!queue.channel) {
        await queue.connect(memberChannel);
      }

      if (searchResult.hasPlaylist()) {
        searchResult.playlist.tracks.forEach((track) => queue.addTrack(track));
      } else {
        queue.addTrack(searchResult.tracks[0]);
      }

      if (!queue.currentTrack) {
        await queue.node.play();
      }

      const resultMessage = searchResult.hasPlaylist()
        ? `Queued **${searchResult.tracks.length}** songs from playlist **[${searchResult.playlist.title}](${searchResult.playlist.url})**`
        : `Queued **[${searchResult.tracks[0].title}](${searchResult.tracks[0].url})** by **${searchResult.tracks[0].author}**`;

      await createEmbedResponse(interaction, "success", resultMessage);
    } catch (error) {
      queue?.delete();
      const errorMessage = `An error occurred while trying to execute this command. ${error.message}`;
      await createEmbedResponse(interaction, "error", errorMessage);
      console.error("Error executing command play:", error);
    }
  },
};