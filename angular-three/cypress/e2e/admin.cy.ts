/// <reference types="cypress" />

describe('Admin', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/login');

    cy.intercept('POST', '/api/login', { statusCode: 200, body: { token: 'fake-jwt-token', role: 'admin' } }).as('postLogin');

    cy.get('input[name="username"]').clear().type('admin');
    cy.get('input[name="password"]').clear().type('#Password0');
    cy.get('button.login__submit').click();

    cy.wait(500);

    cy.url().should('include', '/admin');

    cy.visit('http://localhost:4200/admin');
  });

  describe('Admin', () => {
    beforeEach(() => {
      // Log in as an admin user first
      cy.visit('http://localhost:4200/login');
      cy.intercept('POST', '/api/login', { statusCode: 200, body: { token: 'fake-jwt-token', role: 'admin' } }).as('postLogin');
      cy.get('input[name="username"]').clear().type('admin');
      cy.get('input[name="password"]').clear().type('#Password0');
      cy.get('button.login__submit').click();
      cy.wait(500);
      cy.url().should('include', '/admin');
    });
  
    /*it('should allow creating a new operation type', () => {
      // Visit the page and ensure the modal button is visible
      cy.visit('http://localhost:4200/admin');
  
      // Open the modal to create a new operation type
      cy.get('.selectionDiv').contains('Create Operation Type').click();
  
      // Ensure the modal is visible before interacting with it
      cy.get('#createOperationTypeModal', { timeout: 10000 }).should('be.visible');
  
      // Test the "Add Staff" button functionality
      cy.get('.staff-entry') // Ensure this targets the correct parent element
      .contains('Add Staff')  // Targeting the button by its text
      .click();  

      //cy.get('input[name="quantity_0"]').should('exist');  // Should exist after clicking "Add Staff"
      //cy.get('select[name="specialization_0"]').should('exist');
      //cy.get('select[name="role_0"]').should('exist');

      //cy.get('input[name="quantity_0"]').clear().type('2');
      //cy.get('select[name="specialization_0"]').select('SURGERY');
      //cy.get('select[name="role_0"]').select('DOCTOR');


    });*/
  });
});