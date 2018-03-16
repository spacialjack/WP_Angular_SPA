import { Component, OnInit, Input } from '@angular/core';
import { WordPressDataService } from '../../Services/WordPressService/word-press-data.service';
import { Observable } from 'rxjs/Observable';
import * as $ from 'jquery';
import { PostListComponent } from '../post-list/post-list.component';
import { Subscription } from 'rxjs/Subscription';
import { PostsInterface} from '../../Interfaces/post';
import { AuthService } from '../../Services/AuthService/auth.service';
import { UserData } from '../../Interfaces/userdata';
import { FormGroup, FormControl } from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';



@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.css']
})

export class SinglePostComponent implements OnInit {

  // variables
  public subscription2: Subscription;
  private postData: PostsInterface;
  private authorName: string;
  public authName: string;
  public usrRole: string;
  private showEdit: boolean;
  private usrData: UserData;
  public token: string; // Need to Change this when using cookie
  public loader: boolean;
  public hideLoader: boolean;
  public editForm;
  public editTitle: boolean;
  public updatedPostTitle = false;
  public updatedPost: PostsInterface;

  constructor(private wordpressData: WordPressDataService, private authService: AuthService, public dialog: MatDialog) {
    // Logic to determine whether to show Title Editing features when first constructed
    this.authService.showEdit.subscribe(
      data => {
        this.showEdit = data;
        this.editTitle = false;
      }
    );
    // subscription to the observable which is requesting the single post by ID
    this.subscription2 = this.wordpressData.singlePostDataSubject
    .subscribe(postData => this.postData = {...postData});
    // Subscribing to loading spinner value
    this.authService.loaderImg.subscribe(data => this.loader = data);
  }

  ngOnInit() {}

  // Setting the hideLoader variable from the observable
  public showContent(loader) {
    this.hideLoader = !loader;
  }
  // Function to allow editing
  public editPost(): void {
    this.showEdit = false;
    this.editTitle = !this.showEdit;
  }

  // Submit new title logic
  public submitTitle() {
     this.editTitle = false;
     this.updatedPostTitle = true;
     this.showEdit = true;
     this.wordpressData.updatePostData(this.postData); // Http post method in service
  }

  // Event for capturing input box value for new title
  public onNameKeyUp(event: any) {
    this.postData.title.rendered = event.target.value;
  }
}
