import { MusiCore } from "../../structures/Client.js";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import colors from "colors";
import fs from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


/**
 * Register events for discord.js
 * @param {MusiCore} client Custom client
 * @returns {Promise<void>}
 */
export async function registerDiscordEvents(client) {
  try {
    // Load all events from the events folder
    const discordEventsFolderPath = path.join(__dirname, "..", "..", "events", "discord");
    const discordEventsFolders = await fs.promises.readdir(discordEventsFolderPath);

    for (const folder of discordEventsFolders) {
      const eventsFolderPath = path.join(discordEventsFolderPath, folder);
      const eventFiles = await fs.promises.readdir(eventsFolderPath);

      // Dynamically import all event files in this folder
      const eventModules = await Promise.all(
        eventFiles
          .filter((file) => file.endsWith(".js"))
          .map((file) => import(`../../events/discord/${folder}/${file}`))
      );

      // Loop through the loaded events and register them
      for (const eventModule of eventModules) {
        const event = eventModule.default;

        try {
          if (event.once) {
            client.once(event.name, (...args) => event.execute(client, ...args));
          } else {
            client.on(event.name, (...args) => event.execute(client, ...args));
          }
        } catch (error) {
          console.error(`Error registering discord event ${event.name}:`, error);
        }
      }
    }

    console.log(`${colors.blue(new Date().toLocaleString())} ${colors.white("Discord events loaded.")}`);
  } catch (error) {
    console.error("Error loading discord.js events:", error);
  }
}
