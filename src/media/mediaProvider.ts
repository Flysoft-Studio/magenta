export interface MediaProviderInfo {
    id: string;
    sourceInfo: object;
}

export interface MediaAlbum {
    title: string;
    art: string;
    provider: MediaProviderInfo;
}

export interface MediaArtist {
    name: string;
    provider: MediaProviderInfo;
}

export interface MediaItem {
    provider: MediaProviderInfo;
    title: string;
    album: MediaAlbum;
    duration?: number;
    artists: MediaArtist[];
}
