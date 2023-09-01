import { MusiCore } from "../../../structures/Client.js";
import { Events } from "discord.js";
import colors from "colors";

export default {
  name: Events.ClientReady,
  once: true,

  /**
   * @param {MusiCore} client
   */

  async execute(client) {
    console.log(
      `${colors.blue(new Date().toLocaleString())} ${colors.white(
        `Logged in as ${client.user.username}!`
      )}`
    );
  }
}