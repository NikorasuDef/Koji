import { Track } from "discord-player";

interface IPlaylist {
  name: string;
  description: string;
  thumbnail: string;
  isPrivate: boolean;
  songs: Track[];
}

interface IPlaylistDocument extends IPlaylist { 
  guildId: string;
  playlistId: string;
}