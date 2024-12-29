import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MockSweetAlertService {
  sweetSuccess = jasmine.createSpy('sweetSuccess');
  sweetWarning = jasmine.createSpy('sweetWarning');
  sweetErro = jasmine.createSpy('sweetErro');
}

