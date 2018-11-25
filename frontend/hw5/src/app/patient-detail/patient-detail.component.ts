import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Patient } from '../shared/patient';
import { PatientService } from '../services/patient.service';

@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.css']
})
export class PatientDetailComponent implements OnInit {
  @Input() patient: Patient;
  @Output() close = new EventEmitter();
  error: any;
  navigated = false; // true if navigated here

  constructor(
    private patientService: PatientService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      if (params['id'] !== undefined) {
        const id = +params['id'];
        this.navigated = true;
        this.patientService.getPatient(id).subscribe(patient => (this.patient = patient));
      } else {
        this.navigated = false;
        this.patient = new Patient();
      }
    });
  }

  save(): void {
    this.patientService.save(this.patient).subscribe(patient => {
      this.patient = patient; // saved patient, w/ id if new
      this.goBack(patient);
    }, error => (this.error = error)); // TODO: Display error message
  }

  goBack(savedPatient: Patient = null): void {
    this.close.emit(savedPatient);
    if (this.navigated) {
      window.history.back();
    }
  }
}
