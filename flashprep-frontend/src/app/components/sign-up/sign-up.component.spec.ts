import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs/internal/observable/of';
import { ApiService } from 'src/app/services/api.service';

import { SignUpComponent } from './sign-up.component';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;
  let apiServiceSpy: any;
  let testSuccessfulLoginResult: any;
  let testSuccessfulSignUp: any;

  beforeEach(async () => {
    testSuccessfulLoginResult = {
      "isLoggedIn": true,
      "userId": 1
    };

    testSuccessfulSignUp = {
      "success": true,
      "error": ""
    };

    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    apiServiceSpy = jasmine.createSpyObj('ApiService', ['setLoggedInUser', 'login', 'signUp']);

    // const loginSpy = apiServiceSpy.login.and.returnValue(of(testSuccessfulLoginResult)); // return Observable using rxjs
    // const signUpSpy = apiServiceSpy.signUp.and.returnValue(of(testSuccessfulSignUp)); // return Observable using rxjs

    await TestBed.configureTestingModule({
      declarations: [ SignUpComponent ],
      providers: [{ provide: ApiService, useValue: apiServiceSpy }, { provide: Router, useValue: routerSpy }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should trigger apiService to make 1 http call to sign up when signUp called', () => {
    component.username = 'valid-username';
    component.password = 'valid-password';
    component.email = 'valid-email';
    const signUpSpy = apiServiceSpy.signUp.withArgs('valid-username', 'valid-email', 'valid-password').and.returnValue(of(testSuccessfulSignUp));
    const loginSpy = apiServiceSpy.login.withArgs('valid-username', 'valid-password').and.returnValue(of(testSuccessfulLoginResult));
    component.signUp();
    expect(signUpSpy).toHaveBeenCalledTimes(1);
  });

  it('should trigger apiService to make 1 http call to login when signUp called', () => {
    component.username = 'valid-username';
    component.password = 'valid-password';
    component.email = 'valid-email';
    const signUpSpy = apiServiceSpy.signUp.withArgs('valid-username', 'valid-email', 'valid-password').and.returnValue(of(testSuccessfulSignUp));
    const loginSpy = apiServiceSpy.login.withArgs('valid-username', 'valid-password').and.returnValue(of(testSuccessfulLoginResult));
    component.signUp();
    expect(loginSpy).toHaveBeenCalledTimes(1);
  });

  it('should set the ApiService::loggedInUser if sign up is successful', () => {
    const loginSpy = apiServiceSpy.login.and.returnValue(of(testSuccessfulLoginResult)); // return Observable using rxjs
    const signUpSpy = apiServiceSpy.signUp.and.returnValue(of(testSuccessfulSignUp)); // return Observable using rxjs
    component.username = 'valid-username';
    component.password = 'valid-password';
    component.email = 'valid-email';
    component.signUp();
    expect(apiServiceSpy.setLoggedInUser).toHaveBeenCalledOnceWith(1);
  });
});
