import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { PostListComponent } from './home/post-list/post-list.component';
import { SinglePostComponent } from './home/single-post/single-post.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { WordPressDataService } from './Services/WordPressService/word-press-data.service';
import { AuthService } from './Services/AuthService/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthenticationComponent } from './authentication/authentication.component';
import { TokenInterceptor } from './Routing/token.interceptor';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';


@NgModule({
  declarations: [
    AppComponent,
    PostListComponent,
    SinglePostComponent,
    AuthenticationComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatDialogModule,
    BrowserAnimationsModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
  }, WordPressDataService, AuthService],
  bootstrap: [AppComponent]
})


export class AppModule { }
