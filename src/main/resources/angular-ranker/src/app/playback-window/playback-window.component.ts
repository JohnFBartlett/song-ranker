import { Component, Input, OnInit } from '@angular/core';
import { Credentials } from '../models/credentials';
import { Song } from '../models/song';
import { SpotifyService } from '../services/spotify-service.service';

@Component({
  selector: 'app-playback-window',
  templateUrl: './playback-window.component.html',
  styleUrls: ['./playback-window.component.css'],
})
export class PlaybackWindowComponent implements OnInit {
  @Input() song: string = '';
  @Input() artist: string = '';
  @Input() album: string | undefined;

  songUrl: string | undefined;

  constructor(private spotifyService: SpotifyService) {}

  ngOnInit(): void {
    this.computeSongUrl();
  }

  async computeSongUrl(): Promise<void> {
    const song: Song = await this.spotifyService.getSong(
      this.song,
      this.artist
    );

    this.songUrl = `https://open.spotify.com/embed/track/${song.id}`;
  }
}
