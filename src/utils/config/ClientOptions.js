import { GatewayIntentBits, Partials, ActivityType } from "discord.js";

export const clientOptions = {
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildVoiceStates
  ],
  partials: [
    Partials.User,
    Partials.Channel,
    Partials.Message,
    Partials.GuildMember
  ],
  presence: {
    status: 'online',
    activities: [
      {
        name: 'to some music 🎵',
        type: ActivityType.Listening
      }
    ]
  }
}
