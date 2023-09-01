import { MusiCore } from "../../structures/Client.js";
import { REST, Routes } from "discord.js";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import colors from "colors";
import fs from "node:fs";

const __filename = fileURLToPath(new URL('.', import.meta.url));
const __dirname = dirname(__filename);

/**
 * Register commands to Discord
 * @param {MusiCore} client Custom client
 * @returns {Promise<void>}
 */
export async function registerCommands(client) {
  try {
    const commands = [];
    const commandsFolderPath = path.join(__dirname, "..", "..", "src", "commands");
    const commandsFolders = await fs.promises.readdir(commandsFolderPath);

    for (const folder of commandsFolders) {
      const foldersPath = path.join(commandsFolderPath, folder);
      const commandFiles = await fs.promises.readdir(foldersPath);

      const commandModules = await Promise.all(
        commandFiles
          .filter((file) => file.endsWith(".js"))
          .map((file) => import(`../../commands/${folder}/${file}`))
      );

      // Loop through the loaded command modules and register the commands
      for (const commandModule of commandModules) {
        const command = commandModule.default;
        
        try {
          client.commands.set(command.data.name, command);
          commands.push(command.data.toJSON());
        } catch (error) {
          console.error(`${colors.blue(new Date().toLocaleString())} ${colors.red(`Error importing command file ${command}:`)} ${colors.white(error)}`);
        }
      }
    }

    // Register commands to Discord
    const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

    try {
      console.log(
        `${colors.blue(new Date().toLocaleString())} ${colors.white(
          "Started refreshing application (/) commands."
        )}`
      );

      await rest.put(
        Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_TEST_ID),
        { body: commands }
      );

      console.log(
        `${colors.blue(new Date().toLocaleString())} ${colors.white(
          "Successfully reloaded application (/) commands."
        )}`
      );
    } catch (error) {
      console.error(
        `${colors.blue(new Date().toLocaleString())} ${colors.red(
          "An error occurred while reloading application (/) commands."
        )}`,
        error
      );
    }
  } catch (error) {
    console.error("Error registering slash commands:", error);
  }
}