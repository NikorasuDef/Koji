import { clientOptions } from "../utils/config/ClientOptions.js";
import { Client, Collection } from "discord.js";
import { BasePlayer } from "./Player.js";
import { config } from "dotenv";

config({ path: ".env" });

export class MusiCore extends Client {
  constructor() {
    super(clientOptions);

    /**
     * Collection to store commands
     * @type {Collection<String, Object>}
     */
    this.commands = new Collection();

    /**
     * Collection to store cooldowns for commands
     * @type {Collection<String, Object>}
     */
    this.cooldowns = new Collection();

    /**
     * Player instance
     * @type {BasePlayer}
     */
    this.player = new BasePlayer(this);
  }
}