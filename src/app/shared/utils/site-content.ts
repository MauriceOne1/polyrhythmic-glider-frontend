import type {
  ContactChannel,
  FeatureCard,
  NavItem,
} from '../models/content.models';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', fragment: 'hero' },
  { label: 'About', fragment: 'about' },
  { label: 'Contact', fragment: 'contact' },
];

export const HERO_TAGS = [
  'dj-sets',
  'sound-design',
  'creative-coding',
  'live-visuals',
];

export const HERO_TERMINAL_COMMANDS = [
  'ls -la ./sessions',
  'tmux attach -t live-set',
  'ffmpeg -i modular-jam.wav -af loudnorm master.wav',
  'ffplay -loop 0 teaser-cut.mp4',
  'sox kick.wav snare.wav groove.wav trim 0 00:30',
  'msfconsole',
  'ssh synth-lab@remote-rack',
  'git log --oneline --decorate',
  'ncmpcpp',
];

export const ABOUT_PILLARS: FeatureCard[] = [
  {
    eyebrow: 'DJ',
    title: 'DJ sets',
    description:
      'Sessioni dedicate alla musica elettronica e alla ricerca ritmica, tra selezione musicale e sperimentazione sonora.',
  },
  {
    eyebrow: 'Production',
    title: 'Produzione musicale',
    description:
      'Produzione e registrazione in studio utilizzando strumenti digitali e hardware analogico.',
  },
  {
    eyebrow: 'Analog',
    title: 'Sperimentazioni analogiche',
    description:
      'Esplorazione di drum machine, sintetizzatori e strumenti hardware come parte del processo creativo.',
  },
  {
    eyebrow: 'Tech',
    title: 'Ricerca informatica',
    description:
      'Sviluppo e sperimentazione di strumenti digitali, sistemi generativi e tecnologie applicate alla musica e ai media.',
  },
];

export const CONTACT_CHANNELS: ContactChannel[] = [
  {
    label: 'Email',
    value: 'info@polyglider.com',
    href: 'mailto:info@polyglider.com',
    description: 'Per collaborazioni, progetti e contatti diretti.',
  },
  {
    label: 'GitHub',
    value: 'github.com/polyglider',
    href: 'https://github.com/polyglider',
    description: 'Codice, esperimenti e prototipi in lavorazione.',
    external: true,
  },
  {
    label: 'Instagram',
    value: '@polyglider',
    href: 'https://instagram.com/polyglider',
    description: 'Visual, aggiornamenti e dietro le quinte.',
    external: true,
  },
  {
    label: 'Sound',
    value: 'SoundCloud / Radio',
    href: 'https://soundcloud.com/polyglider',
    description: 'Mix, ricerca sonora e broadcast futuri.',
    external: true,
  },
];
