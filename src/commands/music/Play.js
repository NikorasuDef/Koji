import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { processQuery } from '../../utils/functions/processQuery.js';
import { Colors, Emojis } from '../../utils/functions/constants.js';
import { createEmbed } from '../../utils/functions/createEmbed.js';
import { MusiCore } from '../../structures/Client.js';

export default {
  category: 'music',
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Plays a song')
    .addStringOption((option) =>
      option
        .setName('song')
        .setDescription('The song to play')
        .setRequired(true)
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

    // Check permissions
    const hasPermissions = memberChannel.permissionsFor(interaction.guild.members.me).has(['Speak', 'Connect']);
    if (!hasPermissions) {
      return await interaction.editReply({
        embeds: [createEmbed(Colors.ERROR, `${Emojis.FAIL} I **don't have permission** to join or speak in that channel.`)],
        ephemeral: true
      });
    }

    if (!memberChannel.joinable) {
      return await interaction.editReply({
        embeds: [createEmbed(Colors.ERROR, `${Emojis.FAIL} I **can't join** that channel. Please make sure it's not full or locked.`)],
        ephemeral: true
      });
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
    };

    const queue = client.player.nodes.create(interaction.guild.id, queueOptions);

    if (!queue.channel) {
      await queue.connect(memberChannel);
    }

    const song = options.getString('song');
    const query = processQuery(song);

    const searchOptions = { requestedBy: interaction.user, limit: 1 };
    const searchResult = await client.player.search(query, searchOptions);

    if (!searchResult || !searchResult.tracks.length) {
      return await interaction.editReply({
        embeds: [createEmbed(Colors.ERROR, `${Emojis.FAIL} No results found for **${song}**.`)],
        ephemeral: true
      });
    }

    const isPlaylist = searchResult.hasPlaylist();

    try {
      if (isPlaylist) {
        for (const track of searchResult.playlist.tracks) {
          queue.addTrack(track);
        }
      }
  
      queue.addTrack(searchResult.tracks[0]);
  
      if (!queue.isPlaying()) {
        await queue.node.play();
      }
  
      const resultMessage = isPlaylist
        ? `Queued **${searchResult.tracks.length}** songs from playlist **[${searchResult.playlist.title}](${searchResult.playlist.url})**`
        : `Queued **[${searchResult.tracks[0].title}](${searchResult.tracks[0].url})** by **${searchResult.tracks[0].author}**`;
  
      await interaction.editReply({
        embeds: [createEmbed(Colors.SUCCESS, `${Emojis.SUCCESS} ${resultMessage}`)],
      });
    } catch (error) {
      console.error(error.message)
    }
  },
};

