import { Component, Input, OnInit } from '@angular/core';
import { Song } from '../../data/models/song';
import { SpotifyService } from '../../services/spotify-service.service';

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
    console.log("Computing song URL")
    const song: Song = await this.spotifyService.getSong(
      this.song,
      this.artist
    );

    console.log(`response: ${song.name}, ${song.name}`)

    this.songUrl = `https://open.spotify.com/embed/track/${song.id}`;
  }
}
