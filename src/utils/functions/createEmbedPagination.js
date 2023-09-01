import { ChatInputCommandInteraction, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";
import { GuildQueue } from "discord-player";

/**
 * @param {ChatInputCommandInteraction} interaction Discord interaction
 * @param {GuildQueue} queue Guild queue
 * @returns {Promise<void>}
 */
export async function createQueuePagination(interaction, queue) {

  const tracksToDisplay = 10;
  const queueSize = queue.tracks.toArray().length;

  const buttonBuilders = [
    new ButtonBuilder().setCustomId("fast_previous_page").setLabel("home").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("previous_page").setLabel("previous").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("next_page").setLabel("next").setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId("fast_next_page").setLabel("end").setStyle(ButtonStyle.Secondary)
  ];

  const actionRow = new ActionRowBuilder().addComponents(...buttonBuilders);

  let currentPage = 0;

  const embedDescription = [
    `**Now Playing:**\n[${queue.currentTrack.title}](${queue.currentTrack.url})\n\n`,
    `**Up Next:**\n${getTracksMap(queue, currentPage, tracksToDisplay)}`,
  ]

  const embedResponse = new EmbedBuilder()
    .setColor("#69B0BF")
    .setTitle(`Queue for ${interaction.guild.name}`)
    .setDescription(embedDescription.join(""))
    .setFooter({ text: `Page ${currentPage + 1} of ${Math.ceil(queueSize / tracksToDisplay)}` })
  
  const response = await interaction.editReply({
    embeds: [embedResponse],
    components: [actionRow],
    fetchReply: true
  });

  const filter = (button) => button.user.id === interaction.user.id;
  const collector = response.createMessageComponentCollector({ filter, time: 60000, error: ["time"] });

  collector.on("collect", async (button) => { 

    collector.resetTimer();

    switch (button.customId) { 
      case "fast_previous_page": { 
        currentPage = 0;
      }
        break;
      
      case "previous_page": {
        currentPage = Math.max(currentPage - 1, 0);
      }
        break;
      
      case "next_page": { 
        currentPage = Math.min(currentPage + 1, Math.ceil(queueSize / tracksToDisplay) - 1);
      }
        break;
      
      case "fast_next_page": {
        currentPage = Math.ceil(queueSize / tracksToDisplay) - 1;
      }
        break;
    }

    const newEmbedDescription = [
      `**Now Playing:**\n[${queue.currentTrack.title}](${queue.currentTrack.url})\n\n`,
      `**Up Next:**\n${getTracksMap(queue, currentPage, tracksToDisplay)}`,
    ]

    const newEmbedResponse = new EmbedBuilder()
      .setColor("#69B0BF")
      .setTitle(`Queue for ${interaction.guild.name}`)
      .setDescription(newEmbedDescription.join(""))
      .setFooter({ text: `Page ${currentPage + 1} of ${Math.ceil(queueSize / tracksToDisplay)}` })
    
    buttonBuilders[0].setDisabled(currentPage === 0);
    buttonBuilders[1].setDisabled(currentPage === 0);
    buttonBuilders[2].setDisabled(currentPage === Math.ceil(queueSize / tracksToDisplay) - 1);
    buttonBuilders[3].setDisabled(currentPage === Math.ceil(queueSize / tracksToDisplay) - 1);

    await button.update({
      embeds: [newEmbedResponse],
      components: [actionRow]
    }).catch(() => { });
  });

  collector.on("end", async () => { 
    await response.edit({
      embeds: [embedResponse],
      components: []
    }).catch(() => { });
  });
}

function getTracksMap(queue, currentPage, tracksToDisplay) {
  const start = currentPage * tracksToDisplay;
  const tracks = queue.tracks
    .toArray()
    .slice(start, start + tracksToDisplay)
    .map((t, index) => `**${start + index + 1}.** [${t.title}](${t.url})`)
    .join('\n');

  return tracks || "There are no tracks to display.";
}