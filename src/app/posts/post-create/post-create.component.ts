import { Component, OnInit, EventEmitter,  Output } from '@angular/core';
import { Post } from '../post.model';
import { NgForm } from '@angular/forms';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  // post = new Post();
  // @Output() postCreated = new EventEmitter<Post>();
  constructor(private postService: PostService) { }

   onAddPost(postForm: NgForm) {
     if ( postForm.invalid ) { return; }

    // this.postCreated.emit({title: postForm.value.title, content: postForm.value.content});

    this.postService.addPost({_id: null, title: postForm.value.title, content: postForm.value.content});
    postForm.resetForm();
   }

   ngOnInit() {
  }

}
