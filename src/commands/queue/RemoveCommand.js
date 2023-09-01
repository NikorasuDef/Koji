import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { MusiCore } from '../../structures/Client.js';

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
    const voiceChannel = interaction.member.voice.channel;
    const botChannel = interaction.guild.members.me.voice.channel;
    const queue = client.player.nodes.get(interaction.guild.id);
    const subcommand = interaction.options.getSubcommand();

    // Restrictions
    if (!voiceChannel) {
      return await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor('Red')
            .setDescription(`${process.env.FAIL_EMOJI} You must be in a **voice channel** to use this command.`)
        ],
        ephemeral: true
      });
    }

    if (botChannel && voiceChannel.id !== botChannel.id) {
      return await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor('Red')
            .setDescription(`${process.env.FAIL_EMOJI} You must be in the **same voice channel** as me to use this command.`)
        ],
        ephemeral: true
      });
    }

    if (!queue || !queue.isPlaying) {
      return await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor('Red')
            .setDescription(`${process.env.FAIL_EMOJI} There is **nothing playing** right now.`)
        ],
        ephemeral: true
      });
    }

    // switch through subcommands

    switch (subcommand) {
      case 'track': {
        const position = interaction.options.getInteger('position');

        if (position < 1 || position > queue.tracks.length + 1) {
          return await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setColor('Red')
                .setDescription(`${process.env.FAIL_EMOJI} The position must be between **1** and **${queue.tracks.length + 1}**.`)
            ],
            ephemeral: true
          });
        }

        const track = queue.tracks.toArray()[position - 1];

        try {
          queue.removeTrack(track);
          await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setColor('Green')
                .setDescription(`${process.env.SUCCESS_EMOJI} Removed track [__${track.title}__](${track.url}) !`)
            ],
          });
        } catch (error) {
          await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setColor('Red')
                .setDescription(`${process.env.FAIL_EMOJI} Error while removing the selected track:\n\`${error.message}\``)
            ],
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
            embeds: [
              new EmbedBuilder()
                .setColor('Red')
                .setDescription(`${process.env.FAIL_EMOJI} The starting position must be between **1** and **${queue.tracks.length + 1}**.`)
            ],
            ephemeral: true
          });
        }

        if (end < 1 || end > queue.tracks.size + 1) {
          return await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setColor('Red')
                .setDescription(`${process.env.FAIL_EMOJI} The ending position must be between **1** and **${queue.tracks.size}**.`)
            ],
            ephemeral: true
          });
        }

        if (start > end) {
          return await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setColor('Red')
                .setDescription(`${process.env.FAIL_EMOJI} The starting position must be **lower** than the ending position.`)
            ],
            ephemeral: true
          });
        }

        if (start === end) {
          return await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setColor('Red')
                .setDescription(`${process.env.FAIL_EMOJI} The starting position must be **different** from the ending position.`)
            ],
            ephemeral: true
          });
        }

        try {
          const removedTracks = queue.tracks.toArray().slice(start - 1, end - 1);
          queue.tracks.store = queue.tracks.filter((track) => !removedTracks.includes(track));

          await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setColor('Green')
                .setDescription(`${process.env.SUCCESS_EMOJI} Removed the tracks from position **#${start}** to **#${end}**.`)
            ],
          });
        } catch (error) {
          await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setColor('Red')
                .setDescription(`${process.env.FAIL_EMOJI} Error while removing the selected tracks:\n\`${error.message}\``)
            ],
            ephemeral: true
          });
        }
      }
        break;

      case 'duplicates': {
        try {
          client.player.removeDuplicates(queue);
          await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setColor('Green')
                .setDescription(`${process.env.SUCCESS_EMOJI} Successfully removed duplicate tracks from the queue.`)
            ],
          });
        } catch (error) {
          await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setColor('Red')
                .setDescription(`${process.env.FAIL_EMOJI} Error while removing the duplicate tracks:\n\`${error.message}\``)
            ],
            ephemeral: true
          });
        }
      }
    }
  }
}