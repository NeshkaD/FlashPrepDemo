import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs/internal/observable/of';
import { ApiService } from 'src/app/services/api.service';

import { StudyRegularComponent } from './study-regular.component';

describe('StudyRegularComponent', () => {
  let component: StudyRegularComponent;
  let fixture: ComponentFixture<StudyRegularComponent>;
  let apiServiceSpy: any;
  let testDeckDetails: any;
  let route: any;

  beforeEach(async () => {
    testDeckDetails = {
      "deckID": 1,
      "deckName": "deck1",
      "deckCardCount": 3,
      "cards": [
          {
              "cardID": 1,
              "cardFront": "example card 1",
              "cardBack": "This is the first test card. For testing purposes only. This is fake data. This is fake data. This is fake data."
          },
          {
              "cardID": 2,
              "cardFront": "example card 2",
              "cardBack": "This is the second test card. For testing purposes only. This is fake data. This is fake data. This is fake data."
          },
          {
              "cardID": 3,
              "cardFront": "example card 3",
              "cardBack": "This is the third test card. For testing purposes only. This is more fake data."
          }
      ]
    };

    apiServiceSpy = jasmine.createSpyObj('ApiService', ['getDeckDetails']);
    const getDecksDetailsSpy = apiServiceSpy.getDeckDetails.withArgs('1').and.returnValue(of(testDeckDetails)); // return Observable using rxjs

    await TestBed.configureTestingModule({
      declarations: [ StudyRegularComponent ],
      imports: [RouterTestingModule],
      providers: [{ provide: ApiService, useValue: apiServiceSpy }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    route = TestBed.inject(ActivatedRoute);
    let urlParamSpy = spyOn(route.snapshot.paramMap, 'get').withArgs('deckId').and.returnValue('1'); // set the url parameter to specify deck 1 to be used

    fixture = TestBed.createComponent(StudyRegularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the first card front on page load', () => {
    let cardElement = fixture.nativeElement.querySelector('#card');
    expect(cardElement.textContent).toContain("example card 1");
  });

  it('should display the back of the first card after flip button clicked', () => {
    let flipButtonDebugElement = fixture.debugElement.query(By.css('#flip-btn'));
    flipButtonDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();
    let cardElement = fixture.nativeElement.querySelector('#card');
    expect(cardElement.textContent).toContain("This is the first test card. For testing purposes only. This is fake data. This is fake data. This is fake data.");
  });

  it('should display the next card when Next Card button is clicked', () => {
    let nextButtonDebugElement = fixture.debugElement.query(By.css('#next-btn'));
    nextButtonDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();
    let cardElement = fixture.nativeElement.querySelector('#card');
    expect(cardElement.textContent).toContain("example card 2");
  });

  it('should call ApiService::getDeckDetails once on page load', () => {
    expect(apiServiceSpy.getDeckDetails).toHaveBeenCalledTimes(1);
  });

  it('should obtain one copy of the deck to be studied', () => {
    expect(component.deck).toEqual(testDeckDetails);
  });

});
