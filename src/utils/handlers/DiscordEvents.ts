import { BaseClient } from "../../structures/Client.js";
import path from "node:path";
import fs from "node:fs";

export async function registerDiscordEvents(client: BaseClient): Promise<void> {
  // Load all events from the events folder
  const discordEventsFolderPath = path.resolve("./dist/listeners/discord");
  const discordEventsFolders = await fs.promises.readdir(
    discordEventsFolderPath
  );

  for (const folder of discordEventsFolders) {
    const eventsFolderPath = path.resolve(discordEventsFolderPath, folder);
    const eventFiles = await fs.promises.readdir(eventsFolderPath);

    // Dynamically import all event files in this folder
    const eventModules = await Promise.all(
      eventFiles
        .filter((file) => file.endsWith(".js"))
        .map((file) =>
          import(`../../listeners/discord/${folder}/${file}`).then(
            (module) => module.default
          )
        )
    );

    // Loop through the loaded events and register them
    for (const event of eventModules) {
      try {
        if (event.once) {
          client.once(event.name, (...args) => event.execute(...args, client));
        } else {
          client.on(event.name, (...args) => event.execute(...args, client));
        }
      } catch (error) {
        console.error(`Error registering discord event ${event.name}:`, error);
      }
    }
  }

  console.log("Successfully registered discord events.");
}
