import { Component, OnChanges, OnInit, SimpleChanges, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { WordPressDataService } from '../Services/WordPressService/word-press-data.service';
import { TokenParams } from '../Interfaces/TokenParams';
import { AuthService } from '../Services/AuthService/auth.service';
import { UserData } from '../Interfaces/userdata';


@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})

export class AuthenticationComponent implements OnInit {
  // Get auth token as input from AuthService
  @Input() public token: string;

  // variables
  public loginForm;
  public authData: TokenParams;
  public loginShow: Boolean;
  public usrData: UserData;
  public nameLoginField: string;
  public pssLoginField: string;
  public role: string;
  public loggedIn: boolean;
  public loader: boolean;


  constructor(private wordpressService: WordPressDataService, private authService: AuthService) {
    // initialize variables
    this.loginShow = true;
    this.nameLoginField = 'Username';
    this.pssLoginField = 'Password';
  }

  ngOnInit() {
    // upon component init create a Form Group
    this.loginForm = new FormGroup({
      username: new FormControl(),
      password: new FormControl()
    });
  }

  // Login Button Logic
  onSubmit(userCred) {
    this.authService.loaderImg.next(true);
    // Observable subscription to make a post to WP API to get Token: located in AuthService
    this.authService.getToken(userCred.username, userCred.password).subscribe(
      data => {
        this.authService.loaderImg.next(true); // show loading spinner
        this.authData = data; // http response
        sessionStorage.removeItem('roles'); // remove roles from local storage so that it is not cached: need to change to use cookie
        this.setSession(this.authData); // store variables in sessionStorage
        this.authService.getUserRole(); // get user role
    });
  }


  // Store variables in SessionStorage will need to be changed to use cookie
  public setSession(response): void {
    sessionStorage.setItem('token', response.token);
    sessionStorage.setItem('user_display_name', response.user_display_name);
    sessionStorage.setItem('user_email', response.user_email);
    this.authService.tokenSubject.next(response.token);
  }


  // Logout logic
  public logOut(): void {
    this.authService.loaderImg.next(true);
    this.authService.showEdit.next(false);

    // Remove variables from SessionStorage
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user_display_name');
    sessionStorage.removeItem('user_email');
    sessionStorage.removeItem('roles');

    // Remove stored input field values and set to placeholders
    this.loginForm.username = '';
    this.loginForm.password = '';
    this.nameLoginField = 'Username';
    this.pssLoginField = 'Password';

    // Completely wipe form
    sessionStorage.clear();
    this.loginForm.reset();
    this.authService.loaderImg.next(false);
    console.log('session storage role value on logout: ' + sessionStorage.getItem('roles'));
  }

  // Logic to determine when to toggle the login form or logout button
  public hideLogin() {
    this.token = sessionStorage.getItem('token'); // If token is not in SessionStorage show Login Form
    if (this.token) {
      return true;
    } else {
      return false;
    }
  }

  public hideLogout() {
    if (!this.token) { // If token is not in Session storage hide logout button
      return true;
    } else {
      return false;
    }
  }

}
