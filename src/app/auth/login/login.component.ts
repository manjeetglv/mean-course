import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthData } from '../auth.model';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService) { }

  isLoading = false;
  authData = new AuthData();

  onLogin(loginForm: NgForm) {
    this.isLoading = true;
    this.authData.email = loginForm.value.email;
    this.authData.password = loginForm.value.password;

    this.authService.login(this.authData).subscribe(null, error => {
      this.isLoading = false;
    });
  }

  ngOnInit() {
  }

}
