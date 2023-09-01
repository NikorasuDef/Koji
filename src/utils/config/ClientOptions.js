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
  },
  sweepers: {
    users: {
      interval: 3600,
      filter: (user) => !user.user.bot
    },
    messages: {
      interval: 3600,
      filter: (message) => !message.pinned && !message.deleted && !message.system && !message.author.bot
    }
  }
}
