import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { handleErrorResponse } from '../../utils/functions/handleErrorResponse.js';
import { Colors, Emojis } from '../../utils/functions/constants.js';
import { createEmbed } from '../../utils/functions/createEmbed.js';
import { MusiCore } from '../../structures/Client.js';

export default {
  category: 'music',
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skips the current song or to a specific song in the queue')
    .addIntegerOption((option) =>
      option
        .setName('position')
        .setDescription('The position of the song to skip to')
        .setRequired(false)
    ),

  /**
   * @param {MusiCore} client
   * @param {ChatInputCommandInteraction} interaction
   */

  async execute(client, interaction) {
    const { member, guild, options } = interaction;
    const memberChannel = member.voice.channel;
    const botChannel = guild.members.me.voice.channel;

    // Restrictions
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

    const queue = client.player.nodes.get(guild.id);
    const position = options.getInteger('position');

    if (!queue || !queue.isPlaying) {
      return await interaction.editReply({
        embeds: [createEmbed(Colors.ERROR, `${Emojis.FAIL} There is **nothing playing** right now.`)],
        ephemeral: true
      });
    }

    try {
      // Skip to a specific song
      if (position) {
        if (position < 1 || position > queue.tracks.length + 1) {
          return await interaction.editReply({
            embeds: [createEmbed(Colors.ERROR, `${Emojis.FAIL} Invalid position. Please enter a number between \`1\` and \`${queue.tracks.length + 1}\`.`)],
            ephemeral: true
          });
        }

        queue.node.skipTo(position - 1);

        return await interaction.editReply({
          embeds: [createEmbed(Colors.SUCCESS, `${Emojis.SUCCESS} Skipped to position **#${position}** in the queue.`)],
        });
      }

      // Skip the current song
      queue.node.skip();

      return await interaction.editReply({
        embeds: [createEmbed(Colors.SUCCESS, `${Emojis.SUCCESS} Skipped !`)],
      });

    } catch (error) {
      return await handleErrorResponse(interaction, 'An error occurred while trying to skip the song. Please try again later.', error.message)
    }
  }
}