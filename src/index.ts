import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

import { BaseClient } from "./structures/Client.js";
import { registerCommands } from "./utils/handlers/Commands.js";
import { registerDiscordEvents } from "./utils/handlers/DiscordEvents.js";
import { registerPlayerEvents } from "./utils/handlers/PlayerEvents.js";
const client = new BaseClient();

(async () => {
  await registerDiscordEvents(client);
  await registerPlayerEvents(client);
  await registerCommands(client);
  await client.player.extractors.loadDefault();
  await client.login(process.env.DISCORD_TOKEN);
})();
