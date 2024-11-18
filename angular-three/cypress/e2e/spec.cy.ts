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