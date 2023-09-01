import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { MusiCore } from "../../structures/Client.js";

export default {
  data: new SlashCommandBuilder()
    .setName("server-icon")
    .setDescription("Replies with the server's icon!"),

  /**
   * @param {MusiCore} client
   * @param {ChatInputCommandInteraction} interaction 
   */
  async execute(client, interaction) {
    await interaction.editReply({
      content: interaction.guild.iconURL({ size: 4096 }),
      ephemeral: true
     });
  }
}