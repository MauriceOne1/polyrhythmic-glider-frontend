import type { BlogPost } from '../../shared/models/content.models';

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'visualizzare-poliritmie-in-browser',
    title: 'Visualizzare poliritmie in browser',
    excerpt:
      'Una guida concreta per trasformare divisioni ritmiche, accenti e cicli irregolari in una vista leggibile durante prove e performance.',
    publishedLabel: '20 aprile 2026',
    publishedAt: '2026-04-20',
    readingTime: '9 min',
    category: 'Interfacce',
    tags: ['poliritmie', 'visual design', 'browser'],
    blocks: [
      {
        heading: 'Dal metronomo alla mappa',
        paragraphs: [
          'Una poliritmia diventa leggibile quando smette di essere solo una sequenza di colpi e viene disegnata come relazione tra cicli. La vista non deve spiegare tutto: deve far capire dove cade il prossimo gesto utile.',
          'Il browser e ottimo per questo tipo di prototipo perche combina animazione, input rapido e distribuzione immediata. Una griglia radiale funziona bene per leggere la chiusura dei cicli, mentre una timeline aiuta quando la priorita e seguire l energia del flusso.',
        ],
        snippets: [
          {
            label: 'TypeScript',
            kind: 'code',
            language: 'ts',
            content: `type Pulse = {
  step: number;
  accent: boolean;
};

export function euclideanPattern(pulses: number, steps: number): Pulse[] {
  return Array.from({ length: steps }, (_, step) => ({
    step,
    accent: (step * pulses) % steps < pulses,
  }));
}`,
          },
        ],
      },
      {
        heading: 'Priorita visiva',
        paragraphs: [
          'Ogni layer dovrebbe avere una gerarchia chiara: il ciclo principale resta stabile, gli accenti emergono, le variazioni si muovono senza rubare la scena. Quando tutto lampeggia, nulla suona piu urgente.',
          'Una buona regola pratica e separare il feedback operativo da quello atmosferico. Il primo conferma lo stato del sistema; il secondo costruisce il carattere visivo della performance.',
        ],
        snippets: [
          {
            label: 'LaTeX',
            kind: 'latex',
            language: 'tex',
            content: `C = \\operatorname{lcm}(a,b,c)

phase_i(t)=\\frac{t \\bmod d_i}{d_i}`,
          },
        ],
      },
    ],
  },
  {
    slug: 'documentare-una-jam-elettronica',
    title: 'Documentare una jam elettronica',
    excerpt:
      'Checklist e metodo leggero per raccogliere setup, decisioni, take e materiali senza interrompere la musica.',
    publishedLabel: '18 aprile 2026',
    publishedAt: '2026-04-18',
    readingTime: '8 min',
    category: 'Documentazione',
    tags: ['jam', 'archivio', 'workflow'],
    blocks: [
      {
        heading: 'Scrivere mentre succede',
        paragraphs: [
          'La documentazione migliore nasce vicino al gesto, ma non deve trasformarsi in burocrazia. Bastano tre tracce: cosa e stato collegato, cosa ha funzionato, cosa vale la pena riprovare.',
          'Il formato ideale e quello che riesci a compilare anche dopo tre ore di prove: frasi brevi, nomi coerenti dei file, foto del cablaggio e una nota sul momento in cui la stanza ha iniziato a rispondere.',
        ],
        snippets: [
          {
            label: 'Template',
            kind: 'code',
            language: 'md',
            content: `# Sessione

Data:
Persone:
BPM / clock:
Setup:
Take migliori:
Problemi:
Da riprovare:`,
          },
        ],
      },
      {
        heading: 'Dalla take al diario',
        paragraphs: [
          'Ogni take dovrebbe avere un nome ripetibile. La data aiuta, ma da sola non basta: aggiungi sorgente, ruolo e numero progressivo. Il file diventa piu facile da ritrovare e piu difficile da confondere.',
          'Il diario finale non e una cronaca perfetta. E una mappa per tornare nel punto in cui una decisione ha cambiato il suono.',
        ],
        snippets: [
          {
            label: 'Terminale',
            kind: 'terminal',
            language: 'bash',
            content: `$ mkdir -p archive/2026-04-18-byos
$ mv Zoom0007.wav archive/2026-04-18-byos/take-03-main-room.wav
$ exiftool -Comment="clock 124 bpm, modular lead, field recorder" take-03-main-room.wav`,
          },
        ],
      },
    ],
  },
  {
    slug: 'campionamento-come-archivio-vivente',
    title: 'Campionamento come archivio vivente',
    excerpt:
      'Come trattare sample, field recording e frammenti vocali come materiale vivo, rintracciabile e rispettoso del contesto originale.',
    publishedLabel: '16 aprile 2026',
    publishedAt: '2026-04-16',
    readingTime: '10 min',
    category: 'Suono',
    tags: ['sample', 'field recording', 'archivio'],
    blocks: [
      {
        heading: 'Il sample non e neutro',
        paragraphs: [
          'Un campione porta con se stanza, microfono, intenzione e diritto di essere riconosciuto. Anche quando viene tagliato fino a diventare texture, conserva una relazione con il momento in cui e stato registrato.',
          'Per questo conviene salvare sempre contesto, licenza, luogo e trasformazioni. Non rallenta la creativita: evita di perdere fiducia nel materiale quando il progetto cresce.',
        ],
        snippets: [
          {
            label: 'Metadati',
            kind: 'code',
            language: 'json',
            content: `{
  "source": "field-recording",
  "location": "workshop room",
  "license": "project-internal",
  "transformations": ["trim", "pitch -5", "granular stretch"]
}`,
          },
        ],
      },
      {
        heading: 'Tagliare senza cancellare',
        paragraphs: [
          'La manipolazione piu interessante non cancella il contesto: lo rende ambiguo. Un respiro puo diventare hi-hat, una porta puo diventare kick, ma la traccia di provenienza resta una bussola etica e pratica.',
          'Quando l archivio e vivo, ogni nuovo brano restituisce informazioni ai sample originali: quali frammenti hanno funzionato, quali vanno ripuliti, quali meritano una seconda registrazione.',
        ],
        snippets: [
          {
            label: 'Terminale',
            kind: 'terminal',
            language: 'bash',
            content: `$ sox room-tone.wav breath-hat.wav trim 00:01.240 00:00.180 fade 0.002 0.180 0.025
$ ffmpeg -i breath-hat.wav -af "highpass=f=1800,acompressor" breath-hat-clean.wav`,
          },
        ],
      },
    ],
  },
  {
    slug: 'accessibilita-nei-playground-sonori',
    title: 'Accessibilita nei playground sonori',
    excerpt:
      'Note pratiche per rendere esperimenti musicali nel browser piu leggibili, navigabili e gentili con chi usa input diversi.',
    publishedLabel: '14 aprile 2026',
    publishedAt: '2026-04-14',
    readingTime: '7 min',
    category: 'Accessibilita',
    tags: ['accessibilita', 'ui', 'audio'],
    blocks: [
      {
        heading: 'Controlli prima degli effetti',
        paragraphs: [
          'Un playground sonoro puo essere spettacolare, ma resta fragile se non dichiara cosa sta suonando e come fermarlo. Play, stop, volume e stato corrente devono essere raggiungibili da tastiera e comprensibili senza vista perfetta.',
          'Il feedback visivo non deve dipendere solo dal colore. Forma, testo e posizione aiutano a distinguere registrazione, ascolto, errore e attesa.',
        ],
        snippets: [
          {
            label: 'HTML',
            kind: 'code',
            language: 'html',
            content: `<button type="button" aria-pressed="false" aria-label="Avvia il loop">
  Play
</button>
<p aria-live="polite">Loop fermo</p>`,
          },
        ],
      },
      {
        heading: 'Motion e volume',
        paragraphs: [
          'Animazioni e audio condividono lo stesso rischio: possono diventare troppo presenti. Rispetta la preferenza per movimento ridotto e non avviare mai suoni senza un gesto esplicito.',
          'Un buon default e silenzioso, reversibile e leggibile. Da li, chi ascolta puo decidere quanta intensita aggiungere.',
        ],
        snippets: [
          {
            label: 'CSS',
            kind: 'code',
            language: 'css',
            content: `@media (prefers-reduced-motion: reduce) {
  .pulse-ring {
    animation: none;
  }
}`,
          },
        ],
      },
    ],
  },
  {
    slug: 'telemetria-creativa-e-privacy',
    title: 'Telemetria creativa e privacy',
    excerpt:
      'Come misurare interazioni utili nei prototipi artistici senza trasformare il pubblico in una sorgente dati opaca.',
    publishedLabel: '12 aprile 2026',
    publishedAt: '2026-04-12',
    readingTime: '8 min',
    category: 'Sistemi',
    tags: ['privacy', 'telemetria', 'prototipi'],
    blocks: [
      {
        heading: 'Misurare il sistema, non la persona',
        paragraphs: [
          'Nei progetti interattivi serve capire dove il sistema si rompe: latenza, errori, drop audio, controlli ignorati. Non serve sapere piu del necessario sulle persone che lo stanno usando.',
          'La telemetria creativa dovrebbe essere aggregata, breve e dichiarata. Se un dato non migliora manutenzione o esperienza, probabilmente non merita di essere raccolto.',
        ],
        snippets: [
          {
            label: 'TypeScript',
            kind: 'code',
            language: 'ts',
            content: `type TelemetryEvent = {
  type: 'audio-drop' | 'control-error' | 'session-ready';
  timestamp: number;
  context: 'local' | 'live';
};`,
          },
        ],
      },
      {
        heading: 'Retention minima',
        paragraphs: [
          'Il log utile ha una scadenza. Tenere tutto per sempre produce rumore operativo e responsabilita non necessarie.',
          'Meglio conservare finestre corte e report sintetici: abbastanza per correggere, troppo poco per profilare.',
        ],
        snippets: [
          {
            label: 'Policy',
            kind: 'code',
            language: 'yaml',
            content: `retention:
  raw_events: 7 days
  aggregate_reports: 90 days
  personal_identifiers: never`,
          },
        ],
      },
    ],
  },
  {
    slug: 'netlify-identity-e-aree-private-leggere',
    title: 'Netlify Identity e aree private leggere',
    excerpt:
      'Un approccio pragmatico per proteggere bozze, strumenti interni e pagine riservate senza appesantire il frontend.',
    publishedLabel: '10 aprile 2026',
    publishedAt: '2026-04-10',
    readingTime: '6 min',
    category: 'Frontend',
    tags: ['netlify', 'auth', 'angular'],
    blocks: [
      {
        heading: 'Autenticazione piccola',
        paragraphs: [
          'Non ogni progetto ha bisogno di un impianto auth completo. Per bozze, admin leggeri e pagine di lavoro, una guard semplice puo essere sufficiente se il rischio e chiaro e il contenuto non e altamente sensibile.',
          'La parte importante e rendere esplicito il confine: cosa e pubblico, cosa e protetto, cosa resta comunque da non considerare segreto assoluto.',
        ],
        snippets: [
          {
            label: 'Angular guard',
            kind: 'code',
            language: 'ts',
            content: `export const privateAreaGuard = () => {
  const session = getCurrentSession();
  return session ? true : inject(Router).createUrlTree(['/login']);
};`,
          },
        ],
      },
      {
        heading: 'Esperienza di ritorno',
        paragraphs: [
          'Dopo il login, le persone devono tornare dove stavano andando. Sembra un dettaglio, ma rende l area privata meno ruvida e piu affidabile.',
          'Anche i messaggi di errore contano: non devono esporre informazioni inutili, ma devono dire chiaramente cosa fare dopo.',
        ],
        snippets: [
          {
            label: 'URL',
            kind: 'terminal',
            language: 'bash',
            content: `$ open https://blog.polyglider.com/visualizzare-poliritmie-in-browser`,
          },
        ],
      },
    ],
  },
  {
    slug: 'workflow-audio-video-per-prototipi-web',
    title: 'Workflow audio-video per prototipi web',
    excerpt:
      'Pipeline essenziale per preparare asset audio e video leggeri, coerenti e facili da testare in locale.',
    publishedLabel: '8 aprile 2026',
    publishedAt: '2026-04-08',
    readingTime: '7 min',
    category: 'Workflow',
    tags: ['ffmpeg', 'asset', 'performance'],
    blocks: [
      {
        heading: 'Asset piccoli, intenzioni chiare',
        paragraphs: [
          'Un prototipo web non dovrebbe portarsi dietro file enormi solo per simulare un esperienza. Meglio preparare loop brevi, copertine ottimizzate e varianti pensate per test rapidi.',
          'La qualita non e solo bitrate: e prevedibilita. Se ogni asset ha durata, volume e formato coerenti, il codice resta piu semplice.',
        ],
        snippets: [
          {
            label: 'Terminale',
            kind: 'terminal',
            language: 'bash',
            content: `$ ffmpeg -i source.mov -vf scale=1280:-2 -an preview.webm
$ ffmpeg -i take.wav -af loudnorm -ar 48000 -b:a 192k loop.mp3`,
          },
        ],
      },
      {
        heading: 'Testare come pubblico',
        paragraphs: [
          'La macchina di sviluppo perdona troppo. Prima di pubblicare, prova rete lenta, schermo piccolo, volume basso e tab in background.',
          'Quando un asset e decorativo, deve degradare bene. Quando e parte dell esperienza, deve avere fallback e stato leggibile.',
        ],
        snippets: [
          {
            label: 'Checklist',
            kind: 'code',
            language: 'md',
            content: `- mobile viewport
- slow network
- reduced motion
- muted autoplay blocked
- keyboard controls`,
          },
        ],
      },
    ],
  },
  {
    slug: 'manutenzione-di-un-archivio-sonoro-personale',
    title: 'Manutenzione di un archivio sonoro personale',
    excerpt:
      'Strategie semplici per non perdere take, patch, note e versioni quando gli esperimenti iniziano a moltiplicarsi.',
    publishedLabel: '6 aprile 2026',
    publishedAt: '2026-04-06',
    readingTime: '9 min',
    category: 'Archivio',
    tags: ['backup', 'note', 'organizzazione'],
    blocks: [
      {
        heading: 'Nomi che resistono',
        paragraphs: [
          'Un archivio creativo fallisce quasi sempre sui nomi. File come final-final-v2.wav raccontano ansia, non informazioni.',
          'Una convenzione piccola ma stabile aiuta a ricordare cosa contiene un file senza aprirlo: data, progetto, sorgente, take e stato.',
        ],
        snippets: [
          {
            label: 'Naming',
            kind: 'code',
            language: 'txt',
            content: `2026-04-06_polyglider_modular-bass_take-04_raw.wav
2026-04-06_polyglider_modular-bass_take-04_edit-a.wav`,
          },
        ],
      },
      {
        heading: 'Backup con ritmo',
        paragraphs: [
          'Il backup migliore e quello noioso. Deve partire spesso, produrre log leggibili e non richiedere coraggio.',
          'Per gli archivi sonori conviene separare sorgenti grezze, export e documentazione. Hanno frequenze di modifica diverse e meritano strategie diverse.',
        ],
        snippets: [
          {
            label: 'Terminale',
            kind: 'terminal',
            language: 'bash',
            content: `$ rsync -av --delete ./archive/ /Volumes/backup/polyglider-archive/
$ shasum -a 256 archive/**/*.wav > checksums.txt`,
          },
        ],
      },
    ],
  },
  {
    slug: 'interfacce-performative-senza-attrito',
    title: 'Interfacce performative senza attrito',
    excerpt:
      'Principi per disegnare controlli live che si capiscono in fretta, non saltano sotto pressione e lasciano spazio al gesto.',
    publishedLabel: '4 aprile 2026',
    publishedAt: '2026-04-04',
    readingTime: '8 min',
    category: 'Interfacce',
    tags: ['performance', 'ux', 'controlli'],
    blocks: [
      {
        heading: 'Stabilita sotto le dita',
        paragraphs: [
          'Durante una performance non c e tempo per interpretare componenti ambigui. I controlli devono avere dimensioni stabili, feedback immediato e stati impossibili da confondere.',
          'Un buon controllo live comunica due cose: cosa succede se lo tocchi e cosa sta gia facendo il sistema.',
        ],
        snippets: [
          {
            label: 'CSS',
            kind: 'code',
            language: 'css',
            content: `.pad {
  aspect-ratio: 1;
  min-width: 3rem;
  border-radius: 8px;
}`,
          },
        ],
      },
      {
        heading: 'Pochi stati, molto chiari',
        paragraphs: [
          'Ogni stato aggiunto aumenta la memoria richiesta a chi suona. Meglio pochi stati solidi che una tavolozza enorme di micro-modalita.',
          'Quando serve complessita, deve emergere progressivamente: il gesto primario resta sempre disponibile, le opzioni avanzate vivono un livello piu in basso.',
        ],
        snippets: [
          {
            label: 'State map',
            kind: 'code',
            language: 'ts',
            content: `type PadState = 'idle' | 'armed' | 'playing' | 'muted';`,
          },
        ],
      },
    ],
  },
  {
    slug: 'pattern-euclidei-per-loop-irregolari',
    title: 'Pattern euclidei per loop irregolari',
    excerpt:
      'Come usare distribuzioni euclidee per generare groove asimmetrici che restano memorizzabili.',
    publishedLabel: '2 aprile 2026',
    publishedAt: '2026-04-02',
    readingTime: '6 min',
    category: 'Composizione',
    tags: ['euclidean', 'ritmo', 'generativo'],
    blocks: [
      {
        heading: 'Distribuire gli accenti',
        paragraphs: [
          'Un pattern euclideo cerca di distribuire un numero di impulsi nel modo piu uniforme possibile dentro un ciclo. Il risultato e spesso familiare e strano allo stesso tempo.',
          'Il trucco compositivo e non fermarsi alla generazione. Sposta l inizio, cambia accento, lascia che un secondo ciclo lo contraddica.',
        ],
        snippets: [
          {
            label: 'Formula',
            kind: 'latex',
            language: 'tex',
            content: `hit(n)=\\left\\lfloor\\frac{(n+1)k}{m}\\right\\rfloor-\\left\\lfloor\\frac{nk}{m}\\right\\rfloor`,
          },
        ],
      },
      {
        heading: 'Asimmetria controllata',
        paragraphs: [
          'Il loop irregolare funziona quando riesci comunque a prevedere un ritorno. Troppa simmetria diventa piatta, troppa variazione cancella il corpo del ritmo.',
          'In pratica, conviene fissare un ciclo guida e lasciare che gli altri entrino in attrito per periodi brevi.',
        ],
        snippets: [
          {
            label: 'TypeScript',
            kind: 'code',
            language: 'ts',
            content: `const kick = euclideanPattern(4, 16);
const rim = euclideanPattern(5, 13);
const hat = euclideanPattern(7, 16);`,
          },
        ],
      },
    ],
  },
  {
    slug: 'microcopy-per-strumenti-creativi',
    title: 'Microcopy per strumenti creativi',
    excerpt:
      'Parole brevi, precise e non decorative per rendere tool musicali e pagine sperimentali piu facili da abitare.',
    publishedLabel: '30 marzo 2026',
    publishedAt: '2026-03-30',
    readingTime: '5 min',
    category: 'Scrittura',
    tags: ['microcopy', 'ux writing', 'tool'],
    blocks: [
      {
        heading: 'Dire cosa serve',
        paragraphs: [
          'La microcopy di uno strumento creativo non deve vendere lo strumento. Deve aiutare una persona a prendere la prossima decisione senza interrompere il flusso.',
          'Etichette come genera, salva, ripeti e cancella sono spesso piu forti di frasi brillanti. La personalita puo stare nel ritmo generale, non in ogni bottone.',
        ],
        snippets: [
          {
            label: 'Copy set',
            kind: 'code',
            language: 'txt',
            content: `Start loop
Stop
Save take
Clear pattern
Use last seed`,
          },
        ],
      },
      {
        heading: 'Errore come orientamento',
        paragraphs: [
          'Un errore buono non colpevolizza. Dice cosa e successo, cosa e rimasto salvo e qual e il prossimo gesto possibile.',
          'Nei tool audio questo e ancora piu importante: permessi microfono, autoplay e device non disponibili sono normali, non eccezioni drammatiche.',
        ],
        snippets: [
          {
            label: 'Messaggio',
            kind: 'code',
            language: 'txt',
            content: `Microfono non disponibile.
Puoi continuare con un sample locale o riprovare dai permessi del browser.`,
          },
        ],
      },
    ],
  },
  {
    slug: 'oscillatori-e-rumore-controllato',
    title: 'Oscillatori e rumore controllato',
    excerpt:
      'Note tecniche su fase, drift, inviluppi e piccole deviazioni che tengono vivo un sistema sonoro.',
    publishedLabel: '26 marzo 2026',
    publishedAt: '2026-03-26',
    readingTime: '6 min',
    category: 'DSP',
    tags: ['dsp', 'sintesi', 'rumore'],
    blocks: [
      {
        heading: 'Phase locking instabile',
        paragraphs: [
          'Un oscillatore non resta mai perfettamente fermo: porta con se una micro-variazione di fase, una deriva termica immaginaria e una memoria breve del gesto che lo ha inizializzato.',
          'In un contesto di sintesi, il rumore non e solo disturbo: e una sorgente di probabilita controllata, utile per rendere meno rigida la risposta del sistema.',
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
          'La forma percepita emerge quando una sequenza discreta viene filtrata da un inviluppo abbastanza lento da sembrare intenzionale.',
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
      'Appunti da laboratorio su buffer, bus condivisi, clock e segnali che arrivano sempre un poco dopo.',
    publishedLabel: '22 marzo 2026',
    publishedAt: '2026-03-22',
    readingTime: '7 min',
    category: 'Infrastruttura',
    tags: ['routing', 'clock', 'infrastruttura'],
    blocks: [
      {
        heading: 'Buffer come spazio politico',
        paragraphs: [
          'Ogni buffer e una promessa: trattiene il segnale abbastanza a lungo da renderlo stabile, ma non cosi tanto da sottrarlo al presente.',
          'Nel routing aperto, ogni nodo deve dichiarare cosa riceve, cosa trasforma e cosa restituisce alla rete.',
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
          'La misura non elimina la latenza, ma la rende negoziabile: una quantita osservabile puo essere compensata, documentata, persino usata come materiale compositivo.',
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
      'Note quasi scientifiche su embeddings, memoria corta, prompt e piccoli modelli usati come strumenti di bottega.',
    publishedLabel: '18 marzo 2026',
    publishedAt: '2026-03-18',
    readingTime: '8 min',
    category: 'AI',
    tags: ['ai', 'embedding', 'strumenti'],
    blocks: [
      {
        heading: 'Il modello come utensile',
        paragraphs: [
          'Un modello locale non deve necessariamente sapere tutto: puo essere utile se sa stare vicino a un corpus, indicizzare frammenti e suggerire connessioni senza imporre una forma finale.',
          'La parte interessante non e la risposta, ma il modo in cui il sistema organizza il campo delle domande possibili.',
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
          'Una distanza tra vettori non e una verita: e una scorciatoia operativa per trovare vicinanze, attriti e materiali che meritano una seconda lettura.',
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
