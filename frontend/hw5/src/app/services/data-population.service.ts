import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class DataPopulationService {

  constructor(private http:HttpClient) {}

  getFrequencyData() : Observable<any> {
  	return this.http.get("https://brian1999lin.lib.id/hackwestern5@dev/");
  }

  getResultData() : Observable<any> {
  	return this.http.get("https://brian1999lin.lib.id/hackwestern5@dev/result/");
  }
}
