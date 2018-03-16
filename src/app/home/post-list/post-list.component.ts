import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as $ from 'jquery';
import { WordPressDataService } from '../../Services/WordPressService/word-press-data.service';
import { SinglePostComponent } from '../single-post/single-post.component';
import { interval } from 'rxjs/observable/interval';
import { timer } from 'rxjs/observable/timer';
import { AuthService } from '../../Services/AuthService/auth.service';
import { UserData } from '../../Interfaces/userdata';




@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit {
  // variables
  public posts = [];
  postID: number;
  public data;
  usrData: UserData;
  public token: string;
  public showEdit: boolean;

  // time variables for updating WP data
  public httpInterval = interval(3000);

  constructor(private wordpressData: WordPressDataService, private authService: AuthService) {}

  ngOnInit() {
        // Subscription to determine the value of showEdit which governs the edit button
        this.authService.showEdit.subscribe(
          show => this.showEdit = show
        );
        this.wordpressData.getPosts().subscribe(data => this.posts = data);
        // Set interval for retrieving post updates
        this.httpInterval.subscribe( n => {
          this.wordpressData.getPosts().subscribe(data => this.posts = data);
        });
  }

  // Sends single post information to the single-post component
  sendID(post) {
      // Set loading spinner
      this.authService.loaderImg.next(true);
      // if showEdit is false then verify user role
      if (post != null) {
        if (this.showEdit === false) {
          this.authService.editPostButton();
        }
      this.postID = post.id;
      // send the postID to the wordpress service to get the single post
      this.wordpressData.setID(this.postID);
      // turn off loading spinner
      this.authService.loaderImg.next(false);
    }
  }
}
