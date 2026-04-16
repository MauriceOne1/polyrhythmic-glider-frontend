import { Component, signal } from '@angular/core';

type RadioMode = 'audio' | 'video';

interface RadioTrack {
  readonly id: string;
  readonly title: string;
  readonly artist: string;
  readonly duration: string;
  readonly mood: string;
  readonly bpm: number;
}

interface ProgramSlot {
  readonly id: string;
  readonly title: string;
  readonly host: string;
  readonly time: string;
  readonly description: string;
  readonly status: 'on-air' | 'playlist' | 'registered';
}

@Component({
  selector: 'app-radio',
  imports: [],
  templateUrl: './radio.html',
  styleUrl: './radio.css',
})
export class Radio {
  readonly audioSource = '/assets/audio/protoclusta.mp3';
  readonly videoSource: string | null = null;

  readonly currentProgram: ProgramSlot = {
    id: 'studio-aperto',
    title: 'Studio aperto',
    host: 'Polyrhythmic Glider',
    time: 'Ora',
    description: 'Flusso unico con musica, appunti sonori e interventi brevi.',
    status: 'on-air',
  };

  readonly currentTrack: RadioTrack = {
    id: 'protoclusta',
    title: 'Protoclusta',
    artist: 'Polyrhythmic Glider',
    duration: '04:42',
    mood: 'Generative pulse',
    bpm: 128,
  };

  readonly playedTracks: readonly RadioTrack[] = [
    {
      id: 'lattice-delay',
      title: 'Lattice Delay',
      artist: 'Archivio mock',
      duration: '06:10',
      mood: 'Dub system sketch',
      bpm: 112,
    },
    {
      id: 'phase-room',
      title: 'Phase Room',
      artist: 'Archivio mock',
      duration: '05:26',
      mood: 'Minimal drift',
      bpm: 96,
    },
    {
      id: 'grid-ritual',
      title: 'Grid Ritual',
      artist: 'Archivio mock',
      duration: '07:34',
      mood: 'Late night pattern',
      bpm: 140,
    },
  ];

  readonly upcomingPrograms: readonly ProgramSlot[] = [
    {
      id: 'listening-room',
      title: 'Listening room',
      host: 'Ospite da confermare',
      time: '21:30',
      description: 'Blocchi di ascolto, commenti asciutti e transizioni lente.',
      status: 'playlist',
    },
    {
      id: 'patch-notes',
      title: 'Patch notes live',
      host: 'Archivio',
      time: '23:00',
      description: 'Aggiornamenti da studio, prove tecniche e frammenti registrati.',
      status: 'registered',
    },
    {
      id: 'night-buffer',
      title: 'Night buffer',
      host: 'Automatico',
      time: '01:00',
      description: 'Rotazione notturna senza interruzioni.',
      status: 'playlist',
    },
    {
      id: 'low-frequency-courtyard',
      title: 'Low Frequency Courtyard',
      host: 'Marta N.',
      time: 'Dom 10:00',
      description: 'Dub, field recording urbano e bassi larghi.',
      status: 'registered',
    },
    {
      id: 'microtonal-breakfast',
      title: 'Microtonal Breakfast',
      host: 'Sara Min',
      time: 'Dom 12:00',
      description: 'Scale storte, folk sintetico e pattern leggeri.',
      status: 'playlist',
    },
    {
      id: 'warehouse-lullabies',
      title: 'Warehouse Lullabies',
      host: 'Nico Tape',
      time: 'Dom 16:30',
      description: 'Ambient industriale, nastri e droni morbidi.',
      status: 'registered',
    },
    {
      id: 'club-notes',
      title: 'Club Notes',
      host: 'Polyrhythmic Glider',
      time: 'Dom 20:00',
      description: 'House ruvida, electro e percussioni elastiche.',
      status: 'on-air',
    },
    {
      id: 'jazz-machines',
      title: 'Jazz Machines',
      host: 'Archivio',
      time: 'Lun 18:00',
      description: 'Fusion, drum machine e improvvisazioni modulari.',
      status: 'playlist',
    },
    {
      id: 'no-input-hour',
      title: 'No Input Hour',
      host: 'Elena Feedback',
      time: 'Mar 22:00',
      description: 'Mixer, rumore controllato e segnali instabili.',
      status: 'registered',
    },
  ];

  readonly mode = signal<RadioMode>('audio');

  setMode(mode: RadioMode): void {
    this.mode.set(mode);
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
}
