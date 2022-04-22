import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NavigationStart, Router, RouterEvent, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ApiService } from 'src/app/services/api.service';
import { DashboardComponent } from '../dashboard/dashboard.component';
import {Location} from "@angular/common";

import { NavigationComponent } from './navigation.component';
import { ReplaySubject } from 'rxjs';

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;
  let location: Location;
  let router: Router;
  let apiServiceSpy: any;
  let testUser: any;

  const test_routes: Routes = [
    {
      path: 'dashboard',
      component: DashboardComponent
    }
  ];

  beforeEach(async () => {
    testUser = '1';

    apiServiceSpy = jasmine.createSpyObj('ApiService', ['getLoggedInUser']);

    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ NavigationComponent ],
      imports: [RouterTestingModule.withRoutes(test_routes)],
      providers: [{provide: ApiService, useValue: apiServiceSpy}]
    })
    .compileComponents();  
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy(); 
  });

  it('should have a button for navigating to the Dashboard', () => {
    let dashboardButton = fixture.nativeElement.querySelector('#dashboard-nav-btn');
    expect(dashboardButton.textContent).toContain("Dashboard");
  });

  it('should have a login button when user is not logged in', () => {
    apiServiceSpy.getLoggedInUser.and.returnValue(null);
    TestBed.get(Router).events.next(new NavigationStart(1, 'home')); // trigger a new navigation event so that navbar will update
    fixture.detectChanges();
    let loginButton = fixture.nativeElement.querySelector('#login-nav-btn');
    expect(loginButton).toBeTruthy();
    expect(loginButton.textContent).toContain("Login");
  });

  it('should have a signup button when user is not logged in', () => {
    apiServiceSpy.getLoggedInUser.and.returnValue(null);
    TestBed.get(Router).events.next(new NavigationStart(1, 'home')); // trigger a new navigation event so that navbar will update
    fixture.detectChanges();
    let signUpButton = fixture.nativeElement.querySelector('#signup-nav-btn');
    expect(signUpButton).toBeTruthy();
    expect(signUpButton.textContent).toContain("Sign Up");
  });

  it('should have a log out button when user is logged in', () => {
    apiServiceSpy.getLoggedInUser.and.returnValue(testUser); // mock getLoggerInUser to return a logger in user
    TestBed.get(Router).events.next(new NavigationStart(1, 'home')); // trigger a new navigation event so that navbar will update
    fixture.detectChanges();
    let logOutButton = fixture.nativeElement.querySelector('#logout-nav-btn');
    expect(logOutButton).toBeTruthy();
    expect(logOutButton.textContent).toContain("Logout");
  });

  it('should not have a login button when user is logged in (negative test)', () => {
    apiServiceSpy.getLoggedInUser.and.returnValue(1);
    TestBed.get(Router).events.next(new NavigationStart(1, 'home')); // trigger a new navigation event so that navbar will update
    fixture.detectChanges();
    let loginButton = fixture.nativeElement.querySelector('#login-nav-btn');
    expect(loginButton).toBeFalsy();
  });

  it('should not have a signup button when user is logged in (negative test)', () => {
    apiServiceSpy.getLoggedInUser.and.returnValue(1);
    TestBed.get(Router).events.next(new NavigationStart(1, 'home')); // trigger a new navigation event so that navbar will update
    fixture.detectChanges();
    let signUpButton = fixture.nativeElement.querySelector('#signup-nav-btn');
    expect(signUpButton).toBeFalsy();
  });

  it('should not have a log out button when user is not logged in', () => {
    apiServiceSpy.getLoggedInUser.and.returnValue(null); // mock getLoggerInUser to return a logger in user
    TestBed.get(Router).events.next(new NavigationStart(1, 'home')); // trigger a new navigation event so that navbar will update
    fixture.detectChanges();
    let logOutButton = fixture.nativeElement.querySelector('#logout-nav-btn');
    expect(logOutButton).toBeFalsy();
  });
});
