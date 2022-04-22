import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

enum LoginState {
  NotStarted,
  InProgress,
  FailedInvalidCredentials,
  FailedServerError
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginState: LoginState;
  username = '';
  password = '';

  constructor(
    private apiService: ApiService,
    private router: Router
    ) {
      this.loginState = LoginState.NotStarted;
    }

  ngOnInit(): void {
  }

  login(): void {
    console.log(`LoginComponent::login called with username=${this.username} and password=${this.password}`); // TODO: Delete this!
    this.loginState = LoginState.InProgress;
    this.apiService.login(this.username, this.password).subscribe(
      data => {
        console.log(`Result of login is: ${JSON.stringify(data)}`);
        if(data.isLoggedIn) {
          this.apiService.setLoggedInUser(data.userId);
          this.router.navigate(['/dashboard']);
        }
        else {
          console.log('credentials failed authentication. Please try again.');
          this.loginState = LoginState.FailedInvalidCredentials;
        }
        
      },
      err => {
        console.log(`Login failed with error: ${err}`);
        this.loginState = LoginState.FailedServerError;
      }
    );
  }

}
