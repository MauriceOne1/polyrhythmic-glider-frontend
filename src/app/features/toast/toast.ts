import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ToastLauncher } from './components/toast-launcher/toast-launcher';

@Component({
  selector: 'app-toast',
  imports: [ToastLauncher],
  templateUrl: './toast.html',
  styleUrl: './toast.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Toast {}
