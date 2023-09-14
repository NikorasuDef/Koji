declare global {
  namespace NodeJS { 
    interface ProcessEnv {
      DISCORD_TOKEN: string;
      DISCORD_CLIENT_ID: string;
      DISCORD_GUILD_ID: string;

      DISCORD_LOG_WEBHOOK_ID: string;
      DISCORD_LOG_WEBHOOK_TOKEN: string;

      NODE_ENV: "development" | "production";

      DP_SPOTIFY_CLIENT_ID: string;
      DP_SPOTIFY_CLIENT_SECRET: string;

      YOUTUBE_ID: string;
      YOUTUBE_COOKIE: string;
    }
  }
}

export {}