import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Patient } from '../shared/patient';
import { PatientService } from '../services/patient.service';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent implements OnInit {
  patients: Patient[];
  selectedPatient: Patient;
  addingPatient = false;
  error: any;
  showNgFor = false;

  constructor(private router: Router, private patientService: PatientService) {}

  getPatients(): void {
    this.patientService
      .getPatients()
      .subscribe(
        patients => (this.patients = patients),
        error => (this.error = error)
      )
  }

  addPatient(): void {
    this.addingPatient = true;
    this.selectedPatient = null;
  }

  close(savedPatient: Patient): void {
    this.addingPatient = false;
    if (savedPatient) {
      this.getPatients();
    }
  }

  deletePatient(patient: Patient, event: any): void {
    event.stopPropagation();
    this.patientService.delete(patient).subscribe(res => {
      this.patients = this.patients.filter(h => h !== patient);
      if (this.selectedPatient === patient) {
        this.selectedPatient = null;
      }
    }, error => (this.error = error));
  }

  ngOnInit(): void {
    this.getPatients();
  }

  onSelect(patient: Patient): void {
    this.selectedPatient = patient;
    this.addingPatient = false;
  }

  gotoDetail(): void {
    this.router.navigate(['/detail', this.selectedPatient.id]);
  }
}
