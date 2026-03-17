import { Directive, ElementRef, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[typewriter]'
})
export class TypewriterDirective implements AfterViewInit {

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {

    const element = this.el.nativeElement as HTMLElement;
    const text = element.innerText;

    element.innerText = '';
    element.classList.add('typing-active');

    let i = 0;
    const type = () => {
      if (i < text.length) {
        element.innerText += text.charAt(i);
        i++;
        setTimeout(type, 18);
      } else {
        setTimeout(() => {
          element.classList.remove('typing-active');
        }, 2000);
      }
    };
    type();
  }
}