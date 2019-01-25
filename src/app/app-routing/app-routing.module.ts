import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PostListComponent } from '../posts/post-list/post-list.component';
import { PostCreateComponent } from '../posts/post-create/post-create.component';
import { LoginComponent } from '../auth/login/login.component';
import { SignupComponent } from '../auth/signup/signup.component';
import { AuthGaurdService } from '../auth/auth-gaurd.service';

const routes: Routes = [
  { path: '', component: PostListComponent},
  { path: 'create', component: PostCreateComponent, canActivate: [AuthGaurdService]},
  { path: 'edit/:postId', component: PostCreateComponent, canActivate: [AuthGaurdService]},
  { path: 'login', component: LoginComponent},
  { path: 'signup', component: SignupComponent},
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  providers: [AuthGaurdService]
})
export class AppRoutingModule { }
