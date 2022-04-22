import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.scss']
})
export class AddCardComponent implements OnInit {
  cardFrontText: any;
  cardBackText: any;
  deckId: any;
  errorMessageFromServer: any;
  isCardInProgress: boolean;


  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
  ) { 
    this.cardFrontText = "";
    this.cardBackText = "";
    this.isCardInProgress = true;
  }

  ngOnInit(): void {
    if (!this.apiService.getLoggedInUser()) {
      this.router.navigate(['/login']);
    }
    this.deckId = this.activatedRoute.snapshot.paramMap.get('deckId');
  }

  onSubmit(): void {
    console.log(`AddCardComponent::onSubmit called with cardFrontText=${this.cardFrontText}, cardBackText=${this.cardBackText}`); // TODO: Delete this!
    let cardObject = {
      deckID: this.deckId,
      card: {
        cardFront: this.cardFrontText,
        cardBack: this.cardBackText
      }
    };
    console.log(cardObject);
    console.log(JSON.stringify(cardObject));
    this.apiService.createCard(cardObject).subscribe(
      data => {
        console.log(`Result of card creation is: ${JSON.stringify(data)}`);
        if(data.success) {
          this.isCardInProgress = false;
          this.errorMessageFromServer = "";
        } else {
          this.errorMessageFromServer = data.error;
        }              
      },
      err => {
        console.log(`Card creation failed with error: ${err}`);
        this.errorMessageFromServer = 'Failed to reach server. Please check your connection.'
      }
    );
  }

  onDone(): void {
    this.router.navigate([`/editdeck/${this.deckId}`]);
  }

  onAddAnotherCard(): void {
    this.isCardInProgress = true;
  }

}
