import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { createQueuePagination } from "../../utils/functions/createEmbedPagination.js";
import { createEmbed } from "../../utils/functions/createEmbed.js";
import { Colors, Emojis } from "../../utils/functions/constants.js";
import { MusiCore } from '../../structures/Client.js';

export default {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Shows the current queue'),

  /**
   * @param {MusiCore} client 
   * @param {ChatInputCommandInteraction} interaction 
   */
  async execute(client, interaction) {
    const { member, guild } = interaction;
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

    if (!queue.currentTrack) {
      return await interaction.editReply({
        embeds: [createEmbed(Colors.ERROR, `${Emojis.FAIL} The queue is **empty**`)],
        ephemeral: true
      });
    }

    return await createQueuePagination(interaction, queue);
  }
}
