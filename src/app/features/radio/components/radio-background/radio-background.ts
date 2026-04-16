import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import type { ProgramSlot, RadioMode } from '../../radio.models';

type Particle = {
  x: number;
  y: number;
  baseVx: number;
  baseVy: number;
  vx: number;
  vy: number;
};

@Component({
  selector: 'app-radio-background',
  imports: [],
  templateUrl: './radio-background.html',
  styleUrl: './radio-background.css',
})
export class RadioBackground implements AfterViewInit, OnChanges, OnDestroy {
  @Input({ required: true }) bpm!: number | null;
  @Input({ required: true }) mode!: RadioMode;
  @Input({ required: true }) status!: ProgramSlot['status'];
  @Input({ required: true }) isActive!: boolean;

  @ViewChild('canvas') private readonly canvas?: ElementRef<HTMLCanvasElement>;

  private readonly maxParticleCount = 92;
  private readonly minParticleCount = 34;
  private readonly referenceViewportArea = 1440 * 900;

  private ctx?: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private animationId = 0;
  private startedAt = 0;
  private pulse = 0;
  private targetPulse = 0;
  private modeBoost = 1;
  private resizeHandler = () => {
    this.resizeCanvas();
    this.syncParticleDensity();
  };

  ngAfterViewInit(): void {
    const canvas = this.canvas?.nativeElement;
    const ctx = canvas?.getContext('2d');

    if (!canvas || !ctx) {
      return;
    }

    this.ctx = ctx;
    this.startedAt = performance.now();
    this.syncReactiveState();
    this.resizeCanvas();
    this.syncParticleDensity();
    window.addEventListener('resize', this.resizeHandler);
    this.animate();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['bpm'] || changes['mode'] || changes['status'] || changes['isActive']) {
      this.syncReactiveState();
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeHandler);
    cancelAnimationFrame(this.animationId);
  }

  private syncReactiveState(): void {
    const normalizedBpm = Math.min(180, Math.max(70, this.bpm || 120));
    this.targetPulse = this.isActive ? normalizedBpm / 120 : 0.28;
    this.modeBoost = this.isActive && this.mode === 'video' ? 1.32 : 1;
  }

  private resizeCanvas(): void {
    const canvas = this.canvas?.nativeElement;

    if (!canvas || !this.ctx) {
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(dpr, dpr);
  }

  private createParticles(count: number): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.particles = [];

    for (let i = 0; i < count; i++) {
      const baseVx = (Math.random() - 0.5) * 0.35;
      const baseVy = (Math.random() - 0.5) * 0.35;

      this.particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        baseVx,
        baseVy,
        vx: baseVx,
        vy: baseVy,
      });
    }
  }

  private getTargetParticleCount(): number {
    const areaRatio =
      (window.innerWidth * window.innerHeight) / this.referenceViewportArea;

    return Math.round(
      Math.min(
        this.maxParticleCount,
        Math.max(this.minParticleCount, this.maxParticleCount * areaRatio)
      )
    );
  }

  private syncParticleDensity(): void {
    const targetCount = this.getTargetParticleCount();

    if (this.particles.length !== targetCount) {
      this.createParticles(targetCount);
      return;
    }

    for (const particle of this.particles) {
      particle.x = Math.min(window.innerWidth, Math.max(0, particle.x));
      particle.y = Math.min(window.innerHeight, Math.max(0, particle.y));
    }
  }

  private animate = (): void => {
    const ctx = this.ctx;

    if (!ctx) {
      return;
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const elapsedSeconds = (performance.now() - this.startedAt) / 1000;
    const beatPhase = Math.sin(
      elapsedSeconds * (Math.PI * 2) * ((this.bpm || 120) / 60)
    );
    const beatEnergy = this.isActive ? Math.max(0, beatPhase) : 0;

    this.pulse += (this.targetPulse - this.pulse) * 0.04;

    const statusGlow = this.isActive
      ? this.status === 'on-air'
        ? 1
        : this.status === 'playlist'
          ? 0.76
          : 0.55
      : 0.36;
    const viewportScale = Math.min(1, Math.max(0.72, width / 1200));
    const energy = (0.22 + beatEnergy * 0.66) * this.pulse * this.modeBoost;
    const pointRadius = 0.75 + energy * 1.45;
    const speedBoost = (0.9 + energy * 2.4) * this.modeBoost;
    const lineDistance = (92 + energy * 120) * viewportScale;
    const lineOpacity = (0.13 + energy * 0.34) * statusGlow;
    const washOpacity = 0.035 + energy * 0.05;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = `rgba(247,247,251,${washOpacity})`;
    ctx.fillRect(0, 0, width, height);

    for (const particle of this.particles) {
      particle.vx =
        particle.baseVx * speedBoost +
        Math.sin(elapsedSeconds + particle.y * 0.004) * 0.035 * energy;
      particle.vy =
        particle.baseVy * speedBoost +
        Math.cos(elapsedSeconds + particle.x * 0.004) * 0.035 * energy;

      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x <= 0 || particle.x >= width) particle.baseVx *= -1;
      if (particle.y <= 0 || particle.y >= height) particle.baseVy *= -1;

      ctx.beginPath();
      ctx.arc(particle.x, particle.y, pointRadius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(247,247,251,${0.44 + energy * 0.26})`;
      ctx.fill();
    }

    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const a = this.particles[i];
        const b = this.particles[j];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);

        if (distance < lineDistance) {
          const alpha = Math.max(0, lineOpacity - distance / (lineDistance * 2.3));

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(247,247,251,${alpha})`;
          ctx.lineWidth = 0.8 + energy * 0.9;
          ctx.stroke();
        }
      }
    }

    this.animationId = requestAnimationFrame(this.animate);
  };
}
