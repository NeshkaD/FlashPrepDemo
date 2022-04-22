import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { StudyRegularComponent } from './components/study-regular/study-regular.component';
import { StudyAdaptiveComponent } from './components/study-adaptive/study-adaptive.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { FormsModule } from '@angular/forms';
import { ApiService } from './services/api.service';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EditDeckComponent } from './components/edit-deck/edit-deck.component';
import { CreateDeckComponent } from './components/create-deck/create-deck.component';
import { AddCardComponent } from './components/add-card/add-card.component';
import { EditCardComponent } from './components/edit-card/edit-card.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    StudyRegularComponent,
    StudyAdaptiveComponent,
    NavigationComponent,
    HomeComponent,
    NotFoundComponent,
    LoginComponent,
    SignUpComponent,
    EditDeckComponent,
    CreateDeckComponent,
    AddCardComponent,
    EditCardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
