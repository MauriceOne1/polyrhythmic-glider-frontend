import { Pipe, PipeTransform } from '@angular/core';
import { toReadableLabel } from '../utils/string.utils';

@Pipe({
  name: 'readableKey',
})
export class ReadableKeyPipe implements PipeTransform {
  transform(value: string): string {
    return toReadableLabel(value);
  }
}
