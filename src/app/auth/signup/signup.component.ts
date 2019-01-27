import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { AuthData } from '../auth.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(private authService: AuthService) { }
  isLoading = false;
  authData = new AuthData();

  onSignup(signupForm: NgForm) {
    this.isLoading = true;
    if (signupForm.invalid) {
      return;
    }

    this.authData.email = signupForm.value.email;
    this.authData.password = signupForm.value.password;
    this.authService.createUser(this.authData)
    .subscribe(null, error => {
      console.log('I am in component error');
      this.isLoading = false;
    } );
  }

  ngOnInit() {
  }

}
