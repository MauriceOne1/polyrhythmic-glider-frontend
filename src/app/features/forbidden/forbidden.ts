import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ErrorState } from '../../shared/components/error-state/error-state';

const FORBIDDEN_MESSAGES = [
  'Questa area esiste, ma il tuo account non ha i permessi necessari per aprirla.',
  'Sei arrivato nel posto giusto con le credenziali sbagliate: qui serve un accesso diverso.',
  'La rotta è valida, ma al momento questa porta resta chiusa per il tuo profilo.',
];

@Component({
  selector: 'app-forbidden',
  imports: [ErrorState],
  templateUrl: './forbidden.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Forbidden {
  readonly messages = FORBIDDEN_MESSAGES;
}
