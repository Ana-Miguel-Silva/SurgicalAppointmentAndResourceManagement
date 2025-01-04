describe('AdminComponent', () => {
  
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

 
 

    describe('Patient Registration Modal', () => {
      beforeEach(() => {
         // Supondo que o formulário está na página inicial
      });
    
      it('Should open the patient registration modal when clicked', () => {
        // Abrir o modal
        cy.get('.selectionDiv').contains('Register Patient Profile').click();
        // Verificar se o modal está visível
        cy.get('#registerPatientModal', { timeout: 10000 }).should('be.visible');
      });
    });

    describe('Patient List Display Test', () => {
      it('Should display patient data in the table', () => {
        // Abrir o modal de listagem de pacientes
        cy.get('.selectionDiv').contains('List Patient Profile').click();
    
        // Garantir que o modal foi aberto
        cy.get('#listPatientModal').should('be.visible');
    
        // Verificar se os dados da tabela estão sendo exibidos corretamente
        cy.get('table tbody tr').should('have.length.greaterThan', 0); // Verificar se há pelo menos um paciente na lista
        cy.get('table th').should('contain.text', 'First Name');
        cy.get('table th').should('contain.text', 'Last Name');
        cy.get('table th').should('contain.text', 'Medical Number');
        cy.get('table th').should('contain.text', 'Phone');
      });
    });

    describe('Operation Type Modal Test', () => {
      it('Should open the "List Operation Profile" modal when clicked', () => {
        // Abrir o modal de listagem de tipos de operação
        cy.get('.selectionDiv').contains('List Operation Profile').click();
    
        // Garantir que o modal foi aberto
        cy.get('#listOperationTypeModal').should('be.visible');
      });
    });
    
    

    describe('Register Patient Form', () => {
      beforeEach(() => {
         // Supondo que o formulário está na página inicial
        cy.get('.selectionDiv').contains('Register Patient Profile').click(); // Abrir o modal
      });
    
      it('Should fill out the patient registration form and submit it', () => {
        // Preencher o campo de nome
        cy.get('#registerPatientName').type('John Doe');
        // Preencher o campo de data de nascimento
        cy.get('#registerPatientDate').type('1990-01-01');
        // Preencher o campo de email
        cy.get('#registerPatientUserEmail').type('johndoe@example.com');

        cy.get('#registerPatientEmail').type('johndoe@example.com');
        // Preencher o campo de telefone
        cy.get('#registerPatientPhone').type('123456789');
        // Selecionar o gênero
        cy.get('#registerPatientGender').select('Male');
        // Preencher o campo de histórico de consultas
        cy.get('#input-date').type('2023-01-01').trigger('change');
        // Preencher os campos de contato de emergência
        cy.get('#emergencyContactName').type('Jane Doe');
        cy.get('#emergencyContactEmail').type('janedoe@example.com');
        cy.get('#emergencyContactPhone').type('987654321');
        
        // Enviar o formulário
        cy.get('#submitRegister').click();
    
        // Verificar se o formulário foi enviado (supondo que há uma mensagem de sucesso ou redirecionamento)
        cy.contains('Patient adicionado com sucesso!').should('be.visible');

      });
    });


    describe('Admin Page Tests', () => {
      it('Should open the "Register Patient Profile" modal when clicked', () => {
        // Abrir o modal de registro de paciente
        cy.get('.selectionDiv').contains('List Patient Profile').click();
    
        // Garantir que o modal foi aberto
        cy.get('#listPatientModal').should('be.visible');
      });
    });

    describe('Filter Modal Tests', () => {
      it('Should open the "Filter" modal when clicked', () => {
        // Abrir o modal de listagem de pacientes
        cy.get('.selectionDiv').contains('List Patient Profile').click();
    
        // Clicar no botão de filtro
        cy.get('.btn-outline-info').contains('Filter').click();
    
        // Verificar se o modal de filtro foi aberto
        cy.get('#filterRequestModal').should('be.visible');
      });
    });

    describe('Patient List Interaction', () => {
      it('Should select a patient from the list', () => {
        // Abrir o modal de listagem de pacientes
        cy.get('.selectionDiv').contains('List Patient Profile').click();
    
        // Garantir que o modal foi aberto
        cy.get('#listPatientModal').should('be.visible');
    
        // Selecionar um paciente na lista
        cy.get('td').first().click(); // Seleciona o primeiro paciente da lista
    
        // Garantir que o paciente foi selecionado (verificando se a linha tem a classe 'selected-row')
        //cy.get('tr').contains('1').should('have.class', 'selected-row');
      });
    });

    describe('View Patient Modal Tests', () => {
  
      it('Deve abrir o modal de visualização do paciente', () => {
        cy.get('.selectionDiv').contains('List Patient Profile').click();
        cy.get('td').first().click(); // Seleciona o primeiro paciente da lista
        cy.contains('View').click();
    
        cy.get('#viewPatientModal').should('be.visible'); // Verifica que o modal está visível
     
        cy.get('#viewPatientModal').within(() => {
          cy.get('table').each(($table) => {
            cy.wrap($table).find('tbody tr').should('have.length.greaterThan', 0); // Verifica que há linhas na tabela
          });
        });
    
        cy.get('#viewPatientModal').find('.close').click();
        cy.get('#viewPatientModal').should('not.be.visible');
      });
  
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
  


   describe('Update Patient Modal Tests', () => {
      it('Deve abrir o modal de visualização do paciente', () => {
      cy.get('.selectionDiv').contains('List Patient Profile').click();
      cy.get('td').first().click(); // Seleciona o primeiro paciente da lista
      cy.contains('Edit').click();
  
        cy.get('#UpdatePatientModal').should('be.visible'); // Verifica que o modal está visível

        cy.get('#UpdatePatientModal').within(() => {
          const newDate = '2024-12-25';
          cy.get('#input-date').type(newDate).trigger('change');
          cy.get('#dates li').contains(newDate).should('exist'); // Verifica se a nova data foi adicionada
        });

        cy.get('#UpdatePatientModal').within(() => {
          const newAllergy = 'Pollen';
          cy.get('#input-tag').type(`${newAllergy}{enter}`);
          cy.get('#tags li').contains(newAllergy).should('exist'); // Verifica se a nova alergia foi adicionada
        });

        cy.get('#UpdatePatientModal').find('.btn-primary').click();

        cy.get('#UpdatePatientModal').find('.close').click();
        cy.get('#UpdatePatientModal').should('not.be.visible');
        cy.contains('Patient atualizado com sucesso!').should('be.visible');
      });
  
  });
    
  describe('Desativar Paciente', () => {
    beforeEach(() => {
      // Navegar para a página com o modal
      // Abrir o modal
      cy.get('#listPatientModal').should('be.hidden');
      cy.get('.selectionDiv').contains('List Patient Profile').click();
      cy.get('#listPatientModal').should('be.visible');
    });
  
    it('Deve exibir aviso ao tentar desativar sem paciente selecionado', () => {
      cy.contains('Deactivate').click(); // Botão Desativar
      cy.get('.swal2-toast').should('contain', 'Por favor seleciona um Patient.');
    });
  
    it('Deve desativar paciente com sucesso', () => {
      // Simular paciente ativo
      cy.get('td').first().click(); // Seleciona o primeiro paciente da lista
  
      // Iniciar desativação
      cy.contains('Deactivate').click();

      cy.get('.swal2-confirm').click(); // Confirmar no modal do Swal
  
      // Validar sucesso
      cy.get('.swal2-toast').should('contain', 'Perfil desativado com sucesso');
    });
  
    /*it('Deve exibir erro ao falhar na desativação', () => {
      // Simular erro de servidor
      cy.intercept('DELETE', '*api/patients/test@example.com', {
        statusCode: 500,
        body: { message: 'Erro no servidor' },
      });
  
      // Simular paciente ativo
      cy.contains('Deactivate').click();
      cy.get('.swal2-confirm').click(); // Confirmar no modal do Swal
  
      // Validar erro
      cy.get('.swal2-toast').should('contain', 'Não foi possível desativar o perfil');
    });*/
  });
  
    

    it('should allow creating a new operation type', () => {

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


    });
    
    describe('Specializations List Interaction', () => {
      it('Should select a Specialization from the list', () => {
        // Abrir o modal de listagem de pacientes
        cy.get('.selectionDiv').contains('List Specializations').click();
    
        // Garantir que o modal foi aberto
        cy.get('#listSpecializationsModal').should('be.visible');
    
        // Selecionar um paciente na lista
        cy.get('#listSpecializationsModal').find('td').first().click(); // Seleciona o primeiro paciente da lista
    
        // Garantir que o paciente foi selecionado (verificando se a linha tem a classe 'selected-row')
        //cy.get('#listConditionsModal').find('tr').get('2').should('have.class', 'selected-row');
      });
    });
    describe('Register Medical Conditions Form', () => {
      it('Should fill out the Medical Conditions registration form and submit it', () => {
        cy.get('.selectionDiv').contains('Insert Medical Condition').click();
        // Preencher o campo de nome
        cy.get('#medicalConditionCode').type('DB-1346');
        // Preencher o campo de data de nascimento
        cy.get('#medicalConditionDesignation').type('Dewbonic Craig');
        // Preencher o campo de email
        cy.get('#medicalConditionDescription').type('A type of craig caused by the bacteria Kanrsinia Crestis. ');

        cy.get('#medicalConditionSymptoms').type('Beaver, Fiveheadaches, Crawmiting, Swole and Rainfun Gymph Toads, Dewboes');
        
        // Enviar o formulário
        cy.get('#submitConition').click();
    
        // Verificar se o formulário foi enviado (supondo que há uma mensagem de sucesso ou redirecionamento)
        cy.contains('Medical condition registered successfully').should('be.visible');

      });
    });
    describe('Medical Conditions List Interaction', () => {
      it('Should select a Medical from the list', () => {
        // Abrir o modal de listagem de pacientes
        cy.get('.selectionDiv').contains('List Medical Conditions').click();
    
        // Garantir que o modal foi aberto
        cy.get('#listConditionsModal').should('be.visible');
    
        // Selecionar um paciente na lista
        cy.get('#listConditionsModal').find('td').first().click(); // Seleciona o primeiro paciente da lista
    
        // Garantir que o paciente foi selecionado (verificando se a linha tem a classe 'selected-row')
        //cy.get('#listConditionsModal').find('tr').get('2').should('have.class', 'selected-row');
      });
    });
    describe('Edit and View Medical Conditions', () => {
      beforeEach(() => {
        // Abrir o modal de listagem de pacientes
        cy.get('.selectionDiv').contains('List Medical Conditions').click();
    
        // Garantir que o modal foi aberto
        cy.get('#listConditionsModal').should('be.visible');
    
        // Selecionar um paciente na lista
        cy.get('#listConditionsModal').find('td').last().click();
      });
      it('Should view the Medical Condition', () => {
        cy.get('#viewMedicalConditionButton').click();
        cy.get('#viewConditionModal').should('be.visible');
      });
      it('Should fill out the Medical Conditions edition form and submit it', () => {
       cy.get('#editMedicalConditionButton').click();
        // Preencher o campo de nome
        // Preencher o campo de data de nascimento
        cy.get('#medicalConditionDesignationE').clear().type('Dewbonic Craig Edited');
        // Preencher o campo de email
        cy.get('#medicalConditionDescriptionE').clear().type('An edited type of craig caused by the bacteria Kanrsinia Crestis. ');

        cy.get('#medicalConditionSymptomsE').clear().type('Creeper, Beaver, Fiveheadaches, Crawmiting, Swole and Rainfun Gymph Toads, Dewboes');
        
        // Enviar o formulário
        cy.get('#submitEditCondition').click();
    
        // Verificar se o formulário foi enviado (supondo que há uma mensagem de sucesso ou redirecionamento)
        cy.contains('edical Condition Updated Successfully!').should('be.visible');
      });
    });
  });