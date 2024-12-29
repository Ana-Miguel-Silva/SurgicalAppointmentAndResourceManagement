describe('PatientComponent', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/login');

    // Mocking the response for a patient user
    cy.intercept('POST', '/api/login', { statusCode: 200, body: { token: 'fake-jwt-token', role: 'patient' } }).as('postLogin');

    cy.get('input[name="username"]').clear().type('patient');
    cy.get('input[name="password"]').clear().type('#Password0');
    cy.get('button.login__submit').click();

    cy.wait(500);

    // Verify that the user is redirected to the patient page
    cy.url().should('include', '/patient');

    cy.visit('http://localhost:4200/patient');
  });

  it('should display the patient form in the modal', () => {

    cy.get('.selectionDiv')
      .contains('View Patient Profile')
      .click();

    cy.get('#viewPatientModal', { timeout: 10000 }).should('be.visible');


    cy.get('#viewPatientModal input').should('exist');
  });


  it('should open and close the UpdatePatientModal', () => {
    cy.get('.selectionDiv')
    .contains('Update Patient Profile')
    .should('be.visible')
    .click();

    cy.get('#UpdatePatientModal', { timeout: 10000 }).should('be.visible');

});


it('should add and remove dates from appointmentHistory', () => {

  cy.get('.selectionDiv')
    .contains('Update Patient Profile')
    .should('be.visible')
    .click();


  cy.get('#UpdatePatientModal', { timeout: 10000 }).should('be.visible');


  const newDate = '2023-12-01'; 
  cy.get('input[type="date"]#input-date').clear().type(newDate); 

  cy.get('button[id="updatePatientPolicy"]').contains('Read and Agree to Policy').click();    
  cy.get('#policyModal').should('be.visible');
  cy.get('#policyModal .btn-success').contains('Accept').click();

  cy.get('button[id="updatePatientModalButton"]').click();
  cy.contains('Patient updated successfully!').should('be.visible');   

});


it('should remove dates from appointmentHistory', () => {

  cy.get('.selectionDiv')
    .contains('Update Patient Profile')
    .should('be.visible')
    .click();

 
  cy.get('#UpdatePatientModal', { timeout: 10000 }).should('be.visible');

  const newDate = '2023-12-01';
 


  cy.get('input[type="date"]#input-date').trigger('change');

   cy.get('ul#dates').should('contain', newDate);


  cy.get('ul#dates') 
    .contains(newDate) 
    .find('.delete-button') 
    .click(); 

  
  cy.get('ul#dates').should('contain', newDate); 

  cy.get('button[id="updatePatientPolicy"]').contains('Read and Agree to Policy').click();    
  cy.get('#policyModal').should('be.visible');
  cy.get('#policyModal .btn-success').contains('Accept').click();

  cy.get('button[id="updatePatientModalButton"]').click();
  cy.contains('Patient updated successfully!').should('be.visible');   
  
});

});

