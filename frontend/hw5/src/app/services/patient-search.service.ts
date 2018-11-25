import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Patient } from '../shared/patient';

@Injectable()
export class PatientSearchService {
  constructor(private http: HttpClient) {}

  search(term: string): Observable<Patient[]> {
    return this.http
      .get<Patient[]>(`app/patient/?name=${term}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(res: HttpErrorResponse) {
    console.error(res.error);
    return observableThrowError(res.error || 'Server error');
  }
}
