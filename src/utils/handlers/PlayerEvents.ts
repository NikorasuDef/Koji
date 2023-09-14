import { useMainPlayer } from "discord-player";
import path from "node:path";
import fs from "node:fs";

export async function registerPlayerEvents(): Promise<void> { 
  
  const player = useMainPlayer();
  const playerEventsFolderPath = path.resolve("./dist/listeners/player");
  const playerEventsFiles = await fs.promises.readdir(playerEventsFolderPath);

  const playerEventsModules = await Promise.all(
    playerEventsFiles
      .filter((file) => file.endsWith(".js"))
      .map((file) => import(`../../listeners/player/${file}`)
      .then((module) => module.default))
  );

  for (const event of playerEventsModules) { 

    try {
      if (event.isPlayerEvent) {
        player?.events.on(event.name, (...args: any) => event.execute(...args));
      } else {
        player?.on(event.name, (...args: any) => event.execute(...args));
      }
    } catch (error) {
      console.error(`Error registering player event file ${event.name}: ${error}`)
    }
  }

  console.log("Successfully registered player events.");
}
