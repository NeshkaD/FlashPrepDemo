import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-study-adaptive',
  templateUrl: './study-adaptive.component.html',
  styleUrls: ['./study-adaptive.component.scss']
})
export class StudyAdaptiveComponent implements OnInit {

  deckId: string | null;
  deckName: string | null;
  currentCardObj: any;
  isCardFrontShowing: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
    ) { 
    this.deckId = '';
    this.deckName = ''
    this.isCardFrontShowing = true;
  }

  ngOnInit(): void {
    if (!this.apiService.getLoggedInUser()) {
      this.router.navigate(['/login']);
    }
    this.deckId = this.activatedRoute.snapshot.paramMap.get('deckId');
    console.log(`studying deckId ${this.deckId} in adaptive study mode`);
    this.displayNextCard();

    this.apiService.getDeckDetails(this.deckId).subscribe(data => this.deckName = data.deckName);
  }

  displayNextCard(): void {
    this.apiService.getNextCardByWeightedProbability(this.deckId).subscribe(
      data => {
        console.log(`Got card: ${JSON.stringify(data)}`);
        this.currentCardObj = data;
        this.isCardFrontShowing = true;
      },
      err => {
        console.log(`Failed to get deck with ID ${this.deckId}. Error: ${err}`); // TODO: handle error in UI
      }
    );
  }

  onClickNextButton(event: any): void {
    console.log('Next button clicked. Executing onClickNextButton');
    this.displayNextCard();
  }

  onClickFlipButton(event: any): void {
    console.log('Flip button clicked. Executing onClickFlipButton');
    this.isCardFrontShowing = !this.isCardFrontShowing;
  }

  onClickCorrectButton(event: any): void {
    console.log('Correct button clicked');
    this.apiService.updateCardWeightBasedOnUserAnswer(this.deckId, this.currentCardObj.cardID, true).subscribe(
      () => {
        console.log('Server accepted correct answer');
        this.displayNextCard();
      },
      err => {
        console.log(`Server failed to acknowledge correct answer. Error: ${err}`); // TODO: handle error in UI
      }
    );
  }

  onClickIncorrectButton(event: any): void {
    console.log('Incorrect button clicked');
    this.apiService.updateCardWeightBasedOnUserAnswer(this.deckId, this.currentCardObj.cardID, false).subscribe(
      () => {
        console.log('Server accepted incorrect answer');
        this.displayNextCard();
      },
      err => {
        console.log(`Server failed to acknowledge incorrect answer. Error: ${err}`); // TODO: handle error in UI
      }
    );
  }

  onClickResetWeightButton(event: any): void {
    console.log('Reset weight button clicked');
    this.apiService.resetDeckWeights(this.deckId).subscribe(
      () => {
        console.log(`Server reset the weights in deck with ID ${this.deckId}`);
      },
      err => {
        console.log(`Server failed to reset the card weights in deck with ID ${this.deckId}. Error: ${err}`); // TODO: handle error in UI
      }
    );
  }
}
