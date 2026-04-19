import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BLOG_POSTS } from '../../shared/utils/blog-content';

@Component({
  selector: 'app-blog',
  imports: [RouterLink],
  templateUrl: './blog.html',
  styleUrl: './blog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Blog {
  readonly posts = BLOG_POSTS;
}
