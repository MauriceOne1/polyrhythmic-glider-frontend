import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';
import type { HeroIconName } from '../../models/icon.models';

interface HeroIconPath {
  d: string;
  fillRule?: 'evenodd' | 'nonzero';
  clipRule?: 'evenodd' | 'nonzero';
}

const HERO_ICON_PATHS: Record<HeroIconName, HeroIconPath[]> = {
  'arrow-up-right': [
    {
      d: 'M17.25 6.75 6.75 17.25',
    },
    {
      d: 'M8.25 6.75h9v9',
    },
  ],
  camera: [
    {
      d: 'M2.25 8.25A2.25 2.25 0 0 1 4.5 6h2.379c.414 0 .81-.112 1.155-.327l1.242-.776A2.25 2.25 0 0 1 10.431 4.5h3.138c.414 0 .81.112 1.155.327l1.242.776c.345.215.741.327 1.155.327H19.5a2.25 2.25 0 0 1 2.25 2.25v7.5A2.25 2.25 0 0 1 19.5 18H4.5a2.25 2.25 0 0 1-2.25-2.25v-7.5Z',
    },
    {
      d: 'M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
    },
  ],
  'chevron-down': [
    {
      d: 'm19.5 8.25-7.5 7.5-7.5-7.5',
    },
  ],
  'command-line': [
    {
      d: 'M3.75 6A2.25 2.25 0 0 1 6 3.75h12A2.25 2.25 0 0 1 20.25 6v12A2.25 2.25 0 0 1 18 20.25H6A2.25 2.25 0 0 1 3.75 18V6Z',
    },
    {
      d: 'm7.5 9 3 3-3 3',
    },
    {
      d: 'M13.5 15h3',
    },
  ],
  envelope: [
    {
      d: 'M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75',
    },
    {
      d: 'M21.75 6.75A2.25 2.25 0 0 0 19.5 4.5h-15A2.25 2.25 0 0 0 2.25 6.75',
    },
    {
      d: 'm2.63.243 8.489 5.225a1.5 1.5 0 0 0 1.562 0l8.489-5.225',
    },
  ],
  'play-circle': [
    {
      d: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
    },
    {
      d: 'm10.5 8.25 5.25 3.75-5.25 3.75v-7.5Z',
    },
  ],
  'view-columns': [
    {
      d: 'M3.75 5.25A1.5 1.5 0 0 1 5.25 3.75h13.5a1.5 1.5 0 0 1 1.5 1.5v13.5a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V5.25Z',
    },
    {
      d: 'M9 3.75v16.5',
    },
  ],
};

@Component({
  selector: 'app-hero-icon',
  template: `
    <svg
      [attr.viewBox]="viewBox"
      fill="none"
      stroke="currentColor"
      [attr.stroke-width]="strokeWidth()"
      stroke-linecap="round"
      stroke-linejoin="round"
      [attr.aria-hidden]="title() ? null : 'true'"
      [attr.role]="title() ? 'img' : null"
    >
      @if (title()) {
        <title>{{ title() }}</title>
      }

      @for (path of paths(); track path.d) {
        <path
          [attr.d]="path.d"
          [attr.fill-rule]="path.fillRule ?? null"
          [attr.clip-rule]="path.clipRule ?? null"
        ></path>
      }
    </svg>
  `,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 0;
      color: currentColor;
    }

    svg {
      display: block;
      width: 1em;
      height: 1em;
      flex: 0 0 auto;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroIcon {
  readonly name = input.required<HeroIconName>();
  readonly strokeWidth = input(1.8);
  readonly title = input<string | null>(null);

  protected readonly paths = computed(() => HERO_ICON_PATHS[this.name()]);
  protected readonly viewBox = '0 0 24 24';
}
