import { BaseInteraction, Events } from "discord.js";
import { MusiCore } from "../../../structures/Client.js";
import colors from "colors";

export default {
  name: Events.InteractionCreate,
  once: false,

  /**
   * @param {BaseInteraction} interaction
   * @param {MusiCore} client
   */

  async execute(client, interaction) {

    if (!interaction.isButton()) return;
    if (!interaction.inGuild()) return;

    console.log('button')

  }
}