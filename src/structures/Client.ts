import {
  Client,
  GatewayIntentBits,
  Partials,
  ActivityType,
  Collection,
} from "discord.js";
import { BasePlayer } from "./Player.js";

export class BaseClient extends Client {

  /**
   * Collection to store SLASH commands
   */
  public commands = new Collection<string, object>();

  /**
   * Collection to store COOLDOWNS for commands
   */
  public cooldowns = new Collection<string, object>();

  /**
   * Collection to store ALIASES for PREFIX commands
   */
  public aliases = new Collection<string, string>();

  /**
   * Player instance
   */
  public player = new BasePlayer(this);

  public constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildVoiceStates,
      ],
      partials: [
        Partials.User,
        Partials.Channel,
        Partials.Message,
        Partials.GuildMember,
      ],
      presence: {
        status: "online",
        activities: [
          {
            name: "/help 🎶",
            type: ActivityType.Listening,
          },
        ],
      },
    });
  }
}
