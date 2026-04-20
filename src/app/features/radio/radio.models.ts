export type RadioMode = 'audio' | 'video';

export interface RadioTrack {
  readonly id: string;
  readonly title: string;
  readonly artist: string;
  readonly album: string;
  readonly label: string;
  readonly duration: string;
  readonly key: string;
  readonly mood: string;
  readonly bpm: number | null;
  readonly artworkUrl?: string | null;
}

export interface ProgramSlot {
  readonly id: string;
  readonly title: string;
  readonly host: string;
  readonly time: string;
  readonly summary: string;
  readonly description: string;
  readonly status: 'on-air' | 'playlist' | 'registered';
}
