import { Component, OnInit } from '@angular/core';
import { BackendService } from '../services/backend.service';
import { Category } from '../data/models/category';
import { Option } from '../data/models/option';
import { Router } from '@angular/router';
import { SpotifyService } from '../services/spotify-service.service';
import { delay } from '../utils/utils';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.css'],
})
export class CreateCategoryComponent implements OnInit {
  constructor(private backendService: BackendService, private spotifyService: SpotifyService, private router: Router) {}

  isSongs: boolean = false;
  searching: boolean = false;
  searchFailed: boolean = false;
  artist: string = '';
  optionString: string = '';

  ngOnInit(): void {}

  checkSong() {
    this.isSongs = !this.isSongs;
  }

  async searchSongs() {
    if (this.artist === '') {
      console.log("Artist name not provided.");
      return;
    }
    if (this.searching) {
      console.log("Already running a search.")
      return;
    }

    console.log(`Searching for songs by artist '${this.artist}'`);
    this.searching = true;

    try {
      const songs = await this.spotifyService.searchSongsByArtist(this.artist);

      this.optionString = songs.map(song => song.name).join('\n');
    } catch (e) {
      console.log(`Failed to fetch songs: ${(e as Error).message}`)
      this.searchFailed = true;

      await delay(3000);
      this.searching = false;
      this.searchFailed = false;
    }
    this.searching = false;
  }

  async addCategory(name: string): Promise<void> {
    name = name.trim();
    if (!name) {
      return;
    }
    let type = this.isSongs ? 'song' : '';
    let optionLines = this.optionString.split(/[\r\n]+/);
    let options: Option[] = [];
    optionLines.forEach((optionLine) => {
      if (this.artist.length > 0) {
        options.push({ name: optionLine.trim(), artist: this.artist });
      } else {
        options.push({ name: optionLine.trim() });
      }
    });

    const category: Category = { name: name, type: type, options: options };
    await this.backendService
      .createCategory(category)
      .subscribe((categories) => {
        console.log(categories);
      });

    this.router.navigate(['/dashboard']);
  }
}
