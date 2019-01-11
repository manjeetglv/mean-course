import { Injectable } from '@angular/core';
import { Post } from './post.model';

import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostService {
 private posts: Post[] = [];
 private postsUpdated = new Subject<Post[]>();
  constructor(private http: HttpClient) { }

  getPosts() {
    this.http.get<Post[]>('http://localhost:3000/api/posts')
    .pipe(map(postData1 => {
      console.log(postData1);
      return postData1;
    }))
    .subscribe(
      (postData) => {
        console.log('---------------', postData);
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
    .subscribe( (responseData) => {
      console.log(responseData);
      this.posts.push(post);
      this.postsUpdated.next([...this.posts]);
    });
  }
}
