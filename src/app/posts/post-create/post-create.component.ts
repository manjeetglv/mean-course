import { Component, OnInit, EventEmitter,  Output } from '@angular/core';
import { Post } from '../post.model';
import { NgForm } from '@angular/forms';
import { PostService } from '../post.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  // post = new Post();
  // @Output() postCreated = new EventEmitter<Post>();
  private mode = 'create';
  private postId: string;
  post: Post;
  isLoading = false;
  constructor(private postService: PostService, private route: ActivatedRoute) { }

   onSavePost(postForm: NgForm) {
     if ( postForm.invalid ) { return; }

    // this.postCreated.emit({title: postForm.value.title, content: postForm.value.content});
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postService.addPost({_id: null, title: postForm.value.title, content: postForm.value.content});
      postForm.resetForm();
    } else if (this.mode === 'edit') {
      this.postService.updatePost({_id: this.postId, title: postForm.value.title, content: postForm.value.content});
      postForm.resetForm();
    }
   }

   ngOnInit() {
     this.route.paramMap.subscribe((paramMap) => {
        if ( paramMap.has('postId')) {
          this.mode = 'edit';
          this.postId = paramMap.get('postId');
          this.isLoading = true;
          this.postService.getPost(this.postId).subscribe((post) => {
            this.isLoading = false;
            this.post = post;
          });
        } else {
          this.mode = 'create';
          this.postId = null;
        }
     });
  }

}
