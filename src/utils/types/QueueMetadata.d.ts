import { ChatInputCommandInteraction, GuildTextBasedChannel } from "discord.js";

export interface QueueMetadata { 
  interaction: ChatInputCommandInteraction;
  channel: GuildTextBasedChannel;
}