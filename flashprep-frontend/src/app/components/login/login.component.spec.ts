import { ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs/internal/observable/of';
import { ApiService } from 'src/app/services/api.service';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let apiServiceSpy: any;
  const testSuccessfulLoginResult = {
    "isLoggedIn": true, 
    "userId": 1
  };

  const testUnsuccessfulLoginResult = {
    "isLoggedIn": false, 
    "userId": null
  };

  beforeEach(async () => {
    

    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    apiServiceSpy = jasmine.createSpyObj('ApiService', ['setLoggedInUser', 'login']);

    

    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      providers: [{ provide: ApiService, useValue: apiServiceSpy }, { provide: Router, useValue: routerSpy }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should trigger apiService to make 1 http call when login called', () => {
    component.username = 'valid-username';
    component.password = 'valid-password';
    const loginSpy = apiServiceSpy.login.withArgs('valid-username', 'valid-password').and.returnValue(of(testSuccessfulLoginResult));
    component.login();
    expect(loginSpy).toHaveBeenCalledTimes(1);
  });


  it('should set the ApiService::loggedInUser if login is successful', () => {
    const loginSpy = apiServiceSpy.login.and.returnValue(of(testSuccessfulLoginResult)); // return Observable using rxjs
    component.username = 'valid-username';
    component.password = 'valid-password';
    component.login();
    expect(apiServiceSpy.setLoggedInUser).toHaveBeenCalledOnceWith(1);
  });

  it('should not set the ApiService::loggedInUser if login fails', () => {
    apiServiceSpy.login.and.returnValue(of(testUnsuccessfulLoginResult)); // return Observable using rxjs
    component.username = 'invalid-username';
    component.password = 'invalid-password';
    component.login();
    expect(apiServiceSpy.setLoggedInUser).not.toHaveBeenCalled();
  });
});
