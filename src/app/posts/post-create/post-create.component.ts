import { Component, OnInit, EventEmitter,  Output } from '@angular/core';
import { Post } from '../post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  post = new Post();
  @Output() postCreated = new EventEmitter<Post>();
  constructor() { }

   onAddPost(post: Post) {
    //  this.newPost = postInput.value ;
    this.postCreated.emit({...post});
   }

  ngOnInit() {
  }

}
