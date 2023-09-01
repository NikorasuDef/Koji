import { BridgeProvider, BridgeSource } from '@discord-player/extractor';

export const playerOptions = {
  bridgeProvider: new BridgeProvider(BridgeSource.YouTube),
  useLegacyFFmpeg: false,
  ytdlOptions: {
    quality: 'highestaudio',
    dlChunkSize: 0,
    highWaterMark: 1 << 25,
    liveBuffer: 40000,
    requestOptions: {
      headers: {
        cookie: process.env.YOUTUBE_COOKIE,
        'x-youtube-identity-token': process.env.YOUTUBE_IDENTITY_TOKEN
      }
    }
  }
}