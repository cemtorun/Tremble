import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PatientDashboardComponent } from './patient-dashboard/patient-dashboard.component';
import { PatientsComponent } from './patients/patients.component';
import { PatientDetailComponent } from './patient-detail/patient-detail.component';

const routes: Routes = [
  { path: '', redirectTo: '/patient-dashboard', pathMatch: 'full' },
  { path: 'patient-dashboard', component: PatientDashboardComponent },
  { path: 'detail/:id', component: PatientDetailComponent },
  { path: 'patients', component: PatientsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
