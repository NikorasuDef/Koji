import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { MusiCore } from '../../structures/Client.js';

export default {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clears tracks from the queue")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("queue")
        .setDescription("Clears the entire queue")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("user")
        .setDescription("Clears tracks enqueued by a user")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("The user to clear the queue for")
            .setRequired(true)
        )
    ),

  /**
   * @param {MusiCore} client
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(client, interaction) {
    const voiceChannel = interaction.member.voice.channel;
    const botChannel = interaction.guild.members.me.voice.channel;

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
            .setDescription(`${process.env.FAIL_EMOJI} You must be in the same **voice channel** as me to use this command.`)
        ],
        ephemeral: true
      });
    }

    const queue = client.player.nodes.get(interaction.guild.id);
    const subcommand = interaction.options.getSubcommand();

    if (!queue || !queue.isPlaying) {
      return await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor('Red')
            .setDescription(`${process.env.FAIL_EMOJI} There is nothing playing.`)
        ],
        ephemeral: true
      });
    }

    // switch through subcommands

    switch (subcommand) {
      case "queue": {
        try {
          queue.clear();
          await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setColor('Green')
                .setDescription(`${process.env.SUCCESS_EMOJI} The queue has been cleared.`)
            ]
          });
        } catch (error) {
          await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setColor('Red')
                .setDescription(`${process.env.FAIL_EMOJI} Error trying to clear the queue.\n\`${error.message}\``)
            ]
          });
        }
      }
        break;

      case "user": {
        const target = interaction.options.getUser("target");
        const member = interaction.guild.members.cache.get(target.id);

        if (!member) {
          return await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setColor('Red')
                .setDescription(`${process.env.FAIL_EMOJI} I could not find that user.`)
            ]
          });
        }

        if (member.id === interaction.user.id) {
          return await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setColor('Red')
                .setDescription(`${process.env.FAIL_EMOJI} You cannot clear your own queue.`)
            ]
          });
        }

        try {
          const tracksEnqueued = queue.tracks.toArray().filter((track) => track.requestedBy.id === member.id);

          if (tracksEnqueued.length === 0) {
            return await interaction.editReply({
              embeds: [
                new EmbedBuilder()
                  .setColor('Red')
                  .setDescription(`${process.env.FAIL_EMOJI} That user has no tracks enqueued.`)
              ]
            });
          }

          // loop through tracks and remove them
          for (const track of tracksEnqueued) {
            queue.removeTrack(track);
          }

          await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setColor('Green')
                .setDescription(`${process.env.SUCCESS_EMOJI} Removed **${tracksEnqueued.length}** tracks from the queue that were enqueued by **${member}**.`)

            ]
          });

        } catch (error) {
          await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setColor('Red')
                .setDescription(`${process.env.FAIL_EMOJI} Error trying to clear the tracks.\n\`${error.message}\``)
            ]
          });
        }
      }
    }
  }
}