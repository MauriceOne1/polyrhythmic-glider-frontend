export interface ArtMetric {
  value: string;
  label: string;
  accent: 'cyan' | 'lime' | 'amber';
}

export interface ArtExhibit {
  eyebrow: string;
  title: string;
  description: string;
  medium: string;
}

export interface ArtProgramEntry {
  slot: string;
  title: string;
  description: string;
  format: string;
}

export interface ArtFormatCard {
  title: string;
  description: string;
  note: string;
}

export const ART_METRICS: ArtMetric[] = [
  { value: '03', label: 'formati curatoriali pronti', accent: 'cyan' },
  { value: '06', label: 'slot mostra e video attivabili', accent: 'lime' },
  { value: '24/7', label: 'accesso continuo da sottodominio', accent: 'amber' },
];

export const ART_EXHIBITS: ArtExhibit[] = [
  {
    eyebrow: 'Serie fotografica',
    title: 'Untitled study I',
    description:
      'Una selezione di immagini, appunti visivi e materiali preparatori presentati come primo nucleo della mostra.',
    medium: 'Still image / print / text',
  },
  {
    eyebrow: 'Moving image',
    title: 'Screening room',
    description:
      'Una sala dedicata a video, estratti e documentazione, con una struttura semplice pensata per accompagnare la visione.',
    medium: 'Video / screening / single channel',
  },
  {
    eyebrow: 'Archivio',
    title: 'Notes and references',
    description:
      'Uno spazio per testo curatoriale, crediti, note di produzione e materiali di contesto consultabili in modo lineare.',
    medium: 'Archive / notes / credits',
  },
];

export const ART_PROGRAM: ArtProgramEntry[] = [
  {
    slot: 'Slot 01',
    title: 'Featured work',
    description:
      'Blocco principale dedicato all opera in evidenza, con immagine o video, testo introduttivo e dettagli essenziali.',
    format: 'Highlighted piece',
  },
  {
    slot: 'Slot 02',
    title: 'Video program',
    description:
      'Sequenza ordinata di lavori video, clip o capitoli con durata, formato e una breve nota di accompagnamento.',
    format: 'Program list',
  },
  {
    slot: 'Slot 03',
    title: 'Project information',
    description:
      'Sezione finale per contatti, informazioni di progetto, materiali stampa o indicazioni utili per visitatori e curatori.',
    format: 'Info / contacts',
  },
];

export const ART_FORMATS: ArtFormatCard[] = [
  {
    title: 'Mostra permanente',
    description:
      'Usa il sottodominio come spazio editoriale stabile, con opere in primo piano e aggiornamenti nel tempo.',
    note: 'Adatto a un archivio artistico consultabile tutto l anno.',
  },
  {
    title: 'Evento temporaneo',
    description:
      'Trasforma la pagina in una presenza dedicata a una release, una presentazione o una mostra con durata definita.',
    note: 'Utile per comunicare un appuntamento preciso con pochi contenuti ben ordinati.',
  },
  {
    title: 'Video room',
    description:
      'Rendi centrale il video con player, programma e note di visione, mantenendo lo stesso linguaggio del sito.',
    note: 'Compatibile con MP4 hostato oppure embed esterni.',
  },
];
