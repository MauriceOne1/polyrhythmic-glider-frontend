import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'latexPreview',
})
export class LatexPreviewPipe implements PipeTransform {
  private readonly sanitizer = inject(DomSanitizer);

  transform(value: string): SafeHtml {
    const html = value
      .split(/\n+/)
      .map((line) => this.renderLine(line.trim()))
      .filter(Boolean)
      .map((line) => `<div class="latex-line">${line}</div>`)
      .join('');

    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  private renderLine(value: string): string {
    if (!value) {
      return '';
    }

    let rendered = this.escapeHtml(value);

    rendered = rendered
      .replace(/\\operatorname\{([^}]+)\}/g, '<span class="latex-operator">$1</span>')
      .replace(/\\mathcal\{N\}/g, '<span class="latex-symbol">𝒩</span>')
      .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '<span class="latex-frac"><span>$1</span><span>$2</span></span>')
      .replace(/\\arg\\max/g, '<span class="latex-operator">arg max</span>')
      .replace(/\\sin/g, '<span class="latex-operator">sin</span>')
      .replace(/\\max/g, '<span class="latex-operator">max</span>')
      .replace(/\\min/g, '<span class="latex-operator">min</span>')
      .replace(/\\epsilon/g, 'ε')
      .replace(/\\varepsilon/g, 'ε')
      .replace(/\\phi/g, 'φ')
      .replace(/\\pi/g, 'π')
      .replace(/\\sigma/g, 'σ')
      .replace(/\\Delta/g, 'Δ')
      .replace(/\\cdot/g, '·')
      .replace(/\\sim/g, '∼')
      .replace(/\\in/g, '∈')
      .replace(/\\\|/g, '‖');

    rendered = rendered
      .replace(/\^\{([^}]+)\}/g, '<sup>$1</sup>')
      .replace(/_\{([^}]+)\}/g, '<sub>$1</sub>')
      .replace(/\^([A-Za-z0-9])/g, '<sup>$1</sup>')
      .replace(/_([A-Za-z0-9])/g, '<sub>$1</sub>');

    return rendered;
  }

  private escapeHtml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
