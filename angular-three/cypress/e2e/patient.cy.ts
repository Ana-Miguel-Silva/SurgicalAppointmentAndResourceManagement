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
      .should('be.visible')
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

it('should allow updating patient information', () => {
  cy.get('.selectionDiv')
    .contains('Update Patient Profile')
    .should('be.visible')
    .click();

  cy.get('#UpdatePatientModal', { timeout: 10000 }).should('be.visible');

  cy.get('input[formControlName="name"]').clear().type('patient patient');
  cy.get('input[formControlName="email"]').clear().type('avlismana@gmail.com');
  cy.get('input[formControlName="phone"]').clear().type('987654321');
  cy.get('input[formControlName="userEmail"]').clear().type('avlismana@gmail.com');
  cy.get('input[formControlName="gender"]').clear().type('Female');
  cy.get('input[formControlName="emergencyContactName"]').clear().type('default dd');
  cy.get('input[formControlName="emergencyContactEmail"]').clear().type('default@gmail.com');
  cy.get('input[formControlName="emergencyContactPhone"]').clear().type('999999999');


  cy.get('button.btn.btn-primary').click();

});

it('should add and remove dates from appointmentHistory', () => {
  // Open the update patient modal
  cy.get('.selectionDiv')
    .contains('Update Patient Profile')
    .should('be.visible')
    .click();

  // Ensure the modal is visible
  cy.get('#UpdatePatientModal', { timeout: 10000 }).should('be.visible');

  // Add a new appointment date
  const newDate = '2023-12-01'; // Example date in YYYY-MM-DD format
  cy.get('input[type="date"]#input-date').clear().type(newDate); // Type the date


  cy.get('button.btn.btn-primary').click(); // Update this line to select the button correctly

  // Verify that the new date is displayed in the appointment history
  cy.get('.table-over-update tbody').should('contain', newDate);


});


it('should remove dates from appointmentHistory', () => {
  // Open the update patient modal
  cy.get('.selectionDiv')
    .contains('Update Patient Profile')
    .should('be.visible')
    .click();

  // Ensure the modal is visible
  cy.get('#UpdatePatientModal', { timeout: 10000 }).should('be.visible');

  // Add a new appointment date
  const newDate = '2023-12-01'; // Example date in YYYY-MM-DD format
  cy.get('input[type="date"]#input-date').clear().type(newDate); // Type the date

  // Trigger the change event if necessary
  cy.get('input[type="date"]#input-date').trigger('change');

  // Verify that the new date is displayed in the appointment history
  cy.get('ul#dates').should('contain', newDate); // Ensure the date appears in the list

  // Remove the newly added appointment date
  cy.get('ul#dates') // Select the list containing the dates
    .contains(newDate) // Locate the list item containing the date
    .find('.delete-button') // Find the delete button within the same list item
    .click(); // Click the delete button

  // Verify that the date has been removed from the appointment history
  cy.get('ul#dates').should('not.contain', newDate); // Ensure the date is removed

  // Optionally submit the changes if required
  cy.get('button[type="submit"]') // Adjust the selector to match your actual submit button
    .should('be.visible') // Ensure the submit button is visible
    .click(); // Click the submit button

  // Close the modal after verification
  cy.get('span.close').click();
  cy.get('#UpdatePatientModal').should('not.be.visible');
});


it('should add and remove tags from allergies', () => {
  cy.get('.selectionDiv')
  .contains('Update Patient Profile')
  .should('be.visible')
  .click();


  cy.get('#UpdatePatientModal', { timeout: 10000 }).should('be.visible');

  const newtag= 'water';
  cy.get('input[type="tags"]#input-tag').clear().type(newtag);

  cy.get('button.btn.btn-primary').click();
  cy.get('.table-over-update tbody').should('contain', newtag);

  cy.get('.table-over-update tbody')
    .contains(newtag) // Locate the date
    .parents('tr') // Navigate to the parent row (assuming the date is in a table row)
    .find('.delete-button') // Find the delete button within that row
    .click(); // Click the delete button

  // Verify that the date has been removed from the appointment history
  cy.get('.table-over-update tbody').should('not.contain', newtag);

  cy.get('.remove-allergy-tag').first().click();
  cy.get('.allergy-tags').should('not.contain', 'Peanuts');
});

});

