import { BaseClient } from "../../../structures/Client.js";
import { ChatInputCommandInteraction, Events } from "discord.js";

export default {
  name: Events.ClientReady,
  once: true,

  /**
   * @param client - Discord Client
   */
  async execute(client: BaseClient): Promise<void> {
    console.log(`Logged in as ${client.user?.username}!`);
  },
};
