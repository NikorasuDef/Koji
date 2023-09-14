import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { BaseClient } from "../../structures/Client.js";

export default {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),

  async execute(interaction: ChatInputCommandInteraction, client: BaseClient) {
    await interaction.reply({ content: `${client.ws.ping}ms` });
  },
};
