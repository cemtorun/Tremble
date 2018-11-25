import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { HttpClientInMemoryWebApiModule, InMemoryDbService } from 'angular-in-memory-web-api';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api/in-memory-web-api.module';
import { InMemoryDataService } from './in-memory-data.service';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { PatientService } from './services/patient.service';
import { PatientDashboardComponent } from './patient-dashboard/patient-dashboard.component';
import { PatientsComponent } from './patients/patients.component';
import { PatientDetailComponent } from './patient-detail/patient-detail.component';
import { PatientSearchComponent } from './patient-search/patient-search.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { LoginScreenComponent } from './login-screen/login-screen.component';
import { TestPageComponent } from './test-page/test-page.component';
import { DataPopulationService } from './services/data-population.service';
import {MatDialogModule} from "@angular/material";
import { ResultsPopupComponent } from './test-page/results-popup/results-popup.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, {
      dataEncapsulation: false,
      delay: 300,
      passThruUnknownUrl: true
    }),
    MatDialogModule,
    BrowserAnimationsModule
  ],
  declarations: [
    AppComponent,
    PatientDashboardComponent,
    PatientSearchComponent,
    PatientsComponent,
    PatientDetailComponent,
    ToolbarComponent,
    LoginScreenComponent,
    TestPageComponent,
    ResultsPopupComponent,
  ],
  providers: [PatientService, DataPopulationService],
  bootstrap: [AppComponent],
  entryComponents: [ResultsPopupComponent]
})
export class AppModule { }
