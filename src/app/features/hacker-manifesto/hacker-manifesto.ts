import { ChangeDetectionStrategy, Component, OnInit, computed, signal } from '@angular/core';

type ManifestoId = 'it-filosottile' | 'en-phrack';
type ManifestoDocumentStatus = 'idle' | 'loading' | 'loaded' | 'error';

interface ManifestoSource {
  id: ManifestoId;
  label: string;
  title: string;
  byline: string;
  sourceName: string;
  sourceUrl: string;
  rawUrl: string;
  fallbackText?: string;
}

interface ManifestoDocumentState {
  status: ManifestoDocumentStatus;
  text: string;
  errorMessage?: string;
}

type ManifestoDocumentMap = Record<ManifestoId, ManifestoDocumentState>;

const ORIGINAL_MANIFESTO_TEXT = `
                                   ==Phrack Inc.==

                        Volume One, Issue 7, Phile 3 of 10

    =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    The following was written shortly after my arrest...

                           \\/\\The Conscience of a Hacker/\\/

                                          by

                                   +++The Mentor+++

                              Written on January 8, 1986
    =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

            Another one got caught today, it's all over the papers.  "Teenager
    Arrested in Computer Crime Scandal", "Hacker Arrested after Bank Tampering"...
            Damn kids.  They're all alike.

            But did you, in your three-piece psychology and 1950's technobrain,
    ever take a look behind the eyes of the hacker?  Did you ever wonder what
    made him tick, what forces shaped him, what may have molded him?
            I am a hacker, enter my world...
            Mine is a world that begins with school... I'm smarter than most of
    the other kids, this crap they teach us bores me...
            Damn underachiever.  They're all alike.

            I'm in junior high or high school.  I've listened to teachers explain
    for the fifteenth time how to reduce a fraction.  I understand it.  "No, Ms.
    Smith, I didn't show my work.  I did it in my head..."
            Damn kid.  Probably copied it.  They're all alike.

            I made a discovery today.  I found a computer.  Wait a second, this is
    cool.  It does what I want it to.  If it makes a mistake, it's because I
    screwed it up.  Not because it doesn't like me...
                    Or feels threatened by me...
                    Or thinks I'm a smart ass...
                    Or doesn't like teaching and shouldn't be here...
            Damn kid.  All he does is play games.  They're all alike.

            And then it happened... a door opened to a world... rushing through
    the phone line like heroin through an addict's veins, an electronic pulse is
    sent out, a refuge from the day-to-day incompetencies is sought... a board is
    found.
            "This is it... this is where I belong..."
            I know everyone here... even if I've never met them, never talked to
    them, may never hear from them again... I know you all...
            Damn kid.  Tying up the phone line again.  They're all alike...

            You bet your ass we're all alike... we've been spoon-fed baby food at
    school when we hungered for steak... the bits of meat that you did let slip
    through were pre-chewed and tasteless.  We've been dominated by sadists, or
    ignored by the apathetic.  The few that had something to teach found us will-
    ing pupils, but those few are like drops of water in the desert.

            This is our world now... the world of the electron and the switch, the
    beauty of the baud.  We make use of a service already existing without paying
    for what could be dirt-cheap if it wasn't run by profiteering gluttons, and
    you call us criminals.  We explore... and you call us criminals.  We seek
    after knowledge... and you call us criminals.  We exist without skin color,
    without nationality, without religious bias... and you call us criminals.
    You build atomic bombs, you wage wars, you murder, cheat, and lie to us
    and try to make us believe it's for our own good, yet we're the criminals.

            Yes, I am a criminal.  My crime is that of curiosity.  My crime is
    that of judging people by what they say and think, not what they look like.
    My crime is that of outsmarting you, something that you will never forgive me
    for.

            I am a hacker, and this is my manifesto.  You may stop this individual,
    but you can't stop us all... after all, we're all alike.
                                   +++The Mentor+++
    _______________________________________________________________________________
`;

const MANIFESTO_SOURCES: readonly ManifestoSource[] = [
  {
    id: 'it-filosottile',
    label: 'Italiano',
    title: 'La Coscienza di un Hacker',
    byline: 'Traduzione italiana di FiloSottile',
    sourceName: 'GitHub Gist di FiloSottile',
    sourceUrl: 'https://gist.github.com/FiloSottile/3787073',
    rawUrl:
      'https://gist.githubusercontent.com/FiloSottile/3787073/raw/La%20Coscienza%20di%20un%20Hacker',
  },
  {
    id: 'en-phrack',
    label: 'English',
    title: 'The Conscience of a Hacker',
    byline: 'Originale di The Mentor',
    sourceName: 'Phrack Archives',
    sourceUrl: 'https://phrack.org/issues/7/3',
    rawUrl: 'https://archives.phrack.org/issues/7/3.txt',
    fallbackText: ORIGINAL_MANIFESTO_TEXT,
  },
];

const INITIAL_DOCUMENTS: ManifestoDocumentMap = {
  'it-filosottile': {
    status: 'idle',
    text: '',
  },
  'en-phrack': {
    status: 'idle',
    text: '',
  },
};

@Component({
  selector: 'app-hacker-manifesto',
  imports: [],
  templateUrl: './hacker-manifesto.html',
  styleUrl: './hacker-manifesto.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HackerManifesto implements OnInit {
  readonly sources = MANIFESTO_SOURCES;
  readonly selectedId = signal<ManifestoId>('it-filosottile');
  readonly isSourceMenuOpen = signal(false);
  readonly documents = signal<ManifestoDocumentMap>(INITIAL_DOCUMENTS);
  readonly selectedSource = computed(() => this.getSource(this.selectedId()));
  readonly selectedDocument = computed(() => this.documents()[this.selectedId()]);

  ngOnInit(): void {
    void this.loadDocument(this.selectedId());
  }

  toggleSourceMenu(): void {
    this.isSourceMenuOpen.update((isOpen) => !isOpen);
  }

  closeSourceMenu(): void {
    this.isSourceMenuOpen.set(false);
  }

  closeSourceMenuOnFocusOut(event: FocusEvent): void {
    const nextFocusedElement = event.relatedTarget;

    if (
      nextFocusedElement instanceof Node &&
      event.currentTarget instanceof Node &&
      event.currentTarget.contains(nextFocusedElement)
    ) {
      return;
    }

    this.closeSourceMenu();
  }

  selectSource(value: string): void {
    if (!this.isManifestoId(value)) {
      return;
    }

    this.selectedId.set(value);
    this.closeSourceMenu();
    void this.loadDocument(value);
  }

  retry(): void {
    void this.loadDocument(this.selectedId(), true);
  }

  private async loadDocument(id: ManifestoId, forceRefresh = false): Promise<void> {
    const currentDocument = this.documents()[id];

    if (
      !forceRefresh &&
      (currentDocument.status === 'loading' || currentDocument.status === 'loaded')
    ) {
      return;
    }

    const source = this.getSource(id);
    this.updateDocument(id, {
      status: 'loading',
      text: currentDocument.text,
      errorMessage: undefined,
    });

    try {
      const response = await fetch(source.rawUrl, {
        cache: forceRefresh ? 'reload' : 'force-cache',
      });

      if (!response.ok) {
        throw new Error(`Source returned ${response.status}`);
      }

      const text = this.normalizeText(await response.text());

      this.updateDocument(id, {
        status: 'loaded',
        text,
        errorMessage: undefined,
      });
    } catch {
      if (source.fallbackText) {
        this.updateDocument(id, {
          status: 'loaded',
          text: this.normalizeText(source.fallbackText),
          errorMessage: undefined,
        });
        return;
      }

      this.updateDocument(id, {
        status: 'error',
        text: currentDocument.text,
        errorMessage:
          'Non riesco a caricare questa fonte adesso. Puoi aprirla dal link qui sopra e riprovare tra poco.',
      });
    }
  }

  private updateDocument(id: ManifestoId, documentState: ManifestoDocumentState): void {
    this.documents.update((documents) => ({
      ...documents,
      [id]: documentState,
    }));
  }

  private normalizeText(text: string): string {
    return text
      .replace(/\r\n?/g, '\n')
      .replace(/[\u202a-\u202e\u2066-\u2069]/g, '')
      .trim();
  }

  private isManifestoId(value: string): value is ManifestoId {
    return MANIFESTO_SOURCES.some((source) => source.id === value);
  }

  private getSource(id: ManifestoId): ManifestoSource {
    return MANIFESTO_SOURCES.find((source) => source.id === id) ?? MANIFESTO_SOURCES[0];
  }
}
