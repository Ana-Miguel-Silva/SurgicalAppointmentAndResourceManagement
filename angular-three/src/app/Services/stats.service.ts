// stats.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private statsUrl = 'http://51.120.112.94:4200/haproxy?stats'; // URL com a porta do HAProxy

  constructor(private http: HttpClient) {}

  getStats(): Observable<any> {
    return this.http.get(this.statsUrl);
  }
}