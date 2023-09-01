import { BaseInteraction, Events } from "discord.js";
import { MusiCore } from "../../../structures/Client.js";
import colors from "colors";
import { ChatInputCommandInteraction } from "discord.js";

export default {
  name: Events.InteractionCreate,
  once: false,

  /**
   * @param {BaseInteraction} interaction
   * @param {MusiCore} client
   */

  async execute(client, interaction) {
    
    if (!interaction.isChatInputCommand()) return;
    if (!interaction.inGuild()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await interaction.deferReply();
      
      await command.execute(client, interaction);
    } catch (error) {
      console.error(
        `${colors.blue(new Date().toLocaleString())} ${colors.red(
          `An error occurred while executing the command: ${command.data.name} in ${interaction.guild.name}`
        )} ${colors.yellow(error.stack || error)}`
      );

    }

  }
}