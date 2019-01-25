import { Component, OnInit, OnDestroy} from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';

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
    totalPosts = 0;
    postsPerPage = 2;
    curentPage = 1;
    pageSizeOptions = [1, 2, 5, 10];
    userIsAuthenticated = false;
    private postSub: Subscription;
    private authListnerSubs: Subscription;
    constructor(private postService: PostService, private authService: AuthService) { }


    ngOnInit() {
      this.isLoading = true;
      this.postService.getPosts(this.postsPerPage, this.curentPage);
      this.postSub = this.postService.getPostUpdatedListner()
      .subscribe( (postData: {posts: Post[], totalPosts: number}) => {
        this.isLoading = false;
        this.posts = postData.posts;
        this.totalPosts = postData.totalPosts;
      });

      this.authListnerSubs = this.authService.getAuthStatusListner().subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
    }

    onChangedPage(pageEvent: PageEvent) {
      this.isLoading = true;
      this.postService.getPosts(pageEvent.pageSize, pageEvent.pageIndex + 1);
    }

    onPostDelete(post: Post) {
      this.isLoading = true;
     this.postService.deletePost(post._id)
      .subscribe((responseData) => {
        this.postService.getPosts(this.postsPerPage, this.curentPage);
      });
    }

    ngOnDestroy(): void {
      this.postSub.unsubscribe();
      this.authListnerSubs.unsubscribe();
    }

}
