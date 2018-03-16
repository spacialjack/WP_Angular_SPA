import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TokenParams } from '../../Interfaces/TokenParams';
import { Observable } from 'rxjs/Observable';
import { UserData } from '../../Interfaces/userdata';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/retryWhen';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/scan';



@Injectable()
export class AuthService {
  // variables
  private AUTH_URL = 'http://jackfortenbery.com/wp-json/jwt-auth/v1/token';
  private USER_URL = 'http://jackfortenbery.com/wp-json/wp/v2/users/me?context=edit';
  // Edit Button Behavior Subject
  public showEdit: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private usrRole: string;
  public tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  private usrData: UserData;
  private role: string;
  private authRoles = [
    'administrator',
    'editor',
    'author',
    'contributer'
  ];
  private testRole;
  // Loader image behavior subject
  public loaderImg: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

    // function to get token from WP API
    getToken(userName, password): Observable<TokenParams> {
      return this.http.post<TokenParams>(this.AUTH_URL, {
        username: userName,
        password: password
      });
    }

    // function to get user role
    public getUserRole() {
      return this.http.get<UserData>(this.USER_URL)
      // Logic to retry http request if failed
        .retryWhen((err) => {
            return err.scan(
              (Attemptcount) => {
                Attemptcount++;
                if (Attemptcount < 6) {
                  this.loaderImg.next(true);
                  console.log('Attempt ' + Attemptcount);
                  return Attemptcount;
                } else {
                  throw err;
                }
              }, 0
            ).delay(9000);
        })
        .subscribe(
          data => {
            this.usrData = data;
            sessionStorage.setItem('roles', this.usrData.roles[0]);
            this.editPostButton();
            this.loaderImg.next(false);
          },
          (error) => {
            console.log(error);
            this.loaderImg.next(false);
          }
        );
    }

  // function to display edit button depending on role
  public editPostButton() {
    this.role = null;
    this.role = sessionStorage.getItem('roles');
    console.log('edit post button function before test value: ' + this.role);
    this.testRole = this.authRoles.indexOf(this.role);
    if (this.testRole === -1) {
      this.loaderImg.next(false);
      console.log('edit post button function returns value after test of: ' + this.testRole);
      return this.showEdit.next(false);
    } else {
        return this.showEdit.next(true);
    }
  }
}

