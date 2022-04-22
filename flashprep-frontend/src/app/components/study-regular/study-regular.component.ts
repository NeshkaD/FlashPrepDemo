import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-study-regular',
  templateUrl: './study-regular.component.html',
  styleUrls: ['./study-regular.component.scss']
})
export class StudyRegularComponent implements OnInit {
  deck: any;
  currentPositionInDeck: number;
  isCardFrontShowing: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
    ) {
    this.isCardFrontShowing = true;
    this.currentPositionInDeck = 0;
  }

  ngOnInit(): void {
    if (!this.apiService.getLoggedInUser()) {
      this.router.navigate(['/login']);
    }
    let deckId = this.activatedRoute.snapshot.paramMap.get('deckId');
    console.log(`studying deckId ${deckId} in regular study mode`);
    this.apiService.getDeckDetails(deckId).subscribe(
      data => {
        console.log(`Got deck: ${JSON.stringify(data)}`);
        this.deck = data;
      },
      err => {
        console.log(`Failed to get deck with ID ${deckId}. Error: ${err}`);
      }
    );
  }

  onClickFlipButton(event: any): void {
    console.log('Flip button clicked. Executing onClickFlipButton');
    this.isCardFrontShowing = !this.isCardFrontShowing;
  }

  onClickNextButton(event: any): void {
    console.log('Next button clicked. Executing onClickNextButton');
    this.isCardFrontShowing = true;
    this.currentPositionInDeck = (this.currentPositionInDeck + 1) % this.deck.deckCardCount;
  }

}
