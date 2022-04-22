import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCardComponent } from './components/add-card/add-card.component';
import { CreateDeckComponent } from './components/create-deck/create-deck.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EditCardComponent } from './components/edit-card/edit-card.component';
import { EditDeckComponent } from './components/edit-deck/edit-deck.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { StudyAdaptiveComponent } from './components/study-adaptive/study-adaptive.component';
import { StudyRegularComponent } from './components/study-regular/study-regular.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignUpComponent
  },
  {
      path: 'studyregular/:deckId',
      component: StudyRegularComponent
  },
  {
      path: 'studyadaptive/:deckId',
      component: StudyAdaptiveComponent
  },
  {
    path: 'editdeck/:deckId',
    component: EditDeckComponent
  },
  {
    path: 'addcard/:deckId',
    component: AddCardComponent
  },
  {
    path: 'editdeck/:deckId/:cardId',
    component: EditCardComponent
  },
  {
    path: 'createdeck',
    component: CreateDeckComponent
  },
  {
    path: '',
    component: HomeComponent
  },
  {
      path: '**',
      component: NotFoundComponent,
      pathMatch: 'full'
  }
  ];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
