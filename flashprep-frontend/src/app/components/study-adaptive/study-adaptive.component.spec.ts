import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs/internal/observable/of';
import { ApiService } from 'src/app/services/api.service';

import { StudyAdaptiveComponent } from './study-adaptive.component';

describe('StudyAdaptiveComponent', () => {
  let component: StudyAdaptiveComponent;
  let fixture: ComponentFixture<StudyAdaptiveComponent>;
  let testDeckDetails: any;
  let testFirstRandomCard: any;
  let testSecondRandomCard: any;
  let apiServiceSpy: any;
  let lastUpdatedDeckID: any;
  let lastUpdatedCardID: any;
  let isLastAnswerCorrect: any;
  let route: any;


  beforeEach(async () => {
    lastUpdatedDeckID = null;
    lastUpdatedCardID = null;
    isLastAnswerCorrect = null;
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

    const testResetWeightsSuccessResult = {"success": true, "error": ''};

    testFirstRandomCard = testDeckDetails.cards[2];
    testSecondRandomCard = testDeckDetails.cards[0];

    const testUpdateCardWeightSuccessResponse = {
      "success": true,
      "updateApplied": true,
      "error": ""
    };

    apiServiceSpy = jasmine.createSpyObj('ApiService', [
      'getDeckDetails',
      'resetDeckWeights',
      'updateCardWeightBasedOnUserAnswer', 
      'getNextCardByWeightedProbability'
    ]);
    const getDecksDetailsSpy = apiServiceSpy.getDeckDetails.and.returnValue(of({testDeckDetails})); // return Observable using rxjs
    const resetDeckWeightsSpy = apiServiceSpy.resetDeckWeights.withArgs(testDeckDetails.deckID).and.returnValue(of(testResetWeightsSuccessResult)); // return Observable using rxjs
    const updateCardWeightBasedOnUserAnswerSpy = apiServiceSpy.updateCardWeightBasedOnUserAnswer.and.callFake(
      (deckId: any, cardId: any, isCorrect:any) => {
        lastUpdatedDeckID = deckId;
        lastUpdatedCardID = cardId;
        isLastAnswerCorrect = isCorrect;
        return of(testUpdateCardWeightSuccessResponse); // return Observable using rxjs
    }

    ) 
    const getNextCardByWeightedProbabilitySpy = apiServiceSpy.getNextCardByWeightedProbability.and.returnValues(
      of(testFirstRandomCard),
      of(testSecondRandomCard)
    ); // return Observable using rxjs. Returns a different card the 2nd time to simulate randomness.

    await TestBed.configureTestingModule({
      declarations: [ StudyAdaptiveComponent ],
      imports: [RouterTestingModule],
      providers: [{ provide: ApiService, useValue: apiServiceSpy }] 
    })
    .compileComponents();
  });

  beforeEach(() => {
    route = TestBed.inject(ActivatedRoute);
    let urlParamSpy = spyOn(route.snapshot.paramMap, 'get').withArgs('deckId').and.returnValue('1'); // set the url parameter to specify deck 1 to be used

    fixture = TestBed.createComponent(StudyAdaptiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should obtain the first randomly chosen card from ApiService on page load', () => {
    expect(apiServiceSpy.getNextCardByWeightedProbability).toHaveBeenCalledTimes(1);
  });

  it('should display the first randomly chosen card front from the deck on page load', () => {
    let cardElement = fixture.nativeElement.querySelector('#card');
    expect(cardElement.textContent).toContain(testFirstRandomCard.cardFront);
  });

  it('should display the back of the first randomly chosen card after flip button clicked', () => {
    let flipButtonDebugElement = fixture.debugElement.query(By.css('#flip-btn'));
    flipButtonDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();
    let cardElement = fixture.nativeElement.querySelector('#card');
    expect(cardElement.textContent).toContain(testFirstRandomCard.cardBack);
  });

  it('should request the next card from apiService when Next Button is clicked', () => {
    let nextButtonDebugElement = fixture.debugElement.query(By.css('#next-btn'));
    nextButtonDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(apiServiceSpy.getNextCardByWeightedProbability).toHaveBeenCalledTimes(2);
  });

  it('should display the front of the second randomly chosen card after Next Button is clicked', () => {
    let nextButtonDebugElement = fixture.debugElement.query(By.css('#next-btn'));
    nextButtonDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();
    let cardElement = fixture.nativeElement.querySelector('#card');
    expect(cardElement.textContent).toContain("example card 1");
  });

  it('should call apiService once with isCorrectAnswer==true when Correct Button is clicked', () => {
    let flipButtonDebugElement = fixture.debugElement.query(By.css('#flip-btn'));
    flipButtonDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();
    let correctButtonDebugElement = fixture.debugElement.query(By.css('#correct-answer-btn'));
    correctButtonDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(apiServiceSpy.updateCardWeightBasedOnUserAnswer).toHaveBeenCalledTimes(1);
    expect(isLastAnswerCorrect).toBeTrue();
    expect(lastUpdatedDeckID).toEqual(String(testDeckDetails.deckID));
    expect(lastUpdatedCardID).toEqual(testFirstRandomCard.cardID);
  });

  it('should call apiService once with isCorrectAnswer==false when Incorrect Button is clicked', () => {
    let flipButtonDebugElement = fixture.debugElement.query(By.css('#flip-btn'));
    flipButtonDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();
    let incorrectButtonDebugElement = fixture.debugElement.query(By.css('#incorrect-answer-btn'));
    incorrectButtonDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(apiServiceSpy.updateCardWeightBasedOnUserAnswer).toHaveBeenCalledTimes(1);
    expect(isLastAnswerCorrect).toBeFalse();
    expect(lastUpdatedDeckID).toEqual(String(testDeckDetails.deckID));
    expect(lastUpdatedCardID).toEqual(testFirstRandomCard.cardID);
  });

  it('should call apiService onceto reset the weights when Reset Button is clicked', () => {
    let flipButtonDebugElement = fixture.debugElement.query(By.css('#flip-btn'));
    flipButtonDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();
    let resetButtonDebugElement = fixture.debugElement.query(By.css('#reset-weights-btn'));
    resetButtonDebugElement.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(apiServiceSpy.resetDeckWeights).toHaveBeenCalledTimes(1);
  });
});
