import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  effect,
  input,
  output,
  signal,
  untracked,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPause, faPlay, faVolumeHigh, faVolumeXmark } from '@fortawesome/free-solid-svg-icons';
import type { RadioMode } from '../../radio.models';

@Component({
  selector: 'app-radio-player',
  imports: [FontAwesomeModule],
  templateUrl: './radio-player.html',
  styleUrl: './radio-player.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioPlayer implements AfterViewInit, OnDestroy {
  readonly audioSource = input.required<string>();
  readonly videoSource = input<string | null>(null);
  readonly externalVideoElement = input<HTMLVideoElement | null>(null);
  readonly mode = input.required<RadioMode>();

  readonly playbackChange = output<boolean>();

  @ViewChild('audioElement') private readonly audioElement?: ElementRef<HTMLAudioElement>;
  private videoElement: HTMLVideoElement | null = null;
  private audioContext: AudioContext | null = null;
  private audioGain: GainNode | null = null;
  private audioSourceNode: MediaElementAudioSourceNode | null = null;

  readonly isPlaying = signal(false);
  readonly progress = signal(0);
  readonly volume = signal(0.84);
  readonly elapsedLabel = signal('0:00');
  readonly durationLabel = signal('LIVE');
  readonly pauseIcon = faPause;
  readonly playIcon = faPlay;
  readonly volumeHighIcon = faVolumeHigh;
  readonly volumeMutedIcon = faVolumeXmark;
  private readonly updateVideoState = (event: Event) => this.updateMediaState(event);
  private readonly updateVideoProgress = (event: Event) => this.updateProgress(event);

  constructor() {
    effect(() => {
      const externalVideoElement = this.externalVideoElement();
      const mode = this.mode();
      this.audioSource();
      this.videoSource();

      untracked(() => {
        this.setExternalVideo(externalVideoElement);
        this.pauseAll();
        this.progress.set(0);
        this.elapsedLabel.set('0:00');
        this.durationLabel.set(mode === 'video' ? 'VIDEO' : 'LIVE');
        this.syncVolume();
      });
    });
  }

  ngAfterViewInit(): void {
    this.setupAudioGain();
    this.syncVolume();
  }

  ngOnDestroy(): void {
    this.detachVideoEvents();
    this.audioSourceNode?.disconnect();
    this.audioGain?.disconnect();
    void this.audioContext?.close().catch(() => undefined);
  }

  togglePlayback(): void {
    const media = this.activeMedia();

    if (!media) {
      return;
    }

    if (media.paused) {
      this.resumeAudioContext();
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
      this.durationLabel.set(this.mode() === 'video' ? 'VIDEO' : 'LIVE');
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
    if (this.mode() === 'video') {
      return this.videoElement;
    }

    return this.audioElement?.nativeElement ?? null;
  }

  private pauseAll(): void {
    this.audioElement?.nativeElement.pause();
    this.videoElement?.pause();
    this.isPlaying.set(false);
    this.playbackChange.emit(false);
  }

  private syncVolume(): void {
    this.setupAudioGain();
    const volume = this.volume();

    if (this.audioElement?.nativeElement) {
      this.audioElement.nativeElement.volume = volume;
    }

    if (this.audioGain && this.audioContext?.state !== 'closed') {
      this.audioGain.gain.value = volume;
    }

    if (this.videoElement) {
      this.videoElement.volume = volume;
    }
  }

  private setupAudioGain(): void {
    if (
      this.audioSourceNode ||
      !this.audioElement?.nativeElement ||
      typeof AudioContext === 'undefined'
    ) {
      return;
    }

    try {
      this.audioContext = new AudioContext();
      this.audioSourceNode = this.audioContext.createMediaElementSource(
        this.audioElement.nativeElement,
      );
      this.audioGain = this.audioContext.createGain();
      this.audioSourceNode.connect(this.audioGain).connect(this.audioContext.destination);
    } catch {
      this.audioContext = null;
      this.audioGain = null;
      this.audioSourceNode = null;
    }
  }

  private resumeAudioContext(): void {
    if (this.mode() !== 'audio' || !this.audioContext || this.audioContext.state !== 'suspended') {
      return;
    }

    void this.audioContext.resume();
  }

  private setExternalVideo(videoElement: HTMLVideoElement | null): void {
    if (this.videoElement === videoElement) {
      return;
    }

    this.detachVideoEvents();
    this.videoElement = videoElement;

    if (!this.videoElement) {
      return;
    }

    this.videoElement.addEventListener('play', this.updateVideoState);
    this.videoElement.addEventListener('pause', this.updateVideoState);
    this.videoElement.addEventListener('timeupdate', this.updateVideoProgress);
    this.videoElement.addEventListener('loadedmetadata', this.updateVideoProgress);
  }

  private detachVideoEvents(): void {
    if (!this.videoElement) {
      return;
    }

    this.videoElement.removeEventListener('play', this.updateVideoState);
    this.videoElement.removeEventListener('pause', this.updateVideoState);
    this.videoElement.removeEventListener('timeupdate', this.updateVideoProgress);
    this.videoElement.removeEventListener('loadedmetadata', this.updateVideoProgress);
  }

  private formatTime(value: number): string {
    if (!Number.isFinite(value) || value <= 0) {
      return '0:00';
    }

    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60)
      .toString()
      .padStart(2, '0');
    return `${minutes}:${seconds}`;
  }
}
