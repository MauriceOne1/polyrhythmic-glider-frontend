import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  signal,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faPause,
  faPlay,
  faVolumeHigh,
  faVolumeXmark,
} from '@fortawesome/free-solid-svg-icons';
import type { RadioMode } from '../../radio.models';

@Component({
  selector: 'app-radio-player',
  imports: [FontAwesomeModule],
  templateUrl: './radio-player.html',
  styleUrl: './radio-player.css',
})
export class RadioPlayer implements OnChanges {
  @Input({ required: true }) audioSource!: string;
  @Input() videoSource: string | null = null;
  @Input({ required: true }) mode!: RadioMode;

  @Output() readonly playbackChange = new EventEmitter<boolean>();

  @ViewChild('audioElement') private readonly audioElement?: ElementRef<HTMLAudioElement>;
  @ViewChild('videoElement') private readonly videoElement?: ElementRef<HTMLVideoElement>;

  readonly isPlaying = signal(false);
  readonly progress = signal(0);
  readonly volume = signal(0.84);
  readonly elapsedLabel = signal('0:00');
  readonly durationLabel = signal('LIVE');
  readonly pauseIcon = faPause;
  readonly playIcon = faPlay;
  readonly volumeHighIcon = faVolumeHigh;
  readonly volumeMutedIcon = faVolumeXmark;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mode'] || changes['audioSource'] || changes['videoSource']) {
      this.pauseAll();
      this.progress.set(0);
      this.elapsedLabel.set('0:00');
      this.durationLabel.set(this.mode === 'video' ? 'VIDEO' : 'LIVE');
      this.syncVolume();
    }
  }

  togglePlayback(): void {
    const media = this.activeMedia();

    if (!media) {
      return;
    }

    if (media.paused) {
      media.play().catch(() => this.isPlaying.set(false));
      return;
    }

    media.pause();
  }

  updateMediaState(event: Event): void {
    const media = event.target as HTMLMediaElement;
    const isPlaying = !media.paused;
    this.isPlaying.set(isPlaying);
    this.playbackChange.emit(isPlaying);
    this.updateProgress(event);
  }

  updateProgress(event: Event): void {
    const media = event.target as HTMLMediaElement;

    if (!Number.isFinite(media.duration) || media.duration <= 0) {
      this.progress.set(0);
      this.elapsedLabel.set(this.formatTime(media.currentTime));
      this.durationLabel.set(this.mode === 'video' ? 'VIDEO' : 'LIVE');
      return;
    }

    this.progress.set((media.currentTime / media.duration) * 100);
    this.elapsedLabel.set(this.formatTime(media.currentTime));
    this.durationLabel.set(this.formatTime(media.duration));
  }

  seek(event: Event): void {
    const media = this.activeMedia();
    const value = Number((event.target as HTMLInputElement).value);

    if (!media || !Number.isFinite(media.duration) || media.duration <= 0) {
      this.progress.set(value);
      return;
    }

    media.currentTime = (value / 100) * media.duration;
    this.progress.set(value);
  }

  changeVolume(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    this.volume.set(value);
    this.syncVolume();
  }

  private activeMedia(): HTMLMediaElement | null {
    if (this.mode === 'video') {
      return this.videoElement?.nativeElement ?? null;
    }

    return this.audioElement?.nativeElement ?? null;
  }

  private pauseAll(): void {
    this.audioElement?.nativeElement.pause();
    this.videoElement?.nativeElement.pause();
    this.isPlaying.set(false);
    this.playbackChange.emit(false);
  }

  private syncVolume(): void {
    const volume = this.volume();

    if (this.audioElement?.nativeElement) {
      this.audioElement.nativeElement.volume = volume;
    }

    if (this.videoElement?.nativeElement) {
      this.videoElement.nativeElement.volume = volume;
    }
  }

  private formatTime(value: number): string {
    if (!Number.isFinite(value) || value <= 0) {
      return '0:00';
    }

    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }
}
