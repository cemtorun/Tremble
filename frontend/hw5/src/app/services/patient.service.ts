import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Patient } from '../shared/patient';

@Injectable()
export class PatientService {
  private patientsUrl = 'app/patients'; // URL to web api

  constructor(private http: HttpClient) {}

  getPatients() {
    return this.http
      .get<Patient[]>(this.patientsUrl)
      .pipe(map(data => data), catchError(this.handleError));
  }

  getPatient(id: number): Observable<Patient> {
    return this.getPatients().pipe(
      map(patients => patients.find(patient => patient.id === id))
    );
  }

  save(patient: Patient) {
    if (patient.id) {
      return this.put(patient);
    }
    return this.post(patient);
  }

  delete(patient: Patient) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const url = `${this.patientsUrl}/${patient.id}`;

    return this.http.delete<Patient>(url).pipe(catchError(this.handleError));
  }

  // Add new Patient
  private post(patient: Patient) {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this.http
      .post<Patient>(this.patientsUrl, patient)
      .pipe(catchError(this.handleError));
  }

  // Update existing Patient
  private put(patient: Patient) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const url = `${this.patientsUrl}/${patient.id}`;

    return this.http.put<Patient>(url, patient).pipe(catchError(this.handleError));
  }

  private handleError(res: HttpErrorResponse | any) {
    console.error(res.error || res.body.error);
    return observableThrowError(res.error || 'Server error');
  }
}
