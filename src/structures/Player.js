import { Player, GuildQueue, QueueRepeatMode } from 'discord-player';
import { playerOptions } from '../utils/config/PlayerOptions.js';
import { MusiCore } from './Client.js';

export class BasePlayer extends Player {

  /**
   * Discord client
   * @param {MusiCore} client 
   */
  constructor(client) {
    super(client, playerOptions);
  } 

  /**
   * Gets the current loop mode for a queue
   * @param {GuildQueue} queue The queue to get the loop mode for
   * @returns {String} The loop mode
   */
  getLoopMode(queue) {
    return QueueRepeatMode[queue.repeatMode].toLowerCase();
  }

  /**
   * Removes duplicate tracks from the queue
   * @param {GuildQueue} queue The queue to remove duplicates from
   * @returns {Boolean} True if the queue was successfully updated
   */
  removeDuplicates(queue) {
    const unique = new Set();
    const filtered = queue.tracks.filter(track => {
      if (unique.has(track.url)) return false;
      unique.add(track.url);
      return true;
    });

    queue.tracks.store = filtered;

    return true;
  }
}