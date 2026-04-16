import type { BlogPost } from '../models/content.models';

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'oscillatori-e-rumore-controllato',
    title: 'Oscillatori e rumore controllato',
    excerpt:
      'Lorem ipsum tecnico su fase, drift, inviluppi e piccole deviazioni che tengono vivo un sistema sonoro.',
    publishedLabel: 'Preprint 01',
    readingTime: '6 min',
    tags: ['dsp', 'sintesi', 'rumore'],
    blocks: [
      {
        heading: 'Lorem ipsum phase-locked',
        paragraphs: [
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer oscillatore non resta mai perfettamente fermo: porta con sé una micro-variazione di fase, una deriva termica immaginaria e una memoria breve del gesto che lo ha inizializzato.',
          'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. In un contesto di sintesi, il rumore non è solo disturbo: è una sorgente di probabilità controllata, utile per rendere meno rigida la risposta del sistema.',
        ],
        snippets: [
          {
            label: 'TypeScript',
            kind: 'code',
            language: 'ts',
            content: `type OscillatorState = {
  phase: number;
  frequency: number;
  drift: number;
};

export function tick(state: OscillatorState, sampleRate: number): OscillatorState {
  const phaseStep = (state.frequency + state.drift) / sampleRate;

  return {
    ...state,
    phase: (state.phase + phaseStep) % 1,
    drift: state.drift * 0.998 + (Math.random() - 0.5) * 0.00002,
  };
}`,
          },
        ],
      },
      {
        heading: 'Distribuzione come gesto',
        paragraphs: [
          'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. La forma percepita emerge quando una sequenza discreta viene filtrata da un inviluppo abbastanza lento da sembrare intenzionale.',
        ],
        snippets: [
          {
            label: 'LaTeX',
            kind: 'latex',
            language: 'tex',
            content: `f(x)=x^2+\\sin(x)

x(t)=A(t)\\sin(2\\pi f t + \\phi(t)) + \\epsilon(t)

\\epsilon(t) \\sim \\mathcal{N}(0, \\sigma^2)`,
          },
          {
            label: 'Terminale',
            kind: 'terminal',
            language: 'bash',
            content: `$ sox take.wav -n spectrogram -o phase-map.png
$ ffmpeg -i raw-loop.wav -af loudnorm -ar 48000 loop-normalized.wav
$ node scripts/analyze-drift.mjs ./exports/session-01.wav`,
          },
        ],
      },
    ],
  },
  {
    slug: 'latenza-routing-e-sistemi-aperti',
    title: 'Latenza, routing e sistemi aperti',
    excerpt:
      'Lorem ipsum da laboratorio su buffer, bus condivisi, clock e segnali che arrivano sempre un poco dopo.',
    publishedLabel: 'Preprint 02',
    readingTime: '7 min',
    tags: ['routing', 'clock', 'infrastruttura'],
    blocks: [
      {
        heading: 'Buffer come spazio politico',
        paragraphs: [
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore. Ogni buffer è una promessa: trattiene il segnale abbastanza a lungo da renderlo stabile, ma non così tanto da sottrarlo al presente.',
          'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Nel routing aperto, ogni nodo deve dichiarare cosa riceve, cosa trasforma e cosa restituisce alla rete.',
        ],
        snippets: [
          {
            label: 'Configurazione',
            kind: 'code',
            language: 'yaml',
            content: `clock:
  source: internal
  bpm: 126
  jitter_tolerance_ms: 3

routes:
  - input: synth_a
    output: bus_modulation
    latency_compensation_ms: 8
  - input: sampler_b
    output: bus_texture
    latency_compensation_ms: 12`,
          },
        ],
      },
      {
        heading: 'Misurare lo scarto',
        paragraphs: [
          'Excepteur sint occaecat cupidatat non proident. La misura non elimina la latenza, ma la rende negoziabile: una quantità osservabile può essere compensata, documentata, persino usata come materiale compositivo.',
        ],
        snippets: [
          {
            label: 'Terminale',
            kind: 'terminal',
            language: 'bash',
            content: `$ pnpm latency:probe --input bus_modulation --window 2048
mean latency: 8.31ms
peak jitter:  2.74ms
status:       usable`,
          },
          {
            label: 'LaTeX',
            kind: 'latex',
            language: 'tex',
            content: `L_{tot}=L_{adc}+L_{buffer}+L_{process}+L_{dac}

\\Delta L = \\max(L_i)-\\min(L_i)`,
          },
        ],
      },
    ],
  },
  {
    slug: 'appunti-su-modelli-locali',
    title: 'Appunti su modelli locali',
    excerpt:
      'Lorem ipsum quasi scientifico su embeddings, memoria corta, prompt e piccoli modelli usati come strumenti di bottega.',
    publishedLabel: 'Preprint 03',
    readingTime: '8 min',
    tags: ['ai', 'embedding', 'strumenti'],
    blocks: [
      {
        heading: 'Il modello come utensile',
        paragraphs: [
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Un modello locale non deve necessariamente sapere tutto: può essere utile se sa stare vicino a un corpus, indicizzare frammenti e suggerire connessioni senza imporre una forma finale.',
          'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. La parte interessante non è la risposta, ma il modo in cui il sistema organizza il campo delle domande possibili.',
        ],
        snippets: [
          {
            label: 'Python',
            kind: 'code',
            language: 'py',
            content: `from pathlib import Path

def chunk_notes(path: Path, size: int = 900) -> list[str]:
    text = path.read_text(encoding="utf-8")
    return [text[index:index + size] for index in range(0, len(text), size)]

chunks = chunk_notes(Path("archive/session-notes.md"))
print(f"indexed chunks: {len(chunks)}")`,
          },
        ],
      },
      {
        heading: 'Distanza semantica',
        paragraphs: [
          'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit. Una distanza tra vettori non è una verità: è una scorciatoia operativa per trovare vicinanze, attriti e materiali che meritano una seconda lettura.',
        ],
        snippets: [
          {
            label: 'LaTeX',
            kind: 'latex',
            language: 'tex',
            content: `\\operatorname{sim}(a,b)=\\frac{a \\cdot b}{\\|a\\|\\|b\\|}

q^*=\\arg\\max_{d_i \\in D}\\operatorname{sim}(e_q,e_i)`,
          },
          {
            label: 'Terminale',
            kind: 'terminal',
            language: 'bash',
            content: `$ python scripts/index_notes.py archive/**/*.md
$ python scripts/query.py "pattern instabili e clock condiviso"
top_k=5 threshold=0.72`,
          },
        ],
      },
    ],
  },
];

export function findBlogPostBySlug(slug: string | null): BlogPost | undefined {
  if (!slug) {
    return undefined;
  }

  return BLOG_POSTS.find((post) => post.slug === slug);
}
