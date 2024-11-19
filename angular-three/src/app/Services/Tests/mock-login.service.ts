import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MockLoginService {

  // Mock implementation of postLogin
  postLogin(loginObj: any): Observable<string> {
    if (loginObj.username === 'admin' && loginObj.password === '#Password0') {
      return of('fake-token');  // Simulate success
    } else {
      return throwError({ error: 'Unauthorized' });  // Simulate error
    }
  }
}
