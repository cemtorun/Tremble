import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Patient } from '../shared/patient';
import { PatientService } from '../services/patient.service';

@Component({
  selector: 'app-patient-dashboard',
  templateUrl: './patient-dashboard.component.html',
  styleUrls: ['./patient-dashboard.component.css']
})
export class PatientDashboardComponent implements OnInit {
  patients: Patient[] = [];

  constructor(
    private router: Router,
    private patientService: PatientService) {
  }

  ngOnInit(): void {
    this.patientService.getPatients()
      .subscribe(patients => this.patients = patients.slice(1, 5));
  }

  gotoDetail(patient: Patient): void {
    const link = ['/detail', patient.id];
    this.router.navigate(link);
  }
}