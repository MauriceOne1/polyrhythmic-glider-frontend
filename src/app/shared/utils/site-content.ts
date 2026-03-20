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

export const HERO_TERMINAL_COMMAND_GROUPS = [
  [
    'ls -lah ./stems',
    'ffprobe -hide_banner modular-session.wav',
    'ffmpeg -i modular-session.wav -af loudnorm -ar 48000 master.wav',
    'sox take.wav -n spectrogram -o take.png',
    'rg "bpm|swing|patch" session-notes.md',
    'git diff --word-diff patches/',
    'tmux attach -t live-set',
    'ssh synth-lab@remote-rack',
  ],
  [
    'python -m jupyter lab --no-browser',
    'torchrun --nproc_per_node=8 train.py --config configs/long-context.yaml',
    'python -m pytest tests/test_attention.py -k flash',
    'python scripts/eval.py --benchmark mmlu --ckpt checkpoints/latest',
    'tensorboard --logdir runs/research',
    'python scripts/ablate.py --rope-theta 500000 --group rmsnorm',
    'git diff research/optimizer-ablation.md',
    'python scripts/export_metrics.py --run runs/research/latest',
  ],
  [
    'ng build --configuration production --stats-json',
    'ng test --watch=false --code-coverage',
    'npx playwright test --project=chromium',
    'docker compose up api postgres redis',
    'node --watch api/server.mjs',
    'psql "$DATABASE_URL" -c "select version();"',
    'redis-cli --scan --pattern "session:*"',
    'curl -s http://localhost:3000/api/health',
  ],
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
    icon: 'envelope',
  },
  {
    label: 'GitHub',
    value: 'github.com/polyglider',
    href: 'https://github.com/polyglider',
    description: 'Codice, configurazioni e tracce leggibili dell infrastruttura.',
    icon: 'command-line',
    external: true,
  },
  {
    label: 'Instagram',
    value: '@polyglider',
    href: 'https://instagram.com/polyglider',
    description: 'Frammenti visivi, aggiornamenti e passaggi emersi dal processo.',
    icon: 'camera',
    external: true,
  },
  {
    label: 'Sound',
    value: 'SoundCloud / Radio',
    href: 'https://soundcloud.com/polyglider',
    description: 'Ricerca sonora, bozze, archivi temporanei e segnali in transito.',
    icon: 'play-circle',
    external: true,
  },
];
