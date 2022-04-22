import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-edit-deck',
  templateUrl: './edit-deck.component.html',
  styleUrls: ['./edit-deck.component.scss']
})
export class EditDeckComponent implements OnInit {
  deck: any;
  activeModal: any
  cardToBeDeleted: any

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private ngbModal: NgbModal,
    private router: Router
  ) { 
    this.activeModal = null;
    this.cardToBeDeleted = null;
  }

  ngOnInit(): void {
    if (!this.apiService.getLoggedInUser()) {
      this.router.navigate(['/login']);
    }
    let deckId = this.activatedRoute.snapshot.paramMap.get('deckId');
    console.log(`editing deck with ID ${deckId}`);
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

  openModal(template: any) {
    this.activeModal = this.ngbModal.open(template, {ariaLabelledBy: 'modal-basic-title'});
    this.activeModal.result.then(
      (result: any) => {
      console.log(`Modal finished use. Result was: ${result}`); // TODO: remove if result not needed
    }, 
    (reason: any) => {
      console.log(`Modal closed. Reason was: ${reason}`); // TODO: remove if modal closure reason not needed
    });
  }

  onClickAddButton(event: any): void {
    console.log("Add button clicked!")
    this.router.navigate([`/addcard/${this.deck.deckID}`]);   
  }

  onClickDeleteButton(event: any, card: any, popover: any): void {
    console.log("Delete button clicked!")
    this.cardToBeDeleted = card;
    this.openModal(popover);
  }

  onClickConfirmDeleteButton(event: any) {
    console.log(this.cardToBeDeleted);
    this.apiService.deleteCard(this.cardToBeDeleted.cardID).subscribe(
      data => {
        if(data.success) {
          console.log(`Successfully deleted card with ID ${this.cardToBeDeleted.cardID}. Result: ${data}`)
        }
        else {
          console.log(`Could not delete card with ID ${this.cardToBeDeleted.cardID}. Error: ${data.error}`)
        }
        // update the UI so that the deleted card no longer appears:
        this.apiService.getDeckDetails(this.deck.deckID).subscribe(
          data => {
            console.log(`Got deck: ${JSON.stringify(data)}`);
            this.deck = data;
          },
          err => {
            console.log(`Failed to get deck with ID ${this.deck.deckID}. Error: ${err}`);
          }
        );
      },
      err => {
        console.log(`Failed to delete deck with ID ${this.deck.deckID}. Error: ${err}`);
      }
    );
    this.activeModal.close();
  }

  onClickEditCardButton(event: any, card: any): void {
    console.log(`Edit card button clicked for card with id: ${card.cardID}`);
    this.router.navigate([`/editdeck/${this.deck.deckID}/${card.cardID}`]); // append the cardID to the end of the URL and navigate there.
  }
}
