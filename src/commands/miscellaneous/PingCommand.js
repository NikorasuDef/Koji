import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { MusiCore } from "../../structures/Client.js";

export default {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with bot's ping!"),

  /**
   * @param {MusiCore} client
   * @param {ChatInputCommandInteraction} interaction 
   */
  async execute(client, interaction) {
    const sent = await interaction.editReply({ content: "Pinging...", fetchReply: true });
    await interaction.editReply({ content: `💓 Websocket heartbeat: \`${Math.min(interaction.client.ws.ping)}ms\`\n⏱️ Api Latency: \`${Math.min(sent.createdTimestamp - interaction.createdTimestamp)}ms\`` });
  }
}