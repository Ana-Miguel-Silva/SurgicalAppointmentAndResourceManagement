/*describe('UserComponent', () => {
  beforeEach(() => {    
    cy.visit('http://localhost:4200/user?email=shushizinhohey@gmail.com', {
      onBeforeLoad(win) {
        win.localStorage.setItem('authToken', 'auth-token'); 
      }
    }); 
   
  });

  it('should redirect to the appropriate page based on user role', () => {
    // Mocking the response for an admin user
    cy.intercept('POST', '/api/login', { statusCode: 200, body: { token: 'auth-token', role: 'admin' } }).as('postLogin');

    cy.get('input[name="username"]').type('admin');
    cy.get('input[name="password"]').type('#Password0');
    cy.get('button.login__submit').click();

    cy.wait(500);

    cy.visit('http://localhost:4200/user?email=shushizinhohey@gmail.com');



  });
  
  it('should open the registration modal when the button is clicked', () => { 
    cy.visit('http://localhost:4200/user?email=shushizinhohey@gmail.com');

    cy.get('.selectionDiv')
      .contains('Register Patient Profile')
      .click();
  
    cy.get('#registerPatientModal input').should('exist');
  });
  

  it('should open the registration modal when the button is clicked', () => {
    cy.get('.selectionDiv')
      .contains('Register Patient Profile')
      .click();
  

    cy.get('#registerPatientModal input').should('exist');
  });

  it('should fill out the form and submit successfully', () => {

    cy.get('.selectionDiv')
    .contains('Register Patient Profile')
    .click();


    cy.get('input[formControlName="name"]').type('John Doe');
    cy.get('input[formControlName="dateOfBirth"]').type('1990-01-01');
    cy.get('input[formControlName="userEmail"]').type('john@example.com');
    cy.get('input[formControlName="email"]').type('john.doe@example.com');
    cy.get('input[formControlName="phone"]').type('123456789');
    cy.get('select[formControlName="gender"]').select('Male');
    cy.get('input[formControlName="agree"]').check();


    cy.get('button.btn.btn-primary').click();

    cy.get('.modal').should('not.exist'); 
  });

  it('should show validation errors when submitting an empty form', () => {

    cy.get('.selectionDiv')
    .contains('Register Patient Profile')
    .click(); 

    cy.get('input[formControlName="name"]').clear().type('');
    cy.get('input[formControlName="email"]').clear().type('');
    cy.get('input[formControlName="dateOfBirth"]').clear().type('');
    cy.get('input[formControlName="phone"]').clear().type('');
    cy.get('input[formControlName="userEmail"]').clear().type('');
    cy.get('input[formControlName="gender"]').clear().type('');

    cy.get('button.btn.btn-primary').click();
  });

  it('should show validation errors for invalid email', () => {

    cy.get('.selectionDiv')
    .contains('Register Patient Profile')
    .click();
 
    cy.get('input[formControlName="email"]').type('invalid-email');

    cy.get('button.btn.btn-primary').click();

    cy.get('input[formControlName="email"]').siblings('.invalid-feedback').should('be.visible');
  });
});*/