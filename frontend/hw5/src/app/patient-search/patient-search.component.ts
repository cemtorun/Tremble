import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, of } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  switchMap
} from 'rxjs/operators';
import { Patient } from '../shared/patient';
import { PatientSearchService } from '../services/patient-search.service';

@Component({
  selector: 'app-patient-search',
  templateUrl: './patient-search.component.html',
  styleUrls: ['./patient-search.component.css'],
  providers: [PatientSearchService]
})
export class PatientSearchComponent implements OnInit {
  patients: Observable<Patient[]>;
  private searchTerms = new Subject<string>();

  constructor(
    private patientSearchService: PatientSearchService,
    private router: Router
  ) {}

  search(term: string): void {
    // Push a search term into the observable stream.
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.patients = this.searchTerms.pipe(
      debounceTime(300), // wait for 300ms pause in events
      distinctUntilChanged(), // ignore if next search term is same as previous
      switchMap(
        term =>
          term // switch to new observable each time
            ? // return the http search observable
              this.patientSearchService.search(term)
            : // or the observable of empty patients if no search term
              of<Patient[]>([])
      ),
      catchError(error => {
        // TODO: real error handling
        console.log(`Error in component ... ${error}`);
        return of<Patient[]>([]);
      })
    );
  }

  gotoDetail(patient: Patient): void {
    const link = ['/detail', patient.id];
    this.router.navigate(link);
  }
}
