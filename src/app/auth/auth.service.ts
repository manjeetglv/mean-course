import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { AuthData } from './auth.model';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl + 'user/';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // private isAuthenticated = false;
  private userId: string;
  private token: string;
  private tokenTimer: any;
  private authStatusListner = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) { }
  // a = this.authStatusListner.next(false);

  getToken() {
    return this.token;
  }

  getUserId () {
    return this.userId;
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
      this.userId = authInformation.userId;
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
   return this.http.post(BACKEND_URL + 'signup', authData)
    .pipe(tap(
      () => {
        this.router.navigate(['/']);
      }, error => {
        console.log('Inside Error', error);
      }
    ));
  }

  login(authData: AuthData) {
   return this.http.post<{token: string, expiresIn: number, userId: string}> (BACKEND_URL + 'login', authData)
    .pipe(tap( responseData => {

      // Getting token from backend.
      const token = responseData.token;
      this.token = token;
      if (token) {
        // Getting user Id from backend
        const userId = responseData.userId;
        this.userId = userId;

        // Getting expiration time.
        const expiresIn = responseData.expiresIn;
        this.setAuthTimer(expiresIn);
        this.authStatusListner.next(true);

        // Creating expiration date in current browser.
        const expirationDate = new Date(new Date().getTime() + expiresIn);

        this.saveAuthData(token, expirationDate, userId);
        this.router.navigate(['/']);
        }
    }));
  }


  private setAuthTimer(expiresIn: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, expiresIn);
  }

  logout() {
    this.token = null;
    this.userId = null;
    this.authStatusListner.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('expirationDate', expirationDate.toISOString());
  }

  private clearAuthData () {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('expirationDate');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const expirationDate = localStorage.getItem('expirationDate');

    if (!token || !expirationDate || !userId) {
      return;
    } else {
      return {token: token, expirationDate: new Date(expirationDate), userId: userId};
    }

  }
}
