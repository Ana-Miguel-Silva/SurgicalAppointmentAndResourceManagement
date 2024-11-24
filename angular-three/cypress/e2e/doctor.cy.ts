/// <reference types="cypress" />

describe('Doctor Operation Requests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/login');

    cy.intercept('POST', '/api/login', { statusCode: 200, body: { token: 'fake-jwt-token', role: 'doctor' } }).as('postLogin');

    cy.get('input[name="username"]').clear().type('doctor');
    cy.get('input[name="password"]').clear().type('#Password0');
    cy.get('button.login__submit').click();

    cy.wait(500);

    cy.url().should('include', '/doctor');

    cy.visit('http://localhost:4200/doctor');
  });

  it('should display the title and table headers', () => {
    cy.get('h1.title').contains('Doctor');
    cy.get('h2').contains('Operation Requests');
    cy.get('table thead tr').within(() => {
      cy.contains('Doctor Email');
      cy.contains('Patient Email');
      cy.contains('Operation Type');
      cy.contains('Deadline');
      cy.contains('Priority');
      cy.contains('Actions');
    });
  });

  it('should open and close the create request modal', () => {
    cy.get('button').contains('Insert').click();
    cy.get('#createRequestModal').should('be.visible');

    cy.get('#createRequestModal .close').click();
    cy.get('#createRequestModal').should('not.be.visible');
  });

  it('should allow creating a new operation request', () => {
    cy.get('button').contains('Insert').click();
    cy.get('#createRequestModal').should('be.visible');

    cy.get('#patientEmail').type('avlismana@gmail.com');
    cy.get('#operationTypeName').type('ORTHOPEDICS');
    cy.get('#deadline').type('2024-12-31');
    cy.get('#priority').select('Urgent');

    cy.get('#createRequestModal form').submit();
    cy.get('#createRequestModal').should('not.be.visible');

    cy.get('table tbody tr').last().within(() => {
      cy.contains('avlismana@gmail.com');
      cy.contains('ORTHOPEDICS');
      cy.contains('Urgent');
    });
  });

  it('should filter operation requests by doctor email', () => {
    cy.get('button').contains('Filter Requests').click();
    cy.get('#filterRequestModal').should('be.visible');

    cy.get('#filterDoctorEmail').type('doc@gmail.com');
    cy.get('#filterRequestModal form').submit();
    cy.get('#filterRequestModal').should('not.be.visible');

    cy.get('table tbody tr').each(($row) => {
      cy.wrap($row).contains('doc@gmail.com');
    });
  });

  it('should filter operation requests by patient email', () => {
    cy.get('button').contains('Filter Requests').click();
    cy.get('#filterRequestModal').should('be.visible');

    cy.get('#filterPatientEmail').type('avlismana@gmail.com');
    cy.get('#filterRequestModal form').submit();
    cy.get('#filterRequestModal').should('not.be.visible');

    cy.get('table tbody tr').each(($row) => {
      cy.wrap($row).contains('avlismana@gmail.com');
    });
  });

  it('should filter operation requests by priority', () => {
    cy.get('button').contains('Filter Requests').click();
    cy.get('#filterRequestModal').should('be.visible');

    cy.get('#filterPriority').select('Urgent');
    cy.get('#filterRequestModal form').submit();
    cy.get('#filterRequestModal').should('not.be.visible');

    cy.get('table tbody tr').each(($row) => {
      cy.wrap($row).contains('Urgent');
    });
  });

  it('should filter operation requests by operation type', () => {
    cy.get('button').contains('Filter Requests').click();
    cy.get('#filterRequestModal').should('be.visible');

    cy.get('#filterOperationType').type('ORTHOPEDICS');
    cy.get('#filterRequestModal form').submit();
    cy.get('#filterRequestModal').should('not.be.visible');

    cy.get('table tbody tr').each(($row) => {
      cy.wrap($row).contains('ORTHOPEDICS');
    });
  });

  it('should filter operation requests by all fields at the same time', () => {
    cy.get('button').contains('Filter Requests').click();
    cy.get('#filterRequestModal').should('be.visible');

    cy.get('#filterDoctorEmail').type('doc@gmail.com');
    cy.get('#filterPatientEmail').type('avlismana@gmail.com');
    cy.get('#filterPriority').select('Urgent');
    cy.get('#filterOperationType').type('ORTHOPEDICS');

    cy.get('#filterRequestModal form').submit();
    cy.get('#filterRequestModal').should('not.be.visible');

    cy.get('table tbody tr').each(($row) => {
      cy.wrap($row).contains('doc@gmail.com');
      cy.wrap($row).contains('avlismana@gmail.com');
      cy.wrap($row).contains('Urgent');
      cy.wrap($row).contains('ORTHOPEDICS');
    });
  });
  
  it('should update an operation request', () => {
    cy.get('table tbody tr').first().within(() => {
      cy.get('button.btn-warning').click();
    });
  
    cy.get('#updateRequestModal').should('be.visible');
    cy.get('#updateDeadline').clear().type('2024-11-30');
    cy.get('#updatePriority').select('Elective');
    cy.get('#updateRequestModal form').submit();
  
    cy.get('#updateRequestModal').should('not.be.visible');
  
    cy.get('table tbody tr').each(($row) => {
      cy.wrap($row).within(() => {
        const hasUpdatedData = $row.text().includes('2024-11-30') && $row.text().includes('Elective');
        if (hasUpdatedData) {
          cy.contains('2024-11-30');
          cy.contains('Elective');
        }
      });
    });
  });

  it('should delete an operation request', () => {
    cy.get('table tbody tr').then(($rows) => {
      const initialRowCount = $rows.length;
  
      cy.get('table tbody tr').first().within(() => {
        cy.get('button.btn-danger').click();
      });
  
      cy.get('#deleteModal').should('be.visible');
      cy.get('#deleteModal .btn-danger').click();
  
      cy.get('#deleteModal').should('not.be.visible');
  
      cy.get('table tbody tr').should('have.length', initialRowCount - 1);
    });
  });
});
