import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router'; // Import ActivatedRoute
import { Component } from '@angular/core';

// Mock Modal Component
@Component({
  selector: 'app-modal', // Adjust the selector accordingly
  template: ''
})
class MockModalComponent {}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockRouter: any;
  let mockAuthService: any;

  beforeEach(async () => {
    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    mockAuthService = {
      setToken: jasmine.createSpy('setToken'),
      isAdmin: jasmine.createSpy('isAdmin').and.returnValue(false),
      isPatient: jasmine.createSpy('isPatient').and.returnValue(false),
      isDoctor: jasmine.createSpy('isDoctor').and.returnValue(true)
    };

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, LoginComponent],
      declarations: [], // Include your mock component here
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService },
        { provide: ActivatedRoute, useValue: {} } // Provide a mock for ActivatedRoute
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize loginObj with empty username and password', () => {
    expect(component.loginObj.username).toBe('');
    expect(component.loginObj.password).toBe('');
  });

  it('should call onLogin and navigate on successful login', () => {
    spyOn(component.http, 'post').and.returnValue(of('fake-token'));

    component.loginObj = { username: 'validUser ', password: 'validPassword' };
    component.onLogin();

    expect(component.http.post).toHaveBeenCalledWith(
      'https://localhost:5001/api/Users/login',
      component.loginObj,
      { responseType: 'text' as 'json' }
    );
    expect(mockAuthService.setToken).toHaveBeenCalledWith('fake-token');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/doctor']);
  });

  it('should show success alert on successful login', () => {
    spyOn(component.http, 'post').and.returnValue(of('fake-token'));
    spyOn(Swal, 'fire');

    component.loginObj = { username: 'admin ', password: '#Password0' };
    component.onLogin();

    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
      icon: 'success',
      title: 'Login efetuado com sucesso!',
      toast: true,
      position: 'top-end',
      timer: 3000,
      showConfirmButton: false
    }));
  });

  it('should show error alert on failed login', () => {
    spyOn(component.http, 'post').and.returnValue(throwError({ error: 'Unauthorized' }));
    spyOn(Swal, 'fire');

    component.loginObj = { username: 'invalidUser ', password: 'invalidPassword' };
    component.onLogin();

    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
      icon: 'error',
      title: 'Não foi possível efetuar Login...',
      toast: true,
      position: 'top-end',
      timer: 3000,
      showConfirmButton: false
    }));
  });
});