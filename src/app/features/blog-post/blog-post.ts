import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { LatexPreviewPipe } from '../../shared/pipes/latex-preview.pipe';
import { findBlogPostBySlug } from '../../shared/utils/blog-content';

@Component({
  selector: 'app-blog-post',
  imports: [RouterLink, LatexPreviewPipe],
  templateUrl: './blog-post.html',
  styleUrl: './blog-post.css',
})
export class BlogPost {
  private readonly route = inject(ActivatedRoute);
  private readonly slug = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('slug'))),
    { initialValue: this.route.snapshot.paramMap.get('slug') }
  );

  readonly post = computed(() => findBlogPostBySlug(this.slug()));
}
