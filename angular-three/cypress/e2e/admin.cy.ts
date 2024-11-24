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
    
    

    /*describe('Register Patient Form', () => {
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
    });*/


    /*describe('Admin Page Tests', () => {
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
    });*/
    
    
    



    /*describe('Patient Registration Form Validation', () => {
      beforeEach(() => {
         // Supondo que o formulário está na página inicial
        cy.get('.selectionDiv').contains('Register Patient Profile').click(); // Abrir o modal
      });
    
      it('Should show validation errors when required fields are not filled', () => {
        // Não preencher nada e tentar enviar
        cy.get('button[type="submit"]').click();
    
        // Verificar se os erros de validação aparecem
        cy.get('.invalid-feedback').should('be.visible');
      });
    
      it('Should show error for invalid email format', () => {
        // Preencher um email inválido
        cy.get('#validationCustomEmail').type('invalid-email');
        
        // Verificar erro de email inválido
        cy.get('#validationCustomEmail').parent().find('.invalid-feedback').should('be.visible');
      });
    });
    
    describe('Remove Appointment Date', () => {
      beforeEach(() => {
         // Supondo que o formulário está na página inicial
        cy.get('.selectionDiv').contains('Register Patient Profile').click(); // Abrir o modal
      });
    
      it('Should remove an appointment date from the list', () => {
        // Adicionar uma data
        cy.get('#input-date').type('2023-01-01').trigger('change');
        
        // Verificar se a data foi adicionada
        cy.get('#dates').should('contain', '2023-01-01');
        
        // Remover a data
        cy.get('#dates').contains('2023-01-01').parent().find('.delete-button').click();
        
        // Verificar se a data foi removida
        cy.get('#dates').should('not.contain', '2023-01-01');
      });
    });*/



    /*describe('Form Submit Button', () => {
      beforeEach(() => {
         // Supondo que o formulário está na página inicial
        cy.get('.selectionDiv').contains('Register Patient Profile').click(); // Abrir o modal
      });
    
      it('Should disable submit button when form is invalid', () => {
        // Não preencher nada
        cy.get('button[type="submit"]').should('be.disabled');
        
        // Preencher campos obrigatórios para torná-lo válido
        cy.get('#validationCustom01').type('John Doe');
        cy.get('#validationCustom02').type('1990-01-01');
        cy.get('#validationCustomEmail').type('johndoe@example.com');
        
        // Verificar se o botão é habilitado
        cy.get('button[type="submit"]').should('not.be.disabled');
      });
    });*/
    
    
    




  
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