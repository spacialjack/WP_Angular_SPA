import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PostsInterface } from '../../Interfaces/post';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject} from 'rxjs/BehaviorSubject';
import { AuthService } from '../../Services/AuthService/auth.service';



@Injectable()
export class WordPressDataService {
  // variables
  private POSTS_URL = 'http://jackfortenbery.com/wp-json/wp/v2/posts';

  private postID: any = {};

  // post-list ID subject
  public singlePostSubject = new BehaviorSubject<number>(2869);

  // single-post subject
  public singlePostDataSubject = new BehaviorSubject<any>(2869);

  // Subjects casted as observables
  public singlePostObservable = this.singlePostSubject.asObservable();

  public singlePostData = this.singlePostDataSubject.asObservable();

  // variable to dump the single post response into
  private postDetails: PostsInterface[] = [];

  // Variable to store the http post title change request
  private postURL: string;

  constructor(private http: HttpClient, private authService: AuthService) {}

  // gets all of the posts for the post-list component
  getPosts(): Observable<PostsInterface[]> {
    return this.http.get<PostsInterface[]>(this.POSTS_URL);
  }

  // gets the ID from click and requests the single post object
  setID(postID) {
    if (postID != null) {
      this.http.get<PostsInterface[]>(this.POSTS_URL + '/' + postID + '?_embed=true').subscribe(
        data => {
          this.postDetails = <PostsInterface[]>data;
          this.singlePostDataSubject.next(this.postDetails);
          this.authService.editPostButton();
        });
    }
  }

  // Update Post Data, Now is just the title
  updatePostData(postData) {
    console.log(postData);
    this.postURL = this.POSTS_URL + '/' + postData.id + '?_embed=true';
    this.http.post<PostsInterface>(this.postURL, {
      title: postData.title.rendered
    })
    // How to handle error and retry logic
    .retryWhen((err) => {
      return err.scan(
        (Attemptcount) => {
          Attemptcount++;
          if (Attemptcount < 4) {
            this.authService.loaderImg.next(true); // Loading Spinner
            console.log('Attempt ' + Attemptcount);
            return Attemptcount;
          } else {
            throw err;
          }
        }, 0
      ).delay(4000);
  })
    .subscribe(
      res => console.log(res), // Console the response
      (error) => {
        console.log(error);
        this.authService.loaderImg.next(false);
      }
    );
  }
}
