import { ButtonBuilder, ChatInputCommandInteraction, ButtonStyle, ActionRowBuilder, EmbedBuilder, ActionRowData, ActionRowComponentData, APIActionRowComponent, APIMessageActionRowComponent, ComponentType } from "discord.js";
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
    `**Now Playing:**\n[${queue.currentTrack.title}](${queue.currentTrack.url})\n\n`,
    `**Up Next:**\n${getTracksMap(queue, currentPage, tracksToDisplay)}`,
  ];

  const responseEmbed = new EmbedBuilder()
    .setColor("#69B0BF")
    .setTitle(`Queue for ${interaction.guild.name}`)
    .setDescription(embedDescription.join(""))
    .setFooter({
      text: `Page ${currentPage + 1} of ${Math.ceil(
        queueSize / tracksToDisplay
      )}`,
    });
  
  const response = await interaction.reply({
    embeds: [responseEmbed],
    components: [actionRow],
  });
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
    .map((t, index) => `**${start + index + 1}.** [${t.title}](${t.url})`)
    .join("\n");

  return (
    tracks ||
    "There are no tracks to display. Add some tracks to the queue using the </play:1148316823503261809> command."
  );
}