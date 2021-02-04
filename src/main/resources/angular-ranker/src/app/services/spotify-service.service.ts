import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import SpotifyWebApi from 'spotify-web-api-js';
import { Credentials } from '../models/credentials';
import { Song } from '../models/song';
import { Token } from '../models/token';
import { SongSearch } from '../models/songSearch';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  spotifyApi: SpotifyWebApi.SpotifyWebApiJs;

  private credsUrl = 'http://localhost:9001/credentials';
  private spotifyTokenUrl = 'https://accounts.spotify.com/api/token';
  private spotifySearchUrl = 'https://api.spotify.com/v1/search/';

  private cachedCredentials: Credentials | undefined;
  private cachedToken: Token | undefined;
  private nextCheck: number = Date.now();

  constructor(private http: HttpClient) {
    this.spotifyApi = new SpotifyWebApi();
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

  async getToken(): Promise<Token> {
    if (Date.now() < this.nextCheck && this.cachedToken) {
      console.log('Using cached token');
      return this.cachedToken;
    } else if (!this.cachedCredentials) {
      console.log("Don't have credentials yet, so I can't get the token");
    }

    const encodedCreds = btoa(
      `${this.cachedCredentials!.clientId}:${
        this.cachedCredentials!.clientSecret
      }`
    );
    const requestOptions = {
      headers: new HttpHeaders({
        Authorization: `Basic ${encodedCreds}`,
      }),
    };
    this.cachedToken = await this.http
      .post<Token>(
        this.spotifyTokenUrl,
        {
          grant_type: 'client_credentials',
        },
        requestOptions
      )
      .toPromise();

    this.nextCheck = Date.now() + 1000 * (this.cachedToken.expires_in - 5);
    console.log(`Next check is at ${this.nextCheck}`);
    return this.cachedToken;
  }

  async getSong(songName: string): Promise<Song> {
    const token = await this.getToken();

    const requestOptions = {
      headers: new HttpHeaders({
        Authorization: token.access_token,
      }),
    };
    const results = await this.http
      .post<SongSearch>(
        this.spotifySearchUrl,
        {
          q: songName,
          type: 'track',
        },
        requestOptions
      )
      .toPromise();
    const pickedSong = results.tracks.items[0];
    return {
      name: pickedSong.name,
      id: pickedSong.id,
    };
  }
}
