import {
  ChatInputCommandInteraction,
  Message,
  ColorResolvable,
  EmbedBuilder,
} from "discord.js";

type EmbedType = "error" | "success" | "info";

// Constants for embed colors
const embedColors: Record<EmbedType, ColorResolvable> = {
  error: "#E92C3A",
  success: "#55D491",
  info: "#1E73CC",
};

/**
 * Create an embed response and send it to the appropriate context.
 * @param context - Response context (either ChatInputCommandInteraction or Message)
 * @param type - Type of embed (error, success, info)
 * @param description - Embed description
 */
export async function createEmbedResponse(
  context: ChatInputCommandInteraction | Message,
  type: EmbedType,
  description: string
): Promise<void> {
  try {
    const responseEmbed = new EmbedBuilder()
      .setColor(embedColors[type])
      .setDescription(description);

    const responseObject = { embeds: [responseEmbed] };

    if (context instanceof ChatInputCommandInteraction) {
      if (context.deferred) {
        await context.editReply(responseObject);
      } else {
        await context.reply(responseObject);
      }
    } else if (context instanceof Message) {
      await context.reply(responseObject);
    }
  } catch (error) {
    console.error("Error sending embed response:", error);
    // Handle the error as needed (e.g., logging, sending an error message)
  }
}
