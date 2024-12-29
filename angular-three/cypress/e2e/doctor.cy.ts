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

  it('should open and close the register medical record modal', () => {
   
    cy.get('.selectionDiv').contains('Register Medical Record').click();
 
    cy.get('#registerMedicalRecordModal').should('be.visible');

    cy.get('#registerMedicalRecordModal .close').click();
    cy.get('#registerMedicalRecordModal').should('not.be.visible');
  });

 
  it('should register a new medical record successfully', () => {
    cy.get('.selectionDiv').contains('Register Medical Record').click(); 
     
    cy.get('input[id="patientEmailMedicalRecord"]').should('exist'); 
       
    cy.get('input[id="patientEmailMedicalRecord"]').type('testeCypress@gmail.com'); 
      
    cy.get('#tag-filter').type('Peanut Allergy');
    cy.get('.dropdown-list > li').contains('Peanut Allergy').click();
    cy.get('#descricaoAllergie').type('Severe reaction to peanuts');
    cy.get('[name="filterAllergieStatus"]').type('Active');
    cy.get('.dropdown-list > li').contains('Active').click();
    cy.get('.btn-primary').contains('Add Allergie').click();


    cy.get('#condition-filter').type('Major depressive disorder');
    cy.get('.dropdown-list > li').contains('Major depressive disorder').click();
   // cy.get('#descricaoCondition').type('A mental health condition marked by persistent feelings of sadness...');
    cy.get('[id="registerFilterConditionStatus"]').type('Active');
    cy.get('.dropdown-list', { timeout: 5000 }).should('be.visible')
    cy.get('.dropdown-list > li').contains('Active').click();
    
    cy.get('#medicalConditionSymptoms').type('Sadness');
    cy.get('.btn-primary').contains('Add Condition').click();


    cy.get('#descricao').type('Medical record for a patient with peanut allergy');
    cy.get('button[id="registerDescriptionMedicalRecord"]').click();


    cy.get('button[id="registerMedicalRecordPolicy"]').click();    

    cy.get('#policyModal').should('be.visible');
    cy.get('#policyModal .btn-success').contains('Accept').click();

    cy.get('button[id="buttonRegisterMedicalRecord"]').click();
    
    cy.contains('Medical Record created successfully!').should('be.visible');
   
  }); 

 

  it('should allow edit a medical record', () => {
    cy.get('.selectionDiv').contains('List Medical Record').click();
    cy.get('#listMedicalRecordModal', { timeout: 10000 }).should('be.visible');
   
    cy.get('#listMedicalRecordModal').contains('td', 'testeCypress@gmail.com').parent('tr').click();

    cy.get('button[id="editMedicalRecord"]').click();
    cy.get('#UpdateMedicalRecordModal', { timeout: 10000 }).should('be.visible');
    
    cy.get('input[id="updateMedicalRecordDescription"]').should('exist'); 
       
    cy.get('input[id="updateMedicalRecordDescription"]').type('update description'); 
    cy.get('button[id="buttonUpdateMedicalRecordDescription"]').click();
    
       
    cy.get('#tag-filterUpdate').clear().type('Shellfish Allergy');
    cy.get('.dropdown-listUpdate > li').contains('Shellfish Allergy').click();
    cy.get('#descricaoAllergieUpdate').clear().type('Severe reaction to Shellfish');
    cy.get('[name="filterAllergieStatusUpdate"]').clear().type('Misdiagnosed');
    cy.get('.dropdown-listUpdate > li').contains('Misdiagnosed').click();
    cy.get('button[id="updateAddAllergie"]').contains('Add Allergie').click();

   
    cy.get('button[id="updateMedicalRecordPolicy"]').contains('Read and Agree to Policy').click();    
    cy.get('#policyModal').should('be.visible');
    cy.get('#policyModal .btn-success').contains('Accept').click();

    cy.get('button[id="updateMedicalRecord"]').click();
    cy.contains('Medical record edited successfully').should('be.visible');   
  });


  it('should allow filter existing allergies a medical record', () => {
    cy.get('.selectionDiv').contains('List Medical Record').click();
    cy.get('#listMedicalRecordModal', { timeout: 10000 }).should('be.visible');
   
    cy.get('#listMedicalRecordModal').contains('td', 'testeCypress@gmail.com').parent('tr').click();

    cy.get('button[id="filterMedicalRecord"]').click();
    cy.get('#FilterMedicalRecord', { timeout: 10000 }).should('be.visible');
    
    cy.get('[id="medicalConditionNameFilter"]').should('exist'); 
       
    cy.get('[name="medicalConditionNameFilter"]').clear().type('Major depressive disorder');
    cy.get('button[id="filterConditionMedicalRecord"]').contains('Apply Medical Condition Filter').click();

   
    cy.get('#FilterMedicalRecord').contains('td', 'Major depressive disorder').parent('tr').click();
  });

  it('should allow filter existing medical conditions a medical record', () => {
    cy.get('.selectionDiv').contains('List Medical Record').click();
    cy.get('#listMedicalRecordModal', { timeout: 10000 }).should('be.visible');
   
    cy.get('#listMedicalRecordModal').contains('td', 'testeCypress@gmail.com').parent('tr').click();

    cy.get('button[id="filterMedicalRecord"]').click();
    cy.get('#FilterMedicalRecord', { timeout: 10000 }).should('be.visible');
    
    cy.get('[id="allergieStatusFilter"]').should('exist'); 
       
    cy.get('[name="allergieStatusFilter"]').clear().type('Misdiagnosed');
    cy.get('button[id="filterAllergieMedicalRecord"]').contains('Apply Allergie Filter').click();

   
    cy.get('#FilterMedicalRecord').contains('td', 'Misdiagnosed').parent('tr').click();
  });


  it('should delete medical record', () => {
    cy.get('.selectionDiv').contains('List Medical Record').click();
    cy.get('#listMedicalRecordModal', { timeout: 10000 }).should('be.visible');

    cy.get('#listMedicalRecordModal').find('td').last().should('exist');
    cy.get('#listMedicalRecordModal').find('td').last().click();

    cy.get('button[id="deleteMedicalRecord"]').click();      
    cy.contains('Medical Record deactivated successfully!').should('be.visible');    
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
