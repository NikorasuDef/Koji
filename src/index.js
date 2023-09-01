import { MusiCore } from "./structures/Client.js";
import { registerCommands } from "./utils/handlers/Commands.js";
import { registerDiscordEvents } from "./utils/handlers/DiscordEvents.js";
import { registerPlayerEvents } from "./utils/handlers/PlayerEvents.js";
const client = new MusiCore();

(async () => {
  await registerDiscordEvents(client);
  await registerPlayerEvents(client);
  await registerCommands(client);
  await client.player.extractors.loadDefault();
  await client.login(process.env.DISCORD_TOKEN);
})();