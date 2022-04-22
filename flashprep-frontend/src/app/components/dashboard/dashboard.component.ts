import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  loggedInUser: any;
  decks: any;
  currentChosenDeck: any;
  activeModal: any

  constructor(
    private apiService: ApiService,
    private ngbModal: NgbModal,
    private router: Router
    ) {
      this.loggedInUser = null
      this.decks = null
      this.activeModal = null;
    }

  ngOnInit(): void {
    console.log(this.apiService.getLoggedInUser());
    if (!this.apiService.getLoggedInUser()) {
      this.router.navigate(['/login']);
    }
    this.loggedInUser = this.apiService.getLoggedInUser();
    this.apiService.getDecksByUserId(this.loggedInUser).subscribe(
      data => {
        console.log(`Got decks: ${JSON.stringify(data)}`);
        this.decks = data;
        
      },
      err => {
        console.log(`Failed to get decks for user ${this.loggedInUser}. Error: ${err}`);
      }
    );
  }

  openModal(template: any) {
    this.activeModal = this.ngbModal.open(template, {ariaLabelledBy: 'modal-basic-title'});
    this.activeModal.result.then((result: any) => {
      console.log(`Modal closed with result: ${result}`);
    }, (reason: any) => {
      console.log('Modal dismissed due to reason');
    });
  }

  onClickLearnButton(event: any, deck: any, popover: any): void {
    this.currentChosenDeck = deck;
    this.openModal(popover);
  }

  onClickDeleteButton(event: any, deck: any, popover: any): void {
    this.currentChosenDeck = deck;
    this.openModal(popover);
  }

  onClickConfirmDeleteButton(event: any): void {
    this.apiService.deleteDeck(this.currentChosenDeck.id).subscribe(
      data => {
        if(data.success) {
          console.log(`Successfully deleted deck with ID ${this.currentChosenDeck.id}. Result: ${data}`)
        }
        else {
          console.log(`Could not delete deck with ID ${this.currentChosenDeck.id}. Error: ${data.error}`)
        }        
        this.apiService.getDecksByUserId(this.loggedInUser).subscribe(
          data => {
            console.log(`Updated deck list: ${JSON.stringify(data)}`);
            this.decks = data;            
          },
          err => {
            console.log(`Could not update the list of decks for user with ID ${this.loggedInUser}. Error: ${err}`);
          }
        );        
      },
      err => {
        console.log(`Failed to delete deck with ID ${this.currentChosenDeck.id}. Error: ${err}`);
      }
    );
    this.activeModal.close();
  }

  onClickEditButton(event: any, deck: any): void {
    this.router.navigate(['/editdeck', deck.id]);
  }

  onClickCreateButton(event: any): void {
    this.router.navigate(['/createdeck']);
  }

  goToAdaptiveStudyMode(){
    this.activeModal.close();
    this.router.navigate(['/studyadaptive', this.currentChosenDeck.id]);
  }

  goToRegularStudyMode(){
    this.activeModal.close();
    this.router.navigate(['/studyregular', this.currentChosenDeck.id]);
  }
}
