import { Component, computed, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { Background } from './core/layout/background/background';
import { GameOfLifeBackground } from './core/layout/game-of-life-background/game-of-life-background';
import { Header } from './core/layout/header/header';
import { SeoService } from './core/seo/seo.service';
import type { SeoData } from './shared/models/seo.models';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Background, GameOfLifeBackground],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly seoService = inject(SeoService);
  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(() => this.router.url),
      startWith(this.router.url)
    ),
    { initialValue: this.router.url }
  );

  readonly isGameOfLifeRoute = computed(() =>
    this.currentUrl().startsWith('/game-of-life')
  );

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        startWith(null),
        takeUntilDestroyed()
      )
      .subscribe(() => {
        const activeRoute = this.getLeafRoute(this.activatedRoute);
        const seo = activeRoute.snapshot.data['seo'] as SeoData | undefined;

        this.seoService.updatePage(seo, this.getCanonicalPath());
      });
  }

  private getLeafRoute(route: ActivatedRoute): ActivatedRoute {
    let currentRoute = route;

    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }

    return currentRoute;
  }

  private getCanonicalPath(): string {
    const [path] = this.router.url.split('?');
    return path.split('#')[0] || '/';
  }
}
