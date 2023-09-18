import { ButtonBuilder, ChatInputCommandInteraction, ButtonStyle, ActionRowBuilder, EmbedBuilder, ActionRowData, ActionRowComponentData, APIActionRowComponent, APIMessageActionRowComponent, ComponentType, ButtonInteraction } from "discord.js";
import { GuildQueue } from "discord-player";

/**
 * Create an embed pagination
 * @param interaction - Discord interaction
 * @param data - Data to display
 */
export async function createEmbedPagination(interaction: ChatInputCommandInteraction, queue: GuildQueue): Promise<void> { 
  const tracksToDisplay = 10;
  const queueSize = queue.tracks.size;

  const buttonsBuilders: ButtonBuilder[] = [
    new ButtonBuilder().setCustomId("fast_previous_page").setLabel("First").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("previous_page").setLabel("Previous").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("next_page").setLabel("Next").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("fast_next_page").setLabel("End").setStyle(ButtonStyle.Secondary)
  ];

  const actionRow: APIActionRowComponent<APIMessageActionRowComponent> = {
    type: ComponentType.ActionRow,
    components: buttonsBuilders.map((b) => b.toJSON())
  };
  
  let currentPage = 0;
  
  const embedDescription = [
    `**Now Playing:**\n\`${queue.currentTrack.duration}\` | [${queue.currentTrack.title}](${queue.currentTrack.url})\n\n`,
    `**Up Next:**\n${getTracksMap(queue, currentPage, tracksToDisplay)}`,
  ];

  const responseEmbed = new EmbedBuilder()
    .setColor("#69B0BF")
    .setDescription(embedDescription.join(""))
    .setFooter({
      text: `Page ${currentPage + 1} of ${Math.ceil(queueSize / tracksToDisplay)}`,
    });
  
  const response = await interaction.reply({
    embeds: [responseEmbed],
    components: [actionRow],
    fetchReply: true
  });

  const filter = (button: ButtonInteraction) => button.user.id === interaction.user.id;
  const collector = response.createMessageComponentCollector({ filter, time: 60000 });

  collector.on("collect", async (button: ButtonInteraction) => {
    collector.resetTimer();

    if (button.customId === 'fast_previous_page') {
      if (currentPage === 0) { 
        await button.reply({
          content: "You are already on the first page.",
          ephemeral: true,
        });
        return;
      }
      currentPage = 0;
    } else if (button.customId === 'previous_page') {

      if (currentPage === 0) { 
        await button.reply({
          content: "You are already on the first page.",
          ephemeral: true,
        });
        return;
      }

      currentPage = Math.max(currentPage - 1, 0);
    } else if (button.customId === 'next_page') {

      if (currentPage === Math.ceil(queueSize / tracksToDisplay) - 1) {
        await button.reply({
          content: "You are already on the last page.",
          ephemeral: true,
        });
        return;
      }

      currentPage = Math.min(currentPage + 1, Math.ceil(queueSize / tracksToDisplay) - 1);
      
    } else if (button.customId === 'fast_next_page') {

      if (currentPage === Math.ceil(queueSize / tracksToDisplay) - 1) {
        await button.reply({
          content: "You are already on the last page.",
          ephemeral: true
        });
        return;
      }

      currentPage = Math.ceil(queueSize / tracksToDisplay) - 1;
    }

    const newEmbedDescription = [
      `**Now Playing:**\n\`${queue.currentTrack.duration}\` | [${queue.currentTrack.title}](${queue.currentTrack.url})\n\n`,
      `**Up Next:**\n${getTracksMap(queue, currentPage, tracksToDisplay)}`,
    ];

    responseEmbed.setDescription(newEmbedDescription.join(""));
    responseEmbed.setFooter({ text: `Page ${currentPage + 1} of ${Math.ceil(queueSize / tracksToDisplay)}` });
    
    buttonsBuilders[0].setDisabled(currentPage === 0);
    buttonsBuilders[1].setDisabled(currentPage === 0);
    buttonsBuilders[2].setDisabled(currentPage === Math.ceil(queueSize / tracksToDisplay) - 1);
    buttonsBuilders[3].setDisabled(currentPage === Math.ceil(queueSize / tracksToDisplay) - 1);

    await button.update({
      embeds: [responseEmbed],
      components: [actionRow]
    }).catch(() => { });
  });

  collector.on('end', async () => {
    await response.edit({
      components: []
    }).catch(() => { })
  })
}

/**
 * Get tracks map
 * @param queue - Data to map
 * @param currentPage - Current page
 * @param tracksToDisplay - Tracks to display
 */
function getTracksMap(queue: GuildQueue, currentPage: number, tracksToDisplay: number): string {
  const start = currentPage * tracksToDisplay;
  const tracks = queue.tracks
    .toArray()
    .slice(start, start + tracksToDisplay)
    .map((t, index) => `**${start + index + 1}.** \`${t.duration}\` | [${t.title}](${t.url})`)
    .join("\n");

  return (
    tracks ||
    "There are no tracks to display. Add some tracks to the queue using the </play:1148889137269706803> command."
  );
}