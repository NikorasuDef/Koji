import { BaseClient } from "../../structures/Client.js";
import path from "node:path";
import fs from "node:fs";

/**
 * Registers all player events in the player folder
 * @param client - Discord Client
 */
export async function registerPlayerEvents(client: BaseClient): Promise<void> {
  const playerEventsFolderPath = path.resolve("./dist/listeners/player");
  const playerEventsFiles = await fs.promises.readdir(playerEventsFolderPath);

  const playerEventsModules = await Promise.all(
    playerEventsFiles
      .filter((file) => file.endsWith(".js"))
      .map((file) =>
        import(`../../listeners/player/${file}`).then(
          (module) => module.default
        )
      )
  );

  for (const event of playerEventsModules) {
    try {
      if (event.isPlayerEvent) {
        client.player.events.on(event.name, (...args: any) =>
          event.execute(...args)
        );
      } else {
        client.player.on(event.name, (...args: any) => event.execute(...args));
      }
    } catch (error) {
      console.error(
        `Error registering player event file ${event.name}: ${error}`
      );
    }
  }

  console.log("Successfully registered player events.");
}
