import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

let baseUrl = 'http://localhost:8080'

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  loggedInUser: any
  
  

  constructor(private http: HttpClient) {
    this.loggedInUser = null;
  }

  login(username: any, password: any) : Observable<any> {
    return this.http.post(`${baseUrl}/auth`, {username: username, password: password});
  }

  signUp(username: any, email: any, password: any) : Observable<any> {
    return this.http.post(`${baseUrl}/user`, {username: username, email: email, password: password});
  }

  getDecksByUserId(userId: any) : Observable<any> {
    return this.http.get(`${baseUrl}/user/${userId}/decks`);
  }

  getDeckDetails(deckId: any): Observable<any> {
    return this.http.get(`${baseUrl}/deck/${deckId}`);
  }

  getNextCardByWeightedProbability(deckId: any): Observable<any> {
    return this.http.get(`${baseUrl}/deck/${deckId}/card`);
  }

  updateCardWeightBasedOnUserAnswer(deckId: any, cardId: any, isCorrectAnswer: boolean): Observable<any> {
    return this.http.put(`${baseUrl}/deck/${deckId}/${cardId}`, {isCorrect: isCorrectAnswer});
  }

  resetDeckWeights(deckId: any): Observable<any>  {
    return this.http.put(`${baseUrl}/deck/${deckId}/reset`, {});
  }

  deleteDeck(deckId: any): Observable<any> {
    return this.http.delete(`${baseUrl}/deck/${deckId}/delete`)
  }

  createDeck(deckObj: any): Observable<any> {
    return this.http.post(`${baseUrl}/deck`, deckObj);
  }

  createCard(cardObj: any): Observable<any> {
    return this.http.post(`${baseUrl}/card`, cardObj);
  }

  getCardById(cardId: any) : Observable<any> {
    return this.http.get(`${baseUrl}/card/${cardId}`);
  }

  deleteCard(cardId: any): Observable<any> {
    return this.http.delete(`${baseUrl}/card/${cardId}`);
  }

  updateCard(cardObj: any): Observable<any> {
    return this.http.put(`${baseUrl}/card`, cardObj);
  }

  setLoggedInUser(userId: any): void {
    this.loggedInUser = userId;
  }

  getLoggedInUser(): any {
    return this.loggedInUser;
  }
}
