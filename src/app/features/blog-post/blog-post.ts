import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { LatexPreviewPipe } from '../../shared/pipes/latex-preview.pipe';
import { BLOG_POSTS, findBlogPostBySlug } from '../../shared/utils/blog-content';

@Component({
  selector: 'app-blog-post',
  imports: [RouterLink, LatexPreviewPipe],
  templateUrl: './blog-post.html',
  styleUrl: './blog-post.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlogPost {
  private readonly route = inject(ActivatedRoute);
  private readonly slug = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('slug'))),
    { initialValue: this.route.snapshot.paramMap.get('slug') }
  );

  readonly post = computed(() => findBlogPostBySlug(this.slug()));
  readonly relatedPosts = computed(() => {
    const article = this.post();

    if (!article) {
      return [];
    }

    return BLOG_POSTS.filter((post) => post.slug !== article.slug)
      .map((post) => ({
        post,
        score: post.tags.filter((tag) => article.tags.includes(tag)).length,
      }))
      .filter(({ score }) => score > 0)
      .sort((first, second) => {
        if (second.score !== first.score) {
          return second.score - first.score;
        }

        return second.post.publishedAt.localeCompare(first.post.publishedAt);
      })
      .slice(0, 3)
      .map(({ post }) => post);
  });
}
