import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Credentials } from '../data/models/credentials';
import { Song } from '../data/models/song';
import { Token } from '../data/models/token';
import { Album, AlbumTracksSearch, Artist, ArtistAlbumSearch, ArtistSearch, ParamType, SearchRequest, SongSearch } from '../data/models/songSearch';
import { filterSongsByName } from '../utils/utils';

const TAYLOR_REJECTED_ALBUMS = [
 "Fearless",
 "Speak Now",
 "Red",
 "1989"
]

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {

  private credsUrl = 'http://localhost:9001/credentials';
  // private credsUrl = '/credentials';
  private baseSpotifyUrl = 'https://api.spotify.com/v1';
  private spotifyTokenUrl = 'https://accounts.spotify.com/api/token';
  private spotifySearchUrl = 'https://api.spotify.com/v1/search/';

  private cachedCredentials: Credentials | undefined;
  private cachedToken: Token | undefined;
  private nextCheck: number = Date.now();

  constructor(private http: HttpClient) {
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  async getCreds(): Promise<Credentials> {
    console.log('trying to get credentials');
    this.cachedCredentials =
      this.cachedCredentials ||
      (await this.http
        .get<Credentials>(this.credsUrl, {
          params: {
            name: 'main',
          },
        })
        .pipe(
          tap((_) => console.log('fetched credentials')),
          catchError(this.handleError<Credentials>('getCreds'))
        )
        .toPromise());
    return this.cachedCredentials;
  }

  async getToken(): Promise<Token|null> {
    console.log('trying to get token with credentials');
    if (Date.now() < this.nextCheck && this.cachedToken) {
      console.log(`Returning cached token`);
      return this.cachedToken;
    } else if (!this.cachedCredentials) {
      console.log("Don't have credentials yet. Trying to get creds");
      await this.getCreds();
    }

    const encodedCreds = btoa(
      `${this.cachedCredentials!.clientId}:${
        this.cachedCredentials!.clientSecret
      }`
    );
    const requestOptions = {
      headers: new HttpHeaders({
        Authorization: `Basic ${encodedCreds}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
    };
    // const params = new HttpParams();
    // params.set('grant_type', 'client_credentials');
    const params = `grant_type=client_credentials`;

    try {
      console.log(`These are the params: ${params}`);
      this.cachedToken = await this.http
        .post<Token>(this.spotifyTokenUrl, params, requestOptions)
        .toPromise();

        this.nextCheck = Date.now() + 1000 * (this.cachedToken.expires_in - 5);
        console.log(`Next check is at ${new Date(this.nextCheck).toISOString()}`);
        return this.cachedToken;
    } catch (error) {
      console.log("Ran into an error")
      console.log(`error: ${(error as Error).message}`)

      return null
    }
  }

  async makeParams(params: ParamType): Promise<SearchRequest | null> {
    const token = await this.getToken();

    if (!token) {
      return null;
    } else {
      console.log("Retrieved token.")
    }

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token.access_token}`,
      }),
      params: params,
    };
  }

  async searchSongsByArtist(artistName: string): Promise<Song[]> {
    // Get artist ID
    const artistResult = await this.getArtist(artistName);
    if (!artistResult) {
      console.log("Couldn't find the artist");
      return [];
    }
    console.log(`Got artist result: ${artistResult.name} (${artistResult.id})`)

    // Get albums by artist
    const albums = await this.getAlbumsForArtist(artistResult.id);
    console.log(`Got albums: ${albums.map(album => album.name).join(',')}`)

    // Get songs for albums
    const songs = await this.getAlbumSongs(albums.map(album => album.id));
    console.log(`Found ${songs.length} songs`)

    return songs;
  }

  async getArtist(artistName: string): Promise<Artist|undefined> {
    const params = await this.makeParams({q: artistName, type: "artist"})
    if (!params) {
      return undefined;
    }
    const searchResult = await this.http
      .get<ArtistSearch>(this.spotifySearchUrl, params)
      .toPromise();
    console.log(`artist search result: ${JSON.stringify(searchResult)}`)

    return searchResult.artists.items.find(artist => artist.name.toLowerCase() === artistName.toLowerCase())
  }

  async getAlbumsForArtist(artistId: string): Promise<Album[]> {
    const url = `${this.baseSpotifyUrl}/artists/${artistId}/albums`
    const params = await this.makeParams({include_groups: ['album', 'single']})
    if (!params) {
      return [];
    }

    const searchResult = await this.http
      .get<ArtistAlbumSearch>(url, params)
      .toPromise();

    return this.taylorFilter(searchResult.items);
  }

  taylorFilter(albums: Album[]): Album[] {
    return albums.filter(album => 
      !TAYLOR_REJECTED_ALBUMS.includes(album.name)
    )
  }

  async getAlbumSongs(albumIds: string[]): Promise<Song[]> {
    const songs: Song[] = [];
    for (const albumId of albumIds) {
      const url = `${this.baseSpotifyUrl}/albums/${albumId}/tracks`
      const params = await this.makeParams({include_groups: ['album', 'single']})
      if (params) {
        const searchResult = await this.http
        .get<AlbumTracksSearch>(url, params)
        .toPromise();

        const songItems = searchResult.items.map((songItem) => {
          return {name: songItem.name, id: songItem.id}
        })
        console.log(`Songs returned: ${JSON.stringify(songItems)}`)

        songs.push(...songItems)
      }
    }
    console.log(`Got ${songs.length} songs`)

    return filterSongsByName(songs);
  }

  async getSong(songName: string, artist: string): Promise<Song> {
    console.log(`Trying to get song for artist.\nSong: ${songName}\nArtist: ${artist}`);

    const requestOptions = await this.makeParams({
      q: songName,
      type: 'track',
      market: 'US',
    })
    if (!requestOptions) {
      return {
        name: 'Not found',
        id: 'Not found',
      };
    }

    const results = await this.http
      .get<SongSearch>(this.spotifySearchUrl, requestOptions)
      .toPromise();
    for (let i = 0; i < results.tracks.items.length; i++) {
      let considering = results.tracks.items[i];
      console.log(`Result details: name=${considering.name}; id=${considering.id}; artists=${considering.artists.map((artist) => artist.name)};`)
      for (let j = 0; j < considering.artists.length; j++) {
        if (considering.artists[j].name == artist) {
          console.log(`Found a match for ${considering.name}`)
          return {
            name: considering.name,
            id: considering.id,
          };
        }
      }
    }
    return {
      name: 'Not found',
      id: 'Not found',
    };
  }
}
