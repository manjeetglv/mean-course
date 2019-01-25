import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { AuthData } from './auth.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: string;
  private authStatusListner = new BehaviorSubject<boolean>(false);
  // private isAuthenticated = false;
  private tokenTimer: any;

  constructor(private http: HttpClient, private router: Router) { }
  // a = this.authStatusListner.next(false);

  getToken() {
    return this.token;
  }

  getAuthStatusListner () {
    return this.authStatusListner.asObservable();
  }

  isAuth() {
    // return this.isAuthenticated;
    return this.authStatusListner.value;
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) { return; }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      // this.isAuthenticated = true;
      this.authStatusListner.next(true);
      this.setAuthTimer(expiresIn);
    } else {
      this.logout();
    }
  }

  /**
   * Sign Up
   * @param authData It contains emaill and password.
   */
  createUser(authData: AuthData) {
    this.http.post('http://localhost:3000/api/user/signup', authData).subscribe( responseData => {
      console.log(responseData);
    });
  }

  login(authData: AuthData) {
    this.http.post<{token: string, expiresIn: number}> ('http://localhost:3000/api/user/login', authData).subscribe( responseData => {
      const token = responseData.token;
      console.log(token);
      this.token = token;
      if (token) {
        const expiresIn = responseData.expiresIn;
        this.setAuthTimer(expiresIn);
        // this.isAuthenticated = true;
        this.authStatusListner.next(true);
        const expirationDate = new Date(new Date().getTime() + expiresIn);
        this.saveAuthData(token, expirationDate);
        this.router.navigate(['/']);
        }
    });
  }


  private setAuthTimer(expiresIn: number) {
    console.log('Expires In value: ', expiresIn * 1000);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, expiresIn);
  }

  logout() {
    this.token = null;
    this.authStatusListner.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expirationDate', expirationDate.toISOString());
  }

  private clearAuthData () {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expirationDate');

    if (!token || !expirationDate) {
      return;
    } else {
      return {token: token, expirationDate: new Date(expirationDate)};
    }

  }
}
