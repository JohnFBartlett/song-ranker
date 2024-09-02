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

interface Artist {
  external_urls: any;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
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
