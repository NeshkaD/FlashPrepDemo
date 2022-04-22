import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  username = '';
  password = '';
  email = '';
  errorMessageFromServer = '';

  constructor(
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  postSignUpLogin(username: any, password: any) {
    this.apiService.login(username, password).subscribe(
      data => {
        console.log(`Result of post-signup login is: ${JSON.stringify(data)}`);
        if(data.isLoggedIn) {
          this.apiService.setLoggedInUser(data.userId);
          this.router.navigate(['/dashboard']);
        }
        else {
          console.log('post-signuup login failed because credentials failed authentication. Please try again from login page.');
          this.router.navigate(['/login']);
        }  
      },
      err => {
        console.log(`Post-signup login failed with error: ${err}`);
        this.router.navigate(['/login']);
      }
    );
  }

  signUp(): void {
    console.log(`SignUpComponent::signUp called with username=${this.username}, password=${this.password}, email=${this.password}`); // TODO: Delete this!
    this.apiService.signUp(this.username, this.email, this.password).subscribe(
      data => {
        console.log(`Result of sign up is: ${JSON.stringify(data)}`);
        if(data.success) {
          this.postSignUpLogin(this.username, this.password);
        } else {
          this.errorMessageFromServer = data.error;
        }              
      },
      err => {
        console.log(`Sign up failed with error: ${err}`);
        this.errorMessageFromServer = 'Failed to reach server. Please check your connection.'
      }
    );
  }

}
