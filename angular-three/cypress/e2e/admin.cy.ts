import { environment } from '../../src/environments/environment'; // Importa o environment correto


describe('AdminComponent', () => {
  
  beforeEach(() => {
    cy.visit(`${environment.apiAngularUrl}/login`);


    cy.intercept('POST', '/api/login', { statusCode: 200, body: { token: 'fake-jwt-token', role: 'admin' } }).as('postLogin');

    cy.get('input[name="username"]').clear().type('admin');
    cy.get('input[name="password"]').clear().type('#Password0');
    cy.get('button.login__submit').click();

    cy.wait(500);

    cy.url().should('include', '/admin');

    cy.visit(`${environment.apiAngularUrl}/admin`);

  });

  describe('Create Room Type Modal', () => {

  it('should successfully create a room type with valid data', () => {
    const roomTypeData = {
      code: 'RT89-001',
      designacao: 'Operating Room',
      descricao: 'A fully equipped surgical room',
      surgerySuitable: true,
    };

    cy.get('.selectionDiv').contains('Insert RoomTypes').click();

    // Fill the form with valid data
    cy.get('#roomTypeCode').type(roomTypeData.code);
    cy.get('#roomTypeDesignation').type(roomTypeData.designacao);
    cy.get('#roomTypeDescription').type(roomTypeData.descricao);
    cy.get('#surgerySuitable').check({ force: true });

    // Check surgery suitable checkbox
    cy.get('#policyButton').click();
    cy.get('#acceptPolicy').click();

    // Submit the form
    cy.get('#roomTypeForm').submit();
    // Ensure success message appears

    cy.contains('Room Type created with success').should('exist');


    // Ensure the modal closes after submission
    cy.get('#insertRoomTypes').should('not.be.visible');
  });

  it('should show error if room type already exists', () => {
    const roomTypeData = {
      code: 'RT89-001',
      designacao: 'Duplicate Room',
      descricao: 'This room already exists',
      surgerySuitable: true,
    };

    cy.get('.selectionDiv').contains('Insert RoomTypes').click();

    // Fill the form with the existing room type data
    cy.get('#roomTypeCode').type(roomTypeData.code);
    cy.get('#roomTypeDesignation').type(roomTypeData.designacao);
    cy.get('#roomTypeDescription').type(roomTypeData.descricao);

    // Check surgery suitable checkbox
    cy.get('#surgerySuitable').check({ force: true });

     // Submit the form
     cy.get('#policyButton').click();
     cy.get('#acceptPolicy').click();
 
     // Submit the form
     cy.get('#roomTypeForm').submit();

    // Intercept the API call and return an error response for the duplicate room type
    cy.intercept('POST', '/api/room-types', {
      statusCode: 400,
      body: { message: 'Already exists a Room Type with this code' },
    }).as('createRoomTypeError');

   

    // Verify the error message appears
    cy.contains('Already exist a Room Type with this code').should('exist');
  });
});

describe('Create Allergie Modal', () => {
  it('should successfully create an allergie with valid data', () => {
    const allergieData = {
      designacao: 'Peanut Allergy Cypress',
      descricao: 'Severe allergic reaction to peanuts',
    };

    // Abrir o modal de inserção de alergias
    cy.get('.selectionDiv').contains('Insert Allergies').click();

    // Preencher o formulário com dados válidos
    cy.get('#allergieDesignation').type(allergieData.designacao);
    cy.get('#allergieDescription').type(allergieData.descricao);

    // Abrir e aceitar a política
    cy.get('button').contains('Read and Agree to Policy').click({ force: true });
    cy.get('#acceptPolicy').click(); // Presumindo que há um ID no botão dentro da política.

    // Submeter o formulário
    cy.get('#allergieForm').submit();

    // Confirmar sucesso
    cy.contains('Allergie created with success').should('exist');

    // Garantir que o modal foi fechado
    cy.get('#insertAllergies').should('not.be.visible');
  });

  it('should show an error if allergie already exists', () => {
    const allergieData = {
      designacao: 'Peanut Allergy Cypress',
      descricao: 'Already exists in the database',
    };

    // Abrir o modal de inserção de alergias
    cy.get('.selectionDiv').contains('Insert Allergies').click();

    // Preencher o formulário com dados duplicados
    cy.get('#allergieDesignation').type(allergieData.designacao);
    cy.get('#allergieDescription').type(allergieData.descricao);

    // Abrir e aceitar a política
    cy.get('button').contains('Read and Agree to Policy').click({ force: true });
    cy.get('#acceptPolicy').click(); // Presumindo que há um ID no botão dentro da política.

    // Submeter o formulário
    cy.get('#allergieForm').submit();

    // Interceptar a chamada API para simular erro de duplicação
    cy.intercept('POST', '/api/allergies', {
      statusCode: 400,
      body: { message: 'Already exists an allergie with this name' },
    }).as('createAllergieError');

    // Confirmar que a mensagem de erro é exibida
    cy.contains('Already exist a allergie with this name').should('exist');
  });
});

describe('Allergies List Display Test', () => {
  it('Should display allergies data in the table', () => {
    // Abrir o modal de listagem de alergias
    cy.get('.selectionDiv').contains('List Allergies').click();

    // Garantir que o modal foi aberto
    cy.get('#listAllergies').should('be.visible');

    // Garantir que a tabela contém dados
    cy.get('table tbody tr').should('have.length.greaterThan', 0); // Verificar que há pelo menos uma alergia na lista

    // Verificar os cabeçalhos da tabela
    cy.get('table th').should('contain.text', '#');
    cy.get('table th').should('contain.text', 'Name');
    cy.get('table th').should('contain.text', 'Description');

    // Verificar dados específicos na tabela (apenas como exemplo; precisa de dados estáticos ou mocks)
    cy.get('table tbody tr').first().within(() => {
      cy.get('td').eq(1).should('not.be.empty'); // Nome
      cy.get('td').eq(2).should('not.be.empty'); // Descrição
    });
  });

  it('Should allow filtering allergies', () => {
    // Abrir o modal de listagem de alergias
    cy.get('.selectionDiv').contains('List Allergies').click();

    // Abrir o modal de filtros
    cy.get('button').contains('Filter').click({ force: true });

    // Garantir que o modal de filtros foi aberto
    cy.get('#filterAllergyModal').should('be.visible'); // Certifique-se de adicionar o ID correto para o modal de filtro

    // (Simule a aplicação de um filtro, dependendo da lógica específica do filtro)
    // Após filtrar, verificar se a tabela exibe os dados esperados
    cy.get('table tbody tr').should('have.length.greaterThan', 0); // Deve exibir pelo menos um item
  });

  it('Should highlight selected allergy', () => {
    // Abrir o modal de listagem de alergias
    cy.get('.selectionDiv').contains('List Allergies').click();

    // Selecionar uma alergia
    cy.get('table tbody tr').first().click({ force: true });

    // Verificar se a linha foi destacada
    cy.get('table tbody tr').first().should('have.class', 'selected-row');
  });

  it('Should allow editing an allergy', () => {
    // Abrir o modal de listagem de alergias
    cy.get('.selectionDiv').contains('List Allergies').click();

    // Selecionar uma alergia
    cy.get('table tbody tr').first().click({ force: true });

    // Clicar no botão de editar
    cy.get('button').contains('Edit').click({ force: true });

    // Garantir que um modal ou formulário de edição foi aberto (adapte conforme necessário)
    cy.get('#editAllergyModal').should('be.visible'); // Certifique-se de adicionar o ID correto para o modal de edição
  });
});

describe('Update Allergy Modal Tests', () => {
  it('Should open and update an allergy successfully', () => {
    // Abrir o modal de lista de alergias
    cy.get('.selectionDiv').contains('List Allergies').click();
    
    cy.contains('Peanut Allergy Cypress').first().click({force: true}); // Seleciona o primeiro paciente da lista

    cy.get('#editAllergyModal').click();

    // Verificar se o modal de atualização está visível
    cy.get('#UpdateAllergyModal').should('be.visible');

    // Atualizar os campos dentro do modal
    cy.get('#UpdateAllergyModal').within(() => {
      const newDesignation = 'Peanut Allergy Cypress';
      const newDescription = 'Updated description of the allergy';

      // Atualizar campos designação e descrição
      cy.get('input[formControlName="designacao"]').clear().type(newDesignation);
      cy.get('input[formControlName="descricao"]').clear().type(newDescription);

      // Confirmar política
      cy.get('button').contains('Read and Agree to Policy').click();

      
    });

    cy.get('#policyModal').should('be.visible');

      cy.get('#policyModal').within(() => {
        cy.get('#acceptPolicy').click({ force: true });
      });

      cy.get('#UpdateAllergyModal').within(() => {

        // Submeter formulário
        cy.get('button').contains('Submit form').click();
      });


    // Garantir que o modal foi fechado e exibir a mensagem de sucesso
    cy.get('#UpdateAllergyModal').should('not.be.visible');
    cy.contains('Allergy updated successfully!').should('exist');
  });

  it('Should show an error when failing to update an allergy', () => {
    // Abrir o modal de lista de alergias
    cy.get('.selectionDiv').contains('List Allergies').click();

    cy.contains('Peanut Allergy Cypress').first().click({force: true}); // Seleciona o primeiro paciente da lista

    cy.get('#editAllergyModal').click();

    // Verificar se o modal de atualização está visível
    cy.get('#UpdateAllergyModal').should('be.visible');

    // Configurar uma interceção para simular erro na API
    cy.intercept('PATCH', '/api/allergies', {
      statusCode: 400,
      body: { message: 'Failed to update allergy!' },
    }).as('updateAllergy');

    

    // Tentar atualizar os campos dentro do modal
    cy.get('#UpdateAllergyModal').within(() => {

      cy.get('button').contains('Read and Agree to Policy').click();
      
    });

    cy.get('#policyModal').should('be.visible');

      cy.get('#policyModal').within(() => {
        cy.get('#acceptPolicy').click({ force: true });
      });

      cy.get('#UpdateAllergyModal').within(() => {
        cy.get('input[formControlName="descricao"]').clear()

        // Submeter formulário
        cy.get('button').contains('Submit form').click();
      });

    // Garantir que a mensagem de erro foi exibida
    cy.contains('Failed to update allergy!').should('be.visible');
  });

  it('Should cancel the update process', () => {
    // Abrir o modal de lista de alergias
    cy.get('.selectionDiv').contains('List Allergies').click();

    cy.contains('Peanut Allergy Cypress').first().click({force: true}); // Seleciona o primeiro paciente da lista

    cy.get('#editAllergyModal').click();

    // Verificar se o modal de atualização está visível
    cy.get('#UpdateAllergyModal').should('be.visible');

    // Fechar o modal sem realizar nenhuma ação
    cy.get('#UpdateAllergyModal').find('.close').click();

    // Verificar se o modal foi fechado
    cy.get('#UpdateAllergyModal').should('not.be.visible');
  });
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

        cy.get('button').contains('Read and Agree to Policy').click();
      

        cy.get('#acceptPolicy').click({ force: true });

        
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
     
        //cy.get('#viewPatientModal').within(() => {
         // cy.get('table').each(($table) => {
          //  cy.wrap($table).find('tbody tr').should('have.length.greaterThan', 0); // Verifica que há linhas na tabela
          //});
        //});
    
        cy.get('#viewPatientModal').find('.close').click();
        cy.get('#viewPatientModal').should('not.be.visible');
      });
  
    });
    it('should allow creating a new staff profile', () => {
      cy.visit(`${environment.apiAngularUrl}/admin`);

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
      cy.visit(`${environment.apiAngularUrl}/admin`);

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
      cy.visit(`${environment.apiAngularUrl}/admin`);

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
          cy.get('button').contains('Read and Agree to Policy').click();
      
        });
    
        cy.get('#policyModal').should('be.visible');
    
          cy.get('#policyModal').within(() => {
            cy.get('#acceptPolicy').click({ force: true });
          });

      

        cy.get('#acceptPolicy').click({ force: true });

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
  
    

    /*it('should allow creating a new operation type', () => {

      // Visit the page and ensure the modal button is visible
      cy.visit(`${environment.apiAngularUrl}/admin`);

  
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