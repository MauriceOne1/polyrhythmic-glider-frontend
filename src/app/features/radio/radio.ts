import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faClock,
  faCompactDisc,
  faGaugeHigh,
  faKey,
  faListUl,
  faMusic,
  faRadio,
  faSliders,
  faTowerBroadcast,
  faVideo,
} from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { RadioBackground } from './components/radio-background/radio-background';
import { RadioPlayer } from './components/radio-player/radio-player';
import type { ProgramSlot, RadioMode, RadioTrack } from './radio.models';

type JsonRecord = Record<string, unknown>;

@Component({
  selector: 'app-radio',
  imports: [FontAwesomeModule, RadioBackground, RadioPlayer],
  templateUrl: './radio.html',
  styleUrl: './radio.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Radio implements OnInit, OnDestroy {
  readonly audioSource = 'https://srv467120.hstgr.cloud:8000/radio.mp3';
  readonly fallbackArtworkUrl =
    'https://www.linkacademyradio.com/wp-content/uploads/2022/07/LOGO_LINK_Academy_2_black_white.png';
  readonly videoSource: string | null = '/assets/video/rickroll.mp4';
  readonly onAirIcon = faTowerBroadcast;
  readonly playlistIcon = faListUl;
  readonly radioIcon = faRadio;
  readonly registeredIcon = faCompactDisc;
  readonly videoIcon = faVideo;
  readonly clockIcon = faClock;
  readonly dataIcon = faGaugeHigh;
  readonly keyIcon = faKey;
  readonly musicIcon = faMusic;
  readonly modeIcon = faSliders;

  readonly currentProgram: ProgramSlot = {
    id: 'link-academy-radio',
    title: 'Link Academy Radio',
    host: 'Link Academy',
    time: 'Ora',
    summary: 'Flusso live da linkacademyradio.com.',
    description:
      'Diretta audio di Link Academy Radio: selezioni elettroniche, archivio e programmazione live.',
    status: 'on-air',
  };

  readonly currentTrack = signal<RadioTrack>({
    id: 'link-academy-radio-live',
    title: 'Live stream',
    artist: 'Link Academy Radio',
    album: 'Diretta',
    label: 'Link Academy',
    duration: 'LIVE',
    key: 'N/D',
    mood: 'Electronic Music',
    bpm: null,
    artworkUrl: this.fallbackArtworkUrl,
  });

  readonly playedTracks: readonly RadioTrack[] = [
    {
      id: 'hold-on-tight',
      title: 'Hold On Tight',
      artist: "Erotic Cafe'",
      album: 'Origin Of Chaos EP',
      label: 'Neosignal Recordings / NËU Music',
      duration: '04:09',
      key: 'N/D',
      mood: 'Drum & Bass',
      bpm: null,
    },
    {
      id: 'sharp-edges',
      title: 'Sharp Edges',
      artist: "Erotic Cafe' / Syndel",
      album: 'Origin Of Chaos EP',
      label: 'Neosignal Recordings / NËU Music',
      duration: '04:01',
      key: 'N/D',
      mood: 'Drum & Bass / Techno edge',
      bpm: null,
    },
  ];

  readonly upcomingPrograms: readonly ProgramSlot[] = [
    {
      id: 'listening-room',
      title: 'Listening room',
      host: 'Ospite da confermare',
      time: '21:30',
      summary: 'Ascolti lenti, note essenziali e transizioni morbide.',
      description:
        'Sessione di ascolto guidato con selezioni lente, note sintetiche e passaggi pensati per lasciare spazio al dettaglio.',
      status: 'playlist',
    },
    {
      id: 'patch-notes',
      title: 'Patch notes live',
      host: 'Archivio',
      time: '23:00',
      summary: 'Diario da studio tra prove, frammenti e appunti tecnici.',
      description:
        'Appunti sonori da studio: take incompleti, prove di catena, errori utili e piccoli cambi di setup raccontati in diretta.',
      status: 'registered',
    },
    {
      id: 'night-buffer',
      title: 'Night buffer',
      host: 'Automatico',
      time: '01:00',
      summary: 'Rotazione notturna continua, senza parlato.',
      description:
        'Flusso automatico per la notte con brani in sequenza, dinamica bassa e nessun intervento parlato.',
      status: 'playlist',
    },
    {
      id: 'low-frequency-courtyard',
      title: 'Low Frequency Courtyard',
      host: 'Marta N.',
      time: 'Dom 10:00',
      summary: 'Dub, field recording urbano e basse frequenze.',
      description:
        'Dub, field recording urbano e basse frequenze montate come una camminata lenta tra cortili, risonanze e traffico distante.',
      status: 'registered',
    },
    {
      id: 'microtonal-breakfast',
      title: 'Microtonal Breakfast',
      host: 'Sara Min',
      time: 'Dom 12:00',
      summary: 'Scale storte, folk sintetico e pattern leggeri.',
      description:
        'Scale microtonali, strumenti sintetici e pattern leggeri per una fascia diurna piu curiosa che aggressiva.',
      status: 'playlist',
    },
    {
      id: 'warehouse-lullabies',
      title: 'Warehouse Lullabies',
      host: 'Nico Tape',
      time: 'Dom 16:30',
      summary: 'Ambient industriale, nastri e droni morbidi.',
      description:
        'Ambient industriale, nastri consumati e droni morbidi, con texture lente e rumori lasciati respirare.',
      status: 'registered',
    },
    {
      id: 'club-notes',
      title: 'Club Notes',
      host: 'Polyrhythmic Glider',
      time: 'Dom 20:00',
      summary: 'House ruvida, electro e percussioni elastiche.',
      description:
        'House ruvida, electro e percussioni elastiche per chiudere la domenica con un passo piu fisico.',
      status: 'on-air',
    },
    {
      id: 'jazz-machines',
      title: 'Jazz Machines',
      host: 'Archivio',
      time: 'Lun 18:00',
      summary: 'Fusion, drum machine e improvvisazioni modulari.',
      description:
        'Fusion, drum machine e improvvisazioni modulari raccolte in una scaletta breve, nervosa e piena di cambi di direzione.',
      status: 'playlist',
    },
  ];

  readonly mode = signal<RadioMode>('audio');
  readonly selectedProgram = signal<ProgramSlot>(this.currentProgram);
  readonly isRadioPlaying = signal(false);
  readonly isScheduleOpen = signal(false);
  private readonly nowPlayingEndpoint =
    'https://srv467120.hstgr.cloud/api/nowplaying/link_academy_radio';
  private metadataRefreshId: number | null = null;

  ngOnInit(): void {
    void this.refreshNowPlaying();
    this.metadataRefreshId = window.setInterval(() => void this.refreshNowPlaying(), 30000);
  }

  ngOnDestroy(): void {
    if (this.metadataRefreshId === null) {
      return;
    }

    window.clearInterval(this.metadataRefreshId);
  }

  setMode(mode: RadioMode): void {
    if (mode === 'video' && !this.videoSource) {
      return;
    }

    this.mode.set(mode);
  }

  setRadioPlaying(isPlaying: boolean): void {
    this.isRadioPlaying.set(isPlaying);
  }

  selectProgram(program: ProgramSlot): void {
    this.selectedProgram.set(program);
    this.isScheduleOpen.set(false);
  }

  openSchedule(): void {
    this.isScheduleOpen.set(true);
  }

  closeSchedule(): void {
    this.isScheduleOpen.set(false);
  }

  isProgramSelected(program: ProgramSlot): boolean {
    return this.selectedProgram().id === program.id;
  }

  programStatusLabel(status: ProgramSlot['status']): string {
    if (status === 'on-air') {
      return 'ON AIR';
    }

    if (status === 'registered') {
      return 'REGISTERED SET';
    }

    return 'PLAYLIST';
  }

  programStatusIcon(status: ProgramSlot['status']): IconDefinition {
    if (status === 'on-air') {
      return this.onAirIcon;
    }

    if (status === 'registered') {
      return this.registeredIcon;
    }

    return this.playlistIcon;
  }

  private async refreshNowPlaying(): Promise<void> {
    try {
      const response = await fetch(this.nowPlayingEndpoint, {
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        return;
      }

      const track = this.mapNowPlaying(await response.json());

      if (track) {
        this.currentTrack.set(track);
      }
    } catch {
      return;
    }
  }

  private mapNowPlaying(payload: unknown): RadioTrack | null {
    if (!this.isRecord(payload)) {
      return null;
    }

    const nowPlaying = this.readRecord(payload, 'now_playing');
    const song = nowPlaying ? this.readRecord(nowPlaying, 'song') : null;

    if (!song) {
      return null;
    }

    const currentTrack = this.currentTrack();
    const title = this.readString(song, 'title') ?? this.readString(song, 'text') ?? 'Live stream';
    const artist = this.readString(song, 'artist') ?? 'Link Academy Radio';
    const playlist = nowPlaying ? this.readString(nowPlaying, 'playlist') : null;

    return {
      id: this.readString(song, 'id') ?? `${artist}-${title}`,
      title,
      artist,
      album: this.readString(song, 'album') ?? 'Diretta',
      label: playlist ?? 'Link Academy',
      duration: this.formatDuration(this.readNumber(nowPlaying, 'duration')),
      key: currentTrack.key,
      mood: this.readString(song, 'genre') ?? currentTrack.mood,
      bpm: currentTrack.bpm,
      artworkUrl: this.readString(song, 'art') ?? this.fallbackArtworkUrl,
    };
  }

  private formatDuration(seconds: number | null): string {
    if (!seconds || seconds <= 0) {
      return 'LIVE';
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60)
      .toString()
      .padStart(2, '0');

    return `${minutes}:${remainingSeconds}`;
  }

  private readRecord(record: JsonRecord, key: string): JsonRecord | null {
    const value = record[key];
    return this.isRecord(value) ? value : null;
  }

  private readString(record: JsonRecord, key: string): string | null {
    const value = record[key];

    if (typeof value !== 'string') {
      return null;
    }

    const trimmedValue = value.trim();
    return trimmedValue ? trimmedValue : null;
  }

  private readNumber(record: JsonRecord | null, key: string): number | null {
    const value = record?.[key];
    return typeof value === 'number' && Number.isFinite(value) ? value : null;
  }

  private isRecord(value: unknown): value is JsonRecord {
    return typeof value === 'object' && value !== null;
  }
}
