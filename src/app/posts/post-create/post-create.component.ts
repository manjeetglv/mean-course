import { Component, OnInit, EventEmitter,  Output } from '@angular/core';
import { Post } from '../post.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostService } from '../post.service';
import { ActivatedRoute } from '@angular/router';
import { mimeType} from '../post-create/mime-type-validator';

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
  postForm: FormGroup;
  imagePreview: string;
  constructor(private postService: PostService, private route: ActivatedRoute) { }

   onSavePost() {
     console.log('Inside on Save post' );
     if ( this.postForm.invalid ) { return; }
     console.log('Form is valid ');
    // this.postCreated.emit({title: postForm.value.title, content: postForm.value.content});
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postService.addPost({
        _id: null,
        title: this.postForm.value.title,
        content: this.postForm.value.content,
        image: this.postForm.value.image });
    } else if (this.mode === 'edit') {
      this.postService.updatePost({_id: this.postId,
        title: this.postForm.value.title,
        content: this.postForm.value.content,
        image: this.postForm.value.image});
    }
    this.postForm.reset();
   }

   onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.postForm.patchValue({image: file});
    this.postForm.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = <string> reader.result;
    };
    reader.readAsDataURL(file);
   }
   ngOnInit() {
     this.postForm = new FormGroup({
      title: new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      content: new FormControl(null, {validators: [Validators.required]}),
      image: new FormControl(null, {validators: [Validators.required], asyncValidators: [mimeType]})
     });
     this.route.paramMap.subscribe((paramMap) => {
        if ( paramMap.has('postId')) {
          this.mode = 'edit';
          this.postId = paramMap.get('postId');
          this.isLoading = true;
          this.postService.getPost(this.postId).subscribe((post) => {
            this.isLoading = false;
            this.post = post;
            this.postForm.setValue({title: post.title, content: post.content, image: post.imagePath});
          });
        } else {
          this.mode = 'create';
          this.postId = null;
        }
     });
  }

}
