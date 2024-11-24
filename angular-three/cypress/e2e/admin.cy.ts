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
    it('should allow creating a new staff profile', () => {
      cy.visit('http://localhost:4200/admin');
      cy.get('.selectionDiv').contains('Register Staff Profile').click();
      cy.get('#registerStaffModal', { timeout: 10000 }).should('be.visible');
      
      cy.get('input[id="validationStaffName"]').should('exist'); 
      cy.get('input[id="validationStaffEmail"]').should('exist'); 
      cy.get('input[id="validationStaffPhone"]').should('exist'); 
      cy.get('input[id="validationStaffLicense"]').should('exist'); 
      cy.get('select[id="validationRole"]').should('exist');
      cy.get('select[id="validationSpecialization"]').should('exist');
      cy.get('input[id="validationStaffAvailabilityStart"]').should('exist');
      cy.get('input[id="validationStaffAvailabilityEnd"]').should('exist');
      cy.get('span[id="add"]').should('exist');
      cy.get('button[id="staffCreateSubmit"]').should('exist');
      
      cy.get('input[id="validationStaffName"]').type('Samael Quercus Ilex'); 
      cy.get('input[id="validationStaffEmail"]').clear().type('samaquerilex@fakemail.com'); 
      cy.get('input[id="validationStaffPhone"]').clear().type('151251378'); 
      cy.get('input[id="validationStaffLicense"]').clear().type('873152151'); 
      cy.get('select[id="validationRole"]').select(1);
      cy.get('select[id="validationSpecialization"]').select(1);
      cy.get('input[id="validationStaffAvailabilityStart"]').clear().type('2024-12-28T09:15'); 
      cy.get('input[id="validationStaffAvailabilityEnd"]').clear().type('2024-12-28T10:30'); 
      cy.get('span[id="add"]').click();


      cy.get('button[id="staffCreateSubmit"]').click();
    });
    
    it('should allow edit a staff profile', () => {
      cy.visit('http://localhost:4200/admin');
      cy.get('.selectionDiv').contains('List Staff Profile').click();
      cy.get('#listStaffModal', { timeout: 10000 }).should('be.visible');

      cy.get('#listStaffModal').find('td').first().should('exist');
      cy.get('#listStaffModal').find('td').first().click();

      cy.get('button[id="editStaffButoon"]').click();

      cy.get('#editStaffModal', { timeout: 10000 }).should('be.visible');
      
      cy.get('input[id="validationEditStaffEmail"]').should('exist'); 
      cy.get('input[id="validationEditStaffPhone"]').should('exist'); 
      cy.get('select[id="validationSpecializationEdit"]').should('exist');
      cy.get('input[id="EvalidationStaffAvailabilityStart"]').should('exist');
      cy.get('input[id="EvalidationStaffAvailabilityEnd"]').should('exist');
      cy.get('span[id="add"]').should('exist');
      cy.get('button[id="staffCreateSubmit"]').should('exist');
      
      cy.get('input[id="validationEditStaffEmail"]').clear().type('samaquerilex@fakemail.com'); 
      cy.get('input[id="validationEditStaffPhone"]').clear().type('151251378'); 
      cy.get('select[id="validationSpecializationEdit"]').select(2);
      cy.get('input[id="EvalidationStaffAvailabilityStart"]').clear().type('2024-12-28T09:15'); 
      cy.get('input[id="EvalidationStaffAvailabilityEnd"]').clear().type('2024-12-28T10:30'); 
      cy.get('span[id="add2"]').click();
      cy.get('button[id="staffEditSubmit"]').click();
    });
    
    it('should allow disable a staff profile', () => {
      cy.visit('http://localhost:4200/admin');
      cy.get('.selectionDiv').contains('List Staff Profile').click();
      cy.get('#listStaffModal', { timeout: 10000 }).should('be.visible');

      cy.get('#listStaffModal').find('td').first().should('exist');
      cy.get('#listStaffModal').find('td').first().click();

      cy.get('button[id="disableStaffButoon"]').click();

      cy.get('button[class="swal2-confirm swal2-styled swal2-default-outline"]', { timeout: 10000 }).should('be.visible');
      cy.get('button[class="swal2-confirm swal2-styled swal2-default-outline"]').click();

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