describe('Login Page', () => {
  it('should display the login form', () => {
    cy.visit('http://localhost:4200/login');

    cy.contains('Login');
    cy.get('input[name="username"]').should('exist');
    cy.get('input[name="password"]').should('exist');
    cy.get('button.login__submit').should('exist');
    cy.get('button.google-login-btn').should('exist');
  });
});

describe('Login Page', () => {
  it('should display the login form', () => {
    cy.visit('http://localhost:4200/login');

    cy.contains('Login');
    cy.get('input[name="username"]').should('exist');
    cy.get('input[name="password"]').should('exist');
    cy.get('button.login__submit').should('exist');
    cy.get('button.google-login-btn').should('exist');
  });
});

describe('App Redirection', () => {
  it('should redirect to /login', () => {
    cy.visit('http://localhost:4200');
    cy.url().should('include', '/login');
  });
});

describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/login');
  });

  it('should display the login form', () => {
    cy.contains('Login');
    cy.get('input[name="username"]').should('exist');
    cy.get('input[name="password"]').should('exist');
    cy.get('button.login__submit').should('exist');
    cy.get('button.google-login-btn').should('exist');
  });

  it('should show an error message with invalid credentials', () => {
    cy.intercept('POST', '/api/login', { statusCode: 401, body: { message: 'Unauthorized' } }).as('postLogin');

    cy.get('input[name="username"]').type('invalidUser ');
    cy.get('input[name="password"]').type('invalidPassword');
    cy.get('button.login__submit').click();

    cy.wait(500);

    // Verify that the error alert is shown
    cy.get('.swal2-container').should('contain', 'Não foi possível efetuar Login...');
  });

  it('should redirect to the appropriate page based on user role', () => {
    // Mocking the response for an admin user
    cy.intercept('POST', '/api/login', { statusCode: 200, body: { token: 'auth-token', role: 'admin' } }).as('postLogin');

    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('#Password0');
    cy.get('button.login__submit').click();

    cy.wait(500);

    // Verify that the user is redirected to the admin page
    cy.url().should('include', '/admin');


    cy.visit('http://localhost:4200/login');

    // Mocking the response for a patient user
    cy.intercept('POST', '/api/login', { statusCode: 200, body: { token: 'fake-jwt-token', role: 'patient' } }).as('postLogin');

    cy.get('input[name="username"]').clear().type('patient');
    cy.get('input[name="password"]').clear().type('#Password0');
    cy.get('button.login__submit').click();

    cy.wait(500);

    // Verify that the user is redirected to the patient page
    cy.url().should('include', '/patient');


    cy.visit('http://localhost:4200/login');

    // Mocking the response for a doctor user
    cy.intercept('POST', '/api/login', { statusCode: 200, body: { token: 'fake-jwt-token', role: 'doctor' } }).as('postLogin');

    cy.get('input[name="username"]').clear().type('doctor');
    cy.get('input[name="password"]').clear().type('#Password0');
    cy.get('button.login__submit').click();

    cy.wait(500);

    // Verify that the user is redirected to the doctor page
    cy.url().should('include', '/doctor');
  });
});

describe('Login Page Form Validation', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/login'); // Adjust the URL if necessary
  });

  it('should display an error message if login without email', () => {
    cy.get('input[name="password"]').type('"#Password0"');
    cy.get('button.login__submit').click();

    cy.get('.swal2-container').should('contain', 'Não foi possível efetuar Login...');
  });

  it('should display an error message if login without password', () => {
    cy.get('input[name="username"]').type('admin');
    cy.get('button.login__submit').click();

    cy.get('.swal2-container').should('contain', 'Não foi possível efetuar Login...');
  });
});


describe('App Redirection', () => {
  it('should redirect to /login when accessing the root URL', () => {
    cy.visit('http://localhost:4200');
    cy.url().should('include', '/login');
  });
});
