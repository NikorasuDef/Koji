import { Player, GuildQueue, QueueRepeatMode, Track } from "discord-player";
import { BridgeProvider, BridgeSource } from "@discord-player/extractor";
import { BaseClient } from "./Client.js";
import fs from "node:fs";

export class BasePlayer extends Player {
  public constructor(client: BaseClient) {
    super(client, {
      useLegacyFFmpeg: false,
      bridgeProvider: new BridgeProvider(BridgeSource.Auto),
      ytdlOptions: {
        quality: "highestaudio",
        filter: "audioonly",
        highWaterMark: 1 << 25,
        dlChunkSize: 0,
        liveBuffer: 2500,
        requestOptions: {
          headers: {
            cookie: process.env.YOUTUBE_COOKIE,
          },
        },
      },
    });
  }

  /**
   * Whether or not the stream is currently paused.
   * @param id - The guild id
   * @returns Boolean if the queue is paused or not
   */
  public paused(id: string): boolean {
    return this.queues.get(id).node.isPaused();
  }

  /**
   * Get the loop mode of the queue
   * @param queue - The queue to get the loop mode from
   */
  public getLoopMode(queue: GuildQueue): string {
    return QueueRepeatMode[queue.repeatMode].toLowerCase();
  }

  /**
   * Remove duplicate tracks from the queue
   * @param queue - The queue to remove duplicates from
   */
  public removeDuplicates(queue: GuildQueue): Track[] {
    const unique = new Set();
    const filtered = queue.tracks.filter((track) => {
      if (unique.has(track.url)) return false;
      unique.add(track.url);
      return true;
    });

    queue.tracks.store = filtered;

    return filtered;
  }
}
