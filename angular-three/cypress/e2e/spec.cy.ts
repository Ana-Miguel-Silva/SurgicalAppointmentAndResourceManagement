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

  it('should login successfully with valid credentials', () => {
    cy.intercept('POST', '/api/login', { statusCode: 200, body: { token: 'fake-jwt-token' } }).as('postLogin');

    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('#Password0');
    cy.get('button.login__submit').click();

    cy.wait(500);
    cy.wait('@postLogin');

    // Verify that the success alert is shown
    cy.get('.swal2-container').should('contain', 'Login efetuado com sucesso!');

    // Verify that the user is redirected based on their role
    cy.url().should('include', '/admin'); // Change '/admin' to the expected role-based URL
  });

  it('should show an error message with invalid credentials', () => {
    cy.intercept('POST', '/api/login', { statusCode: 401, body: { message: 'Unauthorized' } }).as('postLogin');

    cy.get('input[name="username"]').type('invalidUser ');
    cy.get('input[name="password"]').type('invalidPassword');
    cy.get('button.login__submit').click();

    cy.wait(500);
    cy.wait('@postLogin');

    // Verify that the error alert is shown
    cy.get('.swal2-container').should('contain', 'Não foi possível efetuar Login...');
  });

  it('should redirect to the appropriate page based on user role', () => {
    // Mocking the response for an admin user
    cy.intercept('POST', '/api/login', { statusCode: 200, body: { token: 'fake-jwt-token', role: 'admin' } }).as('postLogin');

    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('#Password0');
    cy.get('button.login__submit').click();

    cy.wait(500);
    cy.wait('@postLogin');

    // Verify that the user is redirected to the admin page
    cy.url().should('include', '/admin');

    // Mocking the response for a patient user
    cy.intercept('POST', '/api/login', { statusCode: 200, body: { token: 'fake-jwt-token', role: 'patient' } }).as('postLogin');

    cy.get('input[name="username"]').clear().type('patient');
    cy.get('input[name="password"]').clear().type('#Password0');
    cy.get('button.login__submit').click();

    cy.wait('@postLogin');

    // Verify that the user is redirected to the patient page
    cy.url().should('include', '/patient');

    // Mocking the response for a doctor user
    cy.intercept('POST', '/api/login', { statusCode: 200, body: { token: 'fake-jwt-token', role: 'doctor' } }).as('postLogin');

    cy.get('input[name="username"]').clear().type('doctor');
    cy.get('input[name="password"]').clear().type('#Password0');
    cy.get('button.login__submit').click();

    cy.wait(500);
    cy.wait('@postLogin');

    // Verify that the user is redirected to the doctor page
    cy.url().should('include', '/doctor');
  });
});

describe('App Redirection', () => {
  it('should redirect to /login when accessing the root URL', () => {
    cy.visit('http://localhost:4200');
    cy.url().should('include', '/login');
  });
});