import { BaseClient } from "../../../structures/Client.js";
import { ChatInputCommandInteraction, Events } from "discord.js";

export default {
  name: Events.InteractionCreate,
  once: false,

  /**
   * @param client - Discord Client
   * @param interaction - Discord interaction
   */
  async execute(
    interaction: ChatInputCommandInteraction,
    client: BaseClient
  ): Promise<void> {
    if (!interaction.isChatInputCommand()) return;
    if (!interaction.inGuild()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      // @ts-ignore
      command.execute(interaction, client);
    } catch (error) {
      console.error(
        `Error executing command ${interaction.commandName}: ${error}`
      );
    }
  },
};
