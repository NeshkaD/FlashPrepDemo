import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';

describe('ApiService', () => {
  let service: ApiService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  const baseUrl = 'http://localhost:8080';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be initialized with no logged in user by default', () => {
    expect(service.loggedInUser).toBeNull();
  });

  it('should return loggedInUser when getLoggedInUser called', () => {
    service.loggedInUser = '5';
    expect(service.getLoggedInUser()).toEqual('5');
  });

  it('should update value of loggedInUser when setLoggedInUser called', () => {
    service.setLoggedInUser('5')
    expect(service.loggedInUser).toEqual('5');
  });
});
 