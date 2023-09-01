import { ChatInputCommandInteraction } from "discord.js";
import { Emojis, Colors } from "./constants.js";
import { createEmbed } from "./createEmbed.js";

/**
 * Handle an error response
 * @param {ChatInputCommandInteraction} interaction The interaction
 * @param {string} message The message to send
 * @param {Error} error The error
 */
export async function handleErrorResponse(interaction, message, error) {
  return await interaction.editReply({
    embeds: [createEmbed(Colors.ERROR, `${Emojis.FAIL} ${message}:\n${error}`)],
    ephemeral: true
  });
}