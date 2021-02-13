import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
  // private credsUrl = '/credentials';
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

  async getToken(): Promise<Token> {
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

    console.log(`These are the params: ${params}`);
    this.cachedToken = await this.http
      .post<Token>(this.spotifyTokenUrl, params, requestOptions)
      .toPromise();

    this.nextCheck = Date.now() + 1000 * (this.cachedToken.expires_in - 5);
    console.log(`Next check is at ${this.nextCheck}`);
    return this.cachedToken;
  }

  async getSong(songName: string, artist: string): Promise<Song> {
    console.log('Trying to get song');
    const token = await this.getToken();

    const requestOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token.access_token}`,
      }),
      params: {
        q: songName,
        type: 'track',
        market: 'US',
      },
    };
    const results = await this.http
      .get<SongSearch>(this.spotifySearchUrl, requestOptions)
      .toPromise();
    for (let i = 0; i < results.tracks.items.length; i++) {
      let considering = results.tracks.items[i];
      for (let j = 0; j < considering.artists.length; j++) {
        if (considering.artists[j].name == artist) {
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
