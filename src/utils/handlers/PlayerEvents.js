import { MusiCore } from "../../structures/Client.js";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import colors from "colors";
import fs from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Register events for discord-player
 * @param {MusiCore} client Custom player client
 * @returns {Promise<void>}
 */
export async function registerPlayerEvents(client) {
  try {
    // Load all events from the events folder
    const discordPlayerEventsFolderPath = path.join(__dirname, "..", "..", "events", "player");
    const discordPlayerFolders = await fs.promises.readdir(discordPlayerEventsFolderPath);

    for (const folder of discordPlayerFolders) {
      const eventsFolderPath = path.join(discordPlayerEventsFolderPath, folder);
      const eventFiles = await fs.promises.readdir(eventsFolderPath);

      // Dynamically import all event files in this folder
      const eventModules = await Promise.all(
        eventFiles
          .filter((file) => file.endsWith(".js"))
          .map((file) => import(`../../events/player/${folder}/${file}`))
      );

      // Loop through the loaded events and register them
      for (const eventModule of eventModules) {
        const event = eventModule.default;

        try {
          if (event.once) {
            client.player.events.once(event.name, (...args) => event.execute(...args, client));
          } else {
            client.player.events.on(event.name, (...args) => event.execute(...args, client));
          }
        } catch (error) {
          console.error(`Error registering event ${event.name}:`, error);
        }
      }
    }

    console.log(`${colors.blue(new Date().toLocaleString())} ${colors.white("Player events loaded.")}`);
  } catch (error) {
    console.error("Error loading discord-player events:", error);
  }
}