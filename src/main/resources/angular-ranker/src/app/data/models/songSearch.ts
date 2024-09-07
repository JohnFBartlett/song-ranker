import { HttpContext, HttpHeaders, HttpParams } from "@angular/common/http";

export type ParamType = HttpParams | {
  [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
};

export interface SearchRequest {
    headers?: HttpHeaders | {
        [header: string]: string | string[];
    };
    context?: HttpContext;
    observe?: "body";
    params?: HttpParams | {
        [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
    };
    reportProgress?: boolean;
    responseType?: "json";
    withCredentials?: boolean;
}

interface SongItem {
  external_urls: any;
  genres: string[];
  href: string;
  id: string;
  images?: any;
  name: string;
  popularity?: number;
  type: string;
  uri: string;
  artists: Artist[];
}

export interface Artist {
  external_urls: any;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

export interface Album {
  id: string;
  name: string;
  type: string;
}

export interface SongSearch {
  tracks: {
    href: string;
    items: SongItem[];
    limit: number;
    next?: any;
    offset?: any;
    previous?: any;
    total?: number;
  };
}

export interface ArtistSearch {
  artists: {
    items: Artist[]
  }
}

export interface ArtistAlbumSearch {
  items: Album[]
}

export interface AlbumTracksSearch {
  items: SongItem[]
}

