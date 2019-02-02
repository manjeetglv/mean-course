import { Injectable } from '@angular/core';
import { Post } from './post.model';

import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';


const BACKEND_URL = environment.apiUrl + 'posts/';

@Injectable({
  providedIn: 'root'
})
export class PostService {
 private posts: Post[] = [];
 private postsUpdated = new Subject<{ posts: Post[], totalPosts: number}>();
  constructor(private http: HttpClient, private router: Router) { }

  getPost( postId: string) {
    return this.http.get<Post>(BACKEND_URL + postId);
  }

  getPosts(postsPerPage: number, currentPage: number) {
    const params = new HttpParams()
    .set('pageSize', postsPerPage.toString())
    .set('currentPage', currentPage.toString());

    this.http.get<{posts: any, totalPosts: number}>(BACKEND_URL, {params: params})
    // .pipe(map(postData => {
    //   // console.log(postData);
    //   return {
    //     posts: postData.posts.map(post => {
    //     console.log(post);
    //     return {
    //       title: post.title,
    //       content: post.content,
    //       _id: post._id,
    //       imagePath: post.imagePath,
    //       creator: post.creator
    //     };
    //   }),
    //   totalPosts: postData.totalPosts
    // };
    // }))
    .subscribe(
      (transformerPostData) => {
        this.posts = transformerPostData.posts;
        this.postsUpdated.next({posts: [...this.posts], totalPosts: transformerPostData.totalPosts});
      }
    );
  }

  getPostUpdatedListner() {
    return this.postsUpdated.asObservable();
  }


  addPost(post: Post) {
    // Now we are updating the post methed to post file data as well
    // Json does not allow to send the BLOB
    // FormData() object provided by javascript
    const postData = new FormData();
    postData.append('title', post.title);
    postData.append('content', post.content);
    postData.append('image', post.image, post.title);
    console.log(post.image);

    console.log('postData form post service', postData);
    // instead of post now we will send postData
    this.http.post(BACKEND_URL, postData)
    .subscribe( (responseData: Post) => {
      this.router.navigate(['/']);
    });
  }

  updatePost(post: Post) {
    console.log('Post from update post *****', post);
    let postData: Post | FormData;
    if (typeof(post.image) !== 'string') {
      postData = new FormData();
      postData.append('title', post.title);
      postData.append('content', post.content);
      postData.append('image', post.image, post.title);
      console.log('postData', postData);
    } else {
      postData = post;
    }
    this.http.put(BACKEND_URL + post._id, postData)
    .subscribe( (responseData: Post) => {
      this.router.navigate(['/']);
    });
  }

  deletePost(postId: string): any {
   return  this.http.delete(BACKEND_URL + postId);
  }

}
