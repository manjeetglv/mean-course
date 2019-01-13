import { Component, OnInit, OnDestroy} from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  // @Input() posts: Post[] = [
    // {title: 'First Post', content: 'This is the first post\'s content'},
    // {title: 'Second Post', content: 'This is the second post\'s content'},
    // {title: 'Third Post', content: 'This is the third post\'s content'},
    // ];

    posts: Post[] = [];
    isLoading = false;
    private postSub: Subscription;
    constructor(private postService: PostService) { }

    onPostDelete(post: Post) {
      this.postService.deletePost(post._id);
    }

    ngOnInit() {
      this.isLoading = true;
      this.postService.getPosts();
      this.postSub = this.postService.getPostUpdatedListner()
      .subscribe( (posts: Post[]) => {
        this.isLoading = false;
        this.posts = posts;
      });
    }

    ngOnDestroy(): void {
      this.postSub.unsubscribe();
    }

}
