import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { BlogPost } from '../../shared/models/content.models';
import { BLOG_POSTS } from '../../shared/utils/blog-content';

type BlogSort = 'newest' | 'oldest' | 'readingTime' | 'title';

@Component({
  selector: 'app-blog',
  imports: [RouterLink],
  templateUrl: './blog.html',
  styleUrl: './blog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Blog {
  readonly posts = BLOG_POSTS;
  readonly query = signal('');
  readonly selectedTag = signal('Tutti');
  readonly selectedSort = signal<BlogSort>('newest');

  readonly featuredPost = computed(() =>
    [...this.posts].sort((first, second) =>
      second.publishedAt.localeCompare(first.publishedAt)
    )[0]
  );
  readonly tags = [
    'Tutti',
    ...Array.from(new Set(this.posts.flatMap((post) => post.tags))).sort((a, b) =>
      a.localeCompare(b)
    ),
  ];
  readonly totalReadingMinutes = this.posts.reduce(
    (total, post) => total + this.readingMinutes(post),
    0
  );

  readonly visiblePosts = computed(() => {
    const query = this.normalize(this.query());
    const tag = this.selectedTag();
    const filtered = this.posts.filter((post) => {
      const matchesTag = tag === 'Tutti' || post.tags.includes(tag);
      const searchableContent = this.normalize(
        [
          post.title,
          post.excerpt,
          post.category,
          post.publishedLabel,
          post.tags.join(' '),
        ].join(' ')
      );

      return matchesTag && (!query || searchableContent.includes(query));
    });

    return this.sortedPosts(filtered);
  });

  readonly resultLabel = computed(() => {
    const count = this.visiblePosts().length;
    return count === 1 ? '1 articolo' : `${count} articoli`;
  });

  updateQuery(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.query.set(input.value);
  }

  updateSort(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const value = select.value;

    if (this.isBlogSort(value)) {
      this.selectedSort.set(value);
    }
  }

  selectTag(tag: string): void {
    this.selectedTag.set(tag);
  }

  clearFilters(): void {
    this.query.set('');
    this.selectedTag.set('Tutti');
    this.selectedSort.set('newest');
  }

  private sortedPosts(posts: BlogPost[]): BlogPost[] {
    return [...posts].sort((first, second) => {
      switch (this.selectedSort()) {
        case 'oldest':
          return first.publishedAt.localeCompare(second.publishedAt);
        case 'readingTime':
          return this.readingMinutes(first) - this.readingMinutes(second);
        case 'title':
          return first.title.localeCompare(second.title);
        case 'newest':
        default:
          return second.publishedAt.localeCompare(first.publishedAt);
      }
    });
  }

  private normalize(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  private readingMinutes(post: BlogPost): number {
    return Number.parseInt(post.readingTime, 10) || 0;
  }

  private isBlogSort(value: string): value is BlogSort {
    return ['newest', 'oldest', 'readingTime', 'title'].includes(value);
  }
}
