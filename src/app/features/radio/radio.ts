import { Component, signal } from '@angular/core';
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

@Component({
  selector: 'app-radio',
  imports: [FontAwesomeModule, RadioBackground, RadioPlayer],
  templateUrl: './radio.html',
  styleUrl: './radio.css',
})
export class Radio {
  readonly audioSource = '/assets/audio/protoclusta.mp3';
  readonly videoSource: string | null = null;
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
    id: 'studio-aperto',
    title: 'Studio aperto',
    host: 'Polyrhythmic Glider',
    time: 'Ora',
    summary: 'Origin Of Chaos EP in rotazione.',
    description:
      'Erotic Cafe su Neosignal Recordings / NËU Music: drum & bass, neurofunk e sound design avanzato.',
    status: 'on-air',
  };

  readonly currentTrack: RadioTrack = {
    id: 'protoclusta',
    title: 'Protoclusta',
    artist: "Erotic Cafe'",
    album: 'Origin Of Chaos EP',
    label: 'Neosignal Recordings / NËU Music',
    duration: '04:53',
    key: 'N/D',
    mood: 'Drum & Bass / Neurofunk',
    bpm: null,
  };

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
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer non luctus mi. Donec vitae arcu sed lorem tempor volutpat.',
      status: 'playlist',
    },
    {
      id: 'patch-notes',
      title: 'Patch notes live',
      host: 'Archivio',
      time: '23:00',
      summary: 'Diario da studio tra prove, frammenti e appunti tecnici.',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent fermentum lacus et libero luctus, sed facilisis mi porta.',
      status: 'registered',
    },
    {
      id: 'night-buffer',
      title: 'Night buffer',
      host: 'Automatico',
      time: '01:00',
      summary: 'Rotazione notturna continua, senza parlato.',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse potenti. Aliquam erat volutpat, sed gravida sem.',
      status: 'playlist',
    },
    {
      id: 'low-frequency-courtyard',
      title: 'Low Frequency Courtyard',
      host: 'Marta N.',
      time: 'Dom 10:00',
      summary: 'Dub, field recording urbano e basse frequenze.',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam luctus nibh a magna gravida, vitae rutrum neque pulvinar.',
      status: 'registered',
    },
    {
      id: 'microtonal-breakfast',
      title: 'Microtonal Breakfast',
      host: 'Sara Min',
      time: 'Dom 12:00',
      summary: 'Scale storte, folk sintetico e pattern leggeri.',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Vivamus non augue eget justo tempor finibus.',
      status: 'playlist',
    },
    {
      id: 'warehouse-lullabies',
      title: 'Warehouse Lullabies',
      host: 'Nico Tape',
      time: 'Dom 16:30',
      summary: 'Ambient industriale, nastri e droni morbidi.',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur vel ipsum in risus viverra hendrerit non vitae orci.',
      status: 'registered',
    },
    {
      id: 'club-notes',
      title: 'Club Notes',
      host: 'Polyrhythmic Glider',
      time: 'Dom 20:00',
      summary: 'House ruvida, electro e percussioni elastiche.',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi elementum nibh sed neque congue, sit amet porttitor dui posuere.',
      status: 'on-air',
    },
    {
      id: 'jazz-machines',
      title: 'Jazz Machines',
      host: 'Archivio',
      time: 'Lun 18:00',
      summary: 'Fusion, drum machine e improvvisazioni modulari.',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eu lectus sit amet metus facilisis rhoncus at sit amet urna.',
      status: 'playlist',
    },
  ];

  readonly mode = signal<RadioMode>('audio');
  readonly selectedProgram = signal<ProgramSlot>(this.currentProgram);
  readonly isRadioPlaying = signal(false);

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
}
