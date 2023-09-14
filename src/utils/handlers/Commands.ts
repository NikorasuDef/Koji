import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

import { BaseClient } from "../../structures/Client.js";
import { REST, Routes } from "discord.js";
import path from "node:path";
import fs from "node:fs";

export async function registerCommands(client: BaseClient): Promise<void> {
  try {
    const commands = [];
    const commandsFolderPath = path.resolve("./dist/commands");
    const commandsFolders = await fs.promises.readdir(commandsFolderPath);

    for (const folder of commandsFolders) {
      const foldersPath = path.resolve(commandsFolderPath, folder);
      const commandFiles = await fs.promises.readdir(foldersPath);

      const commandModules = await Promise.all(
        commandFiles
          .filter((file) => file.endsWith(".js"))
          .map((file) =>
            import(`../../commands/${folder}/${file}`).then(
              (module) => module.default
            )
          )
      );

      for (const command of commandModules) {
        try {
          client.commands.set(command.data.name, command);
          commands.push(command.data.toJSON());
        } catch (error) {
          console.error(`Error loading command ${command.name}:`, error);
        }
      }
    }

    // Register commands to Discord
    const rest = new REST({ version: "10" }).setToken(
      process.env.DISCORD_TOKEN
    );

    try {
      console.log("Started refreshing application (/) commands.");

      await rest.put(
        Routes.applicationGuildCommands(
          process.env.DISCORD_CLIENT_ID,
          process.env.DISCORD_GUILD_ID
        ),
        {
          body: commands,
        }
      );

      console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
      console.error("Error refreshing application (/) commands:", error);
    }
  } catch (error) {
    console.error("Error registering slash commands:", error);
  }
}
