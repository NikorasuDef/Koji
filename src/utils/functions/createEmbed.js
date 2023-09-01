import { EmbedBuilder } from "discord.js";

/**
 * Create an embed
 * @param {String} color The color of the embed
 * @param {String} description The description of the embed
 */
export function createEmbed(color, description) {
  return new EmbedBuilder()
    .setColor(color)
    .setDescription(description);
}