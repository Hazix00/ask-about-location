import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialDesignModule } from './material-design.module';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout'
import { ReactiveFormsModule } from '@angular/forms'

import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { initializeKeycloak } from './init/keycloak-init.factory';
import { QuestionItemComponent } from './components/question-item/question-item.component';
import { SearchComponent } from './components/search/search.component';
import { QuestionListComponent } from './components/question-list/question-list.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    QuestionItemComponent,
    SearchComponent,
    QuestionListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    KeycloakAngularModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialDesignModule,
    FlexLayoutModule,
    ReactiveFormsModule,
  ],
  providers: [{
    provide: APP_INITIALIZER,
    useFactory: initializeKeycloak,
    multi: true,
    deps: [KeycloakService]
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
