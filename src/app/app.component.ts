import { Component, OnInit, ViewChild } from '@angular/core';
import { SinglePostComponent } from './home/single-post/single-post.component';
import { AuthService } from './Services/AuthService/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public token: string;
  constructor(private authService: AuthService) {}

  ngOnInit() {}
}
