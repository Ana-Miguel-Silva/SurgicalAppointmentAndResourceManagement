import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router'; 
import { MockLoginService } from '../../Services/Tests/mock-login.service';
import { LoginService } from '../../Services/login.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockRouter: any;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockLoginService: jasmine.SpyObj<LoginService>;

  beforeEach(async () => {
    mockRouter = {
      navigate: jasmine.createSpy('navigate'),
    };

    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['']);


    mockLoginService = jasmine.createSpyObj<LoginService>('LoginService', ['postLogin']);
    mockAuthService = jasmine.createSpyObj<AuthService>('AuthService', ['setToken', 'isAdmin', 'isPatient', 'isDoctor']);
   
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, LoginComponent],
      declarations: [],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AuthService, useValue: mockAuthService  },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: LoginService, useValue: mockLoginService }, 
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  beforeEach(() => {
    mockLoginService.postLogin.and.returnValue(of('fake-token'));
    mockAuthService.setToken.calls.reset();
    mockRouter.navigate.calls.reset();    
    mockLoginService.postLogin.calls.reset();
  });

  it('should call onLogin Admin and navigate on successful login', () => {

    mockAuthService.isAdmin.and.returnValue(true);

    component.loginObj = { username: 'admin', password: '#Password0' };
    component.onLogin();

    expect(mockLoginService.postLogin).toHaveBeenCalledWith(component.loginObj);
    expect(mockAuthService.setToken).toHaveBeenCalledWith('fake-token');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/admin']);
  });

  it('should call onLogin Patient and navigate on successful login', () => {
    mockAuthService.isPatient.and.returnValue(true);
    
    component.loginObj = { username: 'patient', password: '#Password0' };
    component.onLogin();

    expect(mockLoginService.postLogin).toHaveBeenCalledWith(component.loginObj);
    expect(mockAuthService.setToken).toHaveBeenCalledWith('fake-token');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/patient']);
  });

  it('should call onLogin Doctor and navigate on successful login', () => {

    mockAuthService.isDoctor.and.returnValue(true);
    
    component.loginObj = { username: 'admin', password: '#Password0' };
    component.onLogin();

    expect(mockLoginService.postLogin).toHaveBeenCalledWith(component.loginObj);
    expect(mockAuthService.setToken).toHaveBeenCalledWith('fake-token');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/doctor']);
  });

  it('should show success alert on successful login', fakeAsync(() => {
    spyOn(Swal, 'fire');

    component.loginObj = { username: 'admin', password: '#Password0' };
    component.onLogin();
    tick();

    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
      icon: 'success',
      title: 'Login efetuado com sucesso!',
      toast: true,
      position: 'top-end',
      timer: 3000,
      showConfirmButton: false,
    }));
  }));

  it('should show error alert on failed login', () => {
    // Simulate login failure.
    mockLoginService.postLogin.and.returnValue(throwError(() => new Error('Invalid credentials')));
    spyOn(Swal, 'fire');

    component.loginObj = { username: 'invalidUser', password: 'invalidPassword' };
    component.onLogin();

    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
      icon: 'error',
      title: 'Não foi possível efetuar Login...',
      toast: true,
      position: 'top-end',
      timer: 3000,
      showConfirmButton: false,
    }));
  });
});
