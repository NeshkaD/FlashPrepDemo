import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs/internal/observable/of';
import { ApiService } from 'src/app/services/api.service';

import { EditDeckComponent } from './edit-deck.component';

describe('EditDeckComponent', () => {
  let component: EditDeckComponent;
  let fixture: ComponentFixture<EditDeckComponent>;

  beforeEach(async () => {
    const testDeckDetails = {
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

    let apiServiceSpy = jasmine.createSpyObj('ApiService', ['getDeckDetails']);
    const getDecksDetailsSpy = apiServiceSpy.getDeckDetails.and.returnValue(of(testDeckDetails)); // return Observable using rxjs

    await TestBed.configureTestingModule({
      declarations: [ EditDeckComponent ],
      imports: [RouterTestingModule],
      providers: [{ provide: ApiService, useValue: apiServiceSpy }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDeckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
