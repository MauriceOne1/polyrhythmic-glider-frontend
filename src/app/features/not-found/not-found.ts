import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ErrorState } from '../../shared/components/error-state/error-state';

const NOT_FOUND_MESSAGES = [
  "Awwwww... non piangere: è solo un errore 404. La risorsa che stai cercando non si trova qui o non c'è mai stata.",
  'Piccolo glitch di navigazione: questa pagina qui al momento non risulta in archivio.',
  "Abbiamo guardato bene: qui non c'è niente da aprire, solo una traccia che finisce in un tombino.",
  'La pagina che cerchi ha cambiato rotta oppure è sparita con grande eleganza.',
  'Niente panico: il sito è ancora qui, ma questa risorsa no.',
];

@Component({
  selector: 'app-not-found',
  imports: [ErrorState],
  templateUrl: './not-found.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFound {
  readonly messages = NOT_FOUND_MESSAGES;
}
