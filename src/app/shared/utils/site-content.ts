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
  'shared-process',
  'living-archive',
  'open-systems',
  'sound-research',
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
    eyebrow: 'Process',
    title: 'Condividiamo il processo',
    description:
      'Rendere visibili configurazioni, passaggi e strumenti significa restituire controllo e trasformare il lavoro in linguaggio condivisibile.',
  },
  {
    eyebrow: 'Documentation',
    title: 'La documentazione e parte dell opera',
    description:
      'Ogni sistema o esperimento deve restare leggibile, tracciabile e riutilizzabile: se non e documentato, non puo davvero evolvere.',
  },
  {
    eyebrow: 'Archive',
    title: 'Un archivio vivo',
    description:
      'Non una raccolta statica di output, ma una rete di materiali, processi e connessioni pronti a essere riattivati e reinterpretati.',
  },
  {
    eyebrow: 'Responsibility',
    title: 'Spazio condiviso, responsabilita comune',
    description:
      'Ogni ambiente esiste attraverso il comportamento di chi lo attraversa: apertura, cura e responsabilita sono parte della struttura.',
  },
];

export const CONTACT_CHANNELS: ContactChannel[] = [
  {
    label: 'Email',
    value: 'info@polyglider.com',
    href: 'mailto:info@polyglider.com',
    description: 'Per collaborazioni, processi condivisi, ricerca e attivazioni dirette.',
  },
  {
    label: 'GitHub',
    value: 'github.com/polyglider',
    href: 'https://github.com/polyglider',
    description: 'Codice, configurazioni e tracce leggibili dell infrastruttura.',
    external: true,
  },
  {
    label: 'Instagram',
    value: '@polyglider',
    href: 'https://instagram.com/polyglider',
    description: 'Frammenti visivi, aggiornamenti e passaggi emersi dal processo.',
    external: true,
  },
  {
    label: 'Sound',
    value: 'SoundCloud / Radio',
    href: 'https://soundcloud.com/polyglider',
    description: 'Ricerca sonora, bozze, archivi temporanei e segnali in transito.',
    external: true,
  },
];
