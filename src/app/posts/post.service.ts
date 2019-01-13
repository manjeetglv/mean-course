import { Injectable } from '@angular/core';
import { Post } from './post.model';

import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostService {
 private posts: Post[] = [];
 private postsUpdated = new Subject<Post[]>();
  constructor(private http: HttpClient, private router: Router) { }

  getPost( postId: string) {
    return this.http.get<Post>('http://localhost:3000/api/posts/' + postId);
  }

  getPosts() {
    this.http.get<Post[]>('http://localhost:3000/api/posts')
    // .pipe(map(postData1 => {
    //   console.log(postData1);
    //   return postData1.map((post) => {
    //     console.log(post);
    //     return post;
    //   });
    // }))
    .subscribe(
      (postData) => {
        this.posts = postData;
        this.postsUpdated.next([...this.posts]);
      }
    );
  }

  getPostUpdatedListner() {
    return this.postsUpdated.asObservable();
  }

  addPost(post: Post) {
    this.http.post('http://localhost:3000/api/posts', post)
    .subscribe( (responseData: Post) => {
      console.log(responseData);
      post._id = responseData._id;
      this.posts.push(post);
      this.postsUpdated.next([...this.posts]);
      this.router.navigate(['/']);
    });
  }

  updatePost(post: Post) {
    this.http.put('http://localhost:3000/api/posts/' + post._id, post)
    .subscribe( (responseData: Post) => {
      const oldPostIndex = this.posts.findIndex(p => p._id === post._id);
      this.posts[oldPostIndex] = post;
      this.postsUpdated.next([...this.posts]);
      this.router.navigate(['/']);
    });
  }

  deletePost(postId: string): any {
    this.http.delete('http://localhost:3000/api/posts/' + postId)
    .subscribe((responseData) => {
      this.getPosts();
    });
  }

}
