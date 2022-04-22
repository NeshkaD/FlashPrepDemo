import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-create-deck',
  templateUrl: './create-deck.component.html',
  styleUrls: ['./create-deck.component.scss']
})
export class CreateDeckComponent implements OnInit {
  fileToUpload: File | null = null;
  cards: any[];
  deckName: any;
  deckDescription: any;
  errorMessageFromServer: any;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) { 
    this.cards = [];
    this.errorMessageFromServer = "";
  }

  ngOnInit(): void {
    if (!this.apiService.getLoggedInUser()) {
      this.router.navigate(['/login']);
    }
  }

  onFileSelection(event: any) {
    let input = (event.target as HTMLInputElement);
    let file;
    let text = "";
    let fReader = new FileReader();
    if (input.files != null) {
      file = input.files[0];
      fReader.readAsText(file);
    }
    
    fReader.onload = (e) => {
      let result = fReader.result;
      if(result != null) {
        this.processCsvString(result.toString());
      }
      else {
        console.log("An error occurred: The file is empty.")
      }
    };

    fReader.onerror = (e) => {
      console.log("An error occurred during file upload. Please try again.");
    };
  }

  processCsvString(csvString: string) {
    this.cards = [];
    let lines = csvString.split(/\r?\n/);
    for(let i = 0; i < lines.length; i++) {
      if(lines[i] && lines[i].includes(",")){
        let lineArr = lines[i].split(',');
      let cardObj = {
        cardFront: lineArr[0].trim(),
        cardBack: lineArr[1].trim()
      }
      this.cards.push(cardObj);
      }     
    }
    console.log(this.cards);
  }

  onSubmit(): void {
    console.log(`CreateDeckComponent::onSubmit called with deckName=${this.deckName}, deckDescription=${this.deckDescription}`); // TODO: Delete this!
    let deckObject = {
      deckName: this.deckName,
      deckDescription: this.deckDescription,
      userID: this.apiService.getLoggedInUser(),
      cards: this.cards
    }
    console.log(deckObject);
    console.log(JSON.stringify(deckObject));
    this.apiService.createDeck(deckObject).subscribe(
      data => {
        console.log(`Result of deck creation is: ${JSON.stringify(data)}`);
        if(data.success) {
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessageFromServer = data.error;
        }              
      },
      err => {
        console.log(`Sign up failed with error: ${err}`);
        this.errorMessageFromServer = 'Failed to reach server. Please check your connection.'
      }
    );
  }
}
