import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  loggedInUser: any;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {
    this.loggedInUser = null;
  }

  ngOnInit(): void {
    this.loggedInUser = this.apiService.getLoggedInUser(); // to be used in the html template to decide on available login/logout/signup buttons
    
    // Subscribe to route changes. Whenever the route changes in the URL bar, re-check if a user is logged in:
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        console.log(`Navigated to new route: ${event.url}`);
        this.loggedInUser = this.apiService.getLoggedInUser() 
      }
   });
  }

  onClickLogoutButton(event: any): void {
    this.apiService.setLoggedInUser(null);
    this.router.navigate(['/']);
  }


}
