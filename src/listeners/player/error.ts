import { GuildQueue, GuildQueueEvent } from "discord-player";

export default {
  name: GuildQueueEvent.error,
  isPlayerEvent: true,

  async execute(queue: GuildQueue, error: Error) {
    console.error(`Error playing track in guild ${queue.guild.name}: ${error}`);
  },
};
