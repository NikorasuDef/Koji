import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { MusiCore } from '../../structures/Client.js';
import { Emojis, Colors } from "../../utils/functions/constants.js";
import { createEmbed } from "../../utils/functions/createEmbed.js";

export default {
  data: new SlashCommandBuilder()
    .setName("remove")
    .setDescription("Remove tracks or duplicates from the queue")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("track")
        .setDescription("Remove a track from the queue")
        .addIntegerOption((option) =>
          option
            .setName("position")
            .setDescription("The position of the track to remove")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("range")
        .setDescription("Remove a range of tracks from the queue")
        .addIntegerOption((option) =>
          option
            .setName("start")
            .setDescription("The starting position of the range to remove")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("end")
            .setDescription("The ending position of the range to remove")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("duplicates")
        .setDescription("Remove duplicate tracks from the queue")
    ),

  /**
   * @param {MusiCore} client
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(client, interaction) {
    const { member, guild, options } = interaction;
    const memberChannel = member.voice.channel;
    const botChannel = guild.members.me.voice.channel;

    if (!memberChannel) {
      return await interaction.editReply({
        embeds: [createEmbed(Colors.ERROR, `${Emojis.FAIL} You must be in a **voice channel** to use this command.`)],
        ephemeral: true
      });
    }

    if (botChannel && memberChannel.id !== botChannel.id) {
      return await interaction.editReply({
        embeds: [createEmbed(Colors.ERROR, `${Emojis.FAIL} You must be in the **same voice channel** as me to use this command.`)],
        ephemeral: true
      });
    }

    const queue = client.player.nodes.get(interaction.guild.id);
    const subcommand = interaction.options.getSubcommand();

    if (!queue.currentTrack) {
      return await interaction.editReply({
        embeds: [createEmbed(Colors.ERROR, `${Emojis.FAIL} There's **nothing** playing.`)],
        ephemeral: true
      });
    }

    // switch through subcommands

    switch (subcommand) {
      case 'track': {
        const position = interaction.options.getInteger('position');
        const track = queue.tracks.toArray()[position - 1];

        if (position < 1 || position > queue.tracks.length + 1) {
          return await interaction.editReply({
            embeds: [createEmbed(Colors.ERROR, `${Emojis.FAIL} Invalid position. Please enter a number between \`1\` and \`${queue.tracks.length + 1}\`.`)],
            ephemeral: true
          });
        }

        try {
          queue.removeTrack(track);
          return await interaction.editReply({
            embeds: [createEmbed(Colors.SUCCESS, `${Emojis.SUCCESS} Removed the track [${track.title}](${track.uri}) from the queue.`)],
          });
        } catch (error) {
          await interaction.editReply({
            embeds: [createEmbed(Colors.ERROR, `${Emojis.FAIL} Error while removing the selected track:\n\`${error.message}\``)],
            ephemeral: true
          });
        }
      }
        break;

      case 'range': {
        const start = interaction.options.getInteger('start');
        const end = interaction.options.getInteger('end');

        if (start < 1 || start > queue.tracks.size + 1) {
          return await interaction.editReply({
            embeds: [createEmbed(Colors.ERROR, `${Emojis.FAIL} The starting position must be between **1** and **${queue.tracks.size}**.`)],
            ephemeral: true
          });
        }

        if (end < 1 || end > queue.tracks.size + 1) {
          return await interaction.editReply({
            embeds: [createEmbed(Colors.ERROR, `${Emojis.FAIL} The ending position must be between **1** and **${queue.tracks.size}**.`)],
            ephemeral: true
          });
        }

        if (start > end) {
          return await interaction.editReply({
            embeds: [createEmbed(Colors.ERROR, `${Emojis.FAIL} The starting position must be **lower** than the ending position.`)],
            ephemeral: true
          });
        }

        if (start === end) {
          return await interaction.editReply({
            embeds: [createEmbed(Colors.ERROR, `${Emojis.FAIL} The starting position must be **different** from the ending position.`)],
            ephemeral: true
          });
        }

        try {
          const removedTracks = queue.tracks.toArray().slice(start - 1, end - 1);
          queue.tracks.store = queue.tracks.filter((track) => !removedTracks.includes(track));

          const removedTracksResponse = [
            `Removed **${removedTracks.length}** tracks from the queue.\n\n`,
            `**Removed tracks:**\n ${removedTracks.map((track, index) => `\`${index + 1}.\` [${track.title}](${track.url})`).join('\n')}`,
          ]

          return await interaction.editReply({
            embeds: [createEmbed(Colors.SUCCESS, `${Emojis.SUCCESS} ${removedTracksResponse.join('')}`)],
          });
        } catch (error) {
          await interaction.editReply({
            embeds: [createEmbed(Colors.ERROR, `${Emojis.FAIL} Error while removing the selected tracks:\n\`${error.message}\``)],
            ephemeral: true
          });
        }
      }
        break;

      case 'duplicates': {
        try {
          const duplicates = client.player.removeDuplicates(queue);

          if (!duplicates) { 
            return await interaction.editReply({
              embeds: [createEmbed(Colors.ERROR, `${Emojis.FAIL} There are no duplicate tracks in the queue.`)],
              ephemeral: true
            });
          }

          return await interaction.editReply({
            embeds: [createEmbed(Colors.SUCCESS, `${Emojis.SUCCESS} Removed duplicated tracks from the queue.`)],
          });
        } catch (error) {
          await interaction.editReply({
            embeds: [createEmbed(Colors.ERROR, `${Emojis.FAIL} Error while removing duplicate tracks:\n\`${error.message}\``)],
            ephemeral: true
          });
        }
      }
        break;
    }
  }
}