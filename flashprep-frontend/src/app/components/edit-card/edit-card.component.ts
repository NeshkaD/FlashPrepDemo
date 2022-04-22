import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-edit-card',
  templateUrl: './edit-card.component.html',
  styleUrls: ['./edit-card.component.scss']
})
export class EditCardComponent implements OnInit {
  cardFrontText: any;
  cardBackText: any;
  card: any;
  deckId: any;
  errorMessageFromServer: any;
  isCardFound: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
  ) { 
    this.cardFrontText = "";
    this.cardBackText = "";
    this.isCardFound = true;
  }

  ngOnInit(): void {
    if (!this.apiService.getLoggedInUser()) {
      this.router.navigate(['/login']);
    }
    this.deckId = this.activatedRoute.snapshot.paramMap.get('deckId');
    let cardId = this.activatedRoute.snapshot.paramMap.get('cardId');

    this.apiService.getDeckDetails(this.deckId).subscribe(
      data => {
        console.log(`Got deck: ${JSON.stringify(data)}`);
        this.card = null;
        for (let card of data.cards) {
          if (card.cardID == cardId) {
            this.card = card;
            this.cardFrontText = card.cardFront;
            this.cardBackText = card.cardBack;
            this.isCardFound = true;
          }
        }
        if (!this.isCardFound) {
          this.errorMessageFromServer = `Card with ID ${cardId} does not exist in deck with ID ${this.deckId}!`;
        }
      },
      err => {
        console.log(`Failed to get deck with ID ${this.deckId}. Error: ${err}`);
      }
    );
  }

  onClickUpdate(): void {
    this.card.cardFront = this.cardFrontText;
    this.card.cardBack = this.cardBackText;
    this.apiService.updateCard(this.card).subscribe(
      data => {
        console.log(`Result of card edit is: ${JSON.stringify(data)}`);
        if(data.success) {
          this.errorMessageFromServer = "";
          this.router.navigate([`/editdeck/${this.deckId}`]);
        } 
        else {
          this.errorMessageFromServer = data.error;
        }              
      },
      err => {
        console.log(`Card edit failed with error: ${err}`);
        this.errorMessageFromServer = 'Failed to reach server. Please check your connection.'
      }
    );
  }

  onClickCancel(): void {
    this.router.navigate([`/editdeck/${this.deckId}`]);
  }

}
