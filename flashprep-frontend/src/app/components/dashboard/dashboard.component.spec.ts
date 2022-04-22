import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs/internal/observable/of';
import { ApiService } from 'src/app/services/api.service';

import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let testDecks: any;
  let apiServiceSpy: any;


  beforeEach(async () => {
    const testUser = '1';
    testDecks = [
      {
        "id": 1,
        "user_id": 1,
        "name": "deck1",
        "description": "first demo deck. Test data here."
      },
      {
        "id": 2,
        "user_id": 1,
        "name": "deck2",
        "description": "second demo deck. Test data here."
      }
    ];
    const testSuccessfulDeleteResult = { success: true, error: '' };

    apiServiceSpy = jasmine.createSpyObj('ApiService', ['getLoggedInUser', 'getDecksByUserId', 'deleteDeck']);
    const getLoggedInUserSpy = apiServiceSpy.getLoggedInUser.and.returnValue(testUser);
    const getDecksByUserIdSpy = apiServiceSpy.getDecksByUserId.and.returnValue(of(testDecks)); // return Observable using rxjs
    const deleteDeckSpy = apiServiceSpy.deleteDeck.and.returnValue(of(testSuccessfulDeleteResult)); // return Observable using rxjs

    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);


    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [RouterTestingModule],
      providers: [{ provide: ApiService, useValue: apiServiceSpy }, { provide: Router, useValue: routerSpy }]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should list the decks that belong to the user on the dashboard', () => {
    let listPosition = 0;
    for (let deck of testDecks) {
      let deckNameElement = fixture.nativeElement.querySelector(`#deck-name-${listPosition}`);
      let deckDescriptionElement = fixture.nativeElement.querySelector(`#deck-description-${listPosition}`);
      expect(deckNameElement.textContent).toContain(deck.name);
      expect(deckDescriptionElement.textContent).toContain(deck.description);
      listPosition++;
    }
  });

  it('should trigger one apiService/http call to get the decks', () => {
    expect(apiServiceSpy.getDecksByUserId).toHaveBeenCalledTimes(1);
  });

  it('should include a button for adding decks', () => {
    let createDeckBtn = fixture.nativeElement.querySelector('button#create-deck-btn');
    expect(createDeckBtn.textContent).toContain('Create New Deck');
  });

  it('should include a study button for each deck', () => {
    let listPosition = 0;
    for (let deck of testDecks) {
      let deckStudyButton = fixture.nativeElement.querySelector(`button#deck-study-btn-${listPosition}`);
      expect(deckStudyButton.textContent).toContain('Study');
      listPosition++;
    }
  });

  it('should include a edit button for each deck', () => {
    let listPosition = 0;
    for (let deck of testDecks) {
      let deckEditButton = fixture.nativeElement.querySelector(`button#deck-edit-btn-${listPosition}`);
      expect(deckEditButton.textContent).toContain('Edit');
      listPosition++;
    }
  });

  it('should include a delete button for each deck', () => {
    let listPosition = 0;
    for (let deck of testDecks) {
      let deckDeleteButton = fixture.nativeElement.querySelector(`button#deck-delete-btn-${listPosition}`);
      expect(deckDeleteButton.textContent).toContain('Delete');
      listPosition++;
    }
  });


  
});
