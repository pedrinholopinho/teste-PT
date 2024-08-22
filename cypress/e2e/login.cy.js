describe('Login', () => {
    const loginUrl = 'https://passaportetecnico-hml.auto.marica.rj.gov.br/login';
    const validDocument = '017.914.337-90';
    const validPassword = '12345678';
    const invalidDocument = '189.394.837-40';
    const invalidPassword = 'teste senha errada';

    before(() => {
        cy.clearCookies();
        cy.clearLocalStorage();
    });

    afterEach(() => {
        cy.wait(2000); // Adiciona um tempo de espera de 2 segundos após cada teste
    });

    it('Não deve realizar login com credenciais inválidas', () => {
        cy.visit(loginUrl);

        cy.get('#document').type(invalidDocument);
        cy.get('#password').type(invalidPassword);
        cy.get('#loginButton').click();

        cy.get('span.invalid-feedback', { timeout: 15000 })
            .should('be.visible')
            .and('contain.text', 'Essas credenciais não correspondem aos nossos registros.')
            .then(() => {
                cy.window().then((win) => {
                    const message = 'LOGIN inválido';
                    win.alert(message);
                    cy.document().then((doc) => {
                        const modal = doc.createElement('div');
                        modal.innerHTML = `<div style="position:fixed;top:10%;left:50%;transform:translate(-50%, 0);padding:20px;background-color:#dc3545;color:white;border-radius:5px;">${message}</div>`;
                        doc.body.appendChild(modal);
                        setTimeout(() => doc.body.removeChild(modal), 3000); // Remove o modal após 3 segundos
                    });
                });
            });
    });

    it('Deve realizar login com sucesso com credenciais válidas', () => {
        cy.visit(loginUrl);

        cy.get('#document').type(validDocument);
        cy.get('#password').type(validPassword);
        cy.get('#loginButton').click();

        cy.url().should('include', '/dashboard-administrador')
            .then(() => {
                cy.window().then((win) => {
                    const message = 'LOGIN realizado com sucesso';
                    // Simula a exibição de um modal ou alerta
                    win.alert(message);
                    // Ou adiciona um modal diretamente no dom
                    cy.document().then((doc) => {
                        const modal = doc.createElement('div');
                        modal.innerHTML = `<div style="position:fixed;top:10%;left:50%;transform:translate(-50%, 0);padding:20px;background-color:#28a745;color:white;border-radius:5px;">${message}</div>`;
                        doc.body.appendChild(modal);
                        setTimeout(() => doc.body.removeChild(modal), 3000); // Remove o modal após 3 segundos
                    });
                });
            });

        cy.get('.menu > .far', { timeout: 15000 })
            .should('exist')
            .and('be.visible');
    });
});

describe('Funcionalidades após Login', () => {
    const loginUrl = 'https://passaportetecnico-hml.auto.marica.rj.gov.br/login';
    const validDocument = '017.914.337-90';
    const validPassword = '12345678';
    it('Deve incluir nova instituição', () => {
        cy.visit(loginUrl);
        cy.get('#document').type(validDocument);
        cy.get('#password').type(validPassword);
        cy.get('#loginButton').click();
        cy.get('.far.fa-bars').click();
        cy.contains('Instituições').click();
        cy.get('.btn.btn-passaporte-universitario-blue.btn_open_modal_institution').should('be.visible').click();
        cy.wait(3000);
        cy.get('#cnpj.form-control').should('be.visible').type('06.331.904/0001-86');
        cy.get('#name.form-control').should('be.visible').type('nome teste');
        cy.get('#contract_number.form-control').should('be.visible').type('1234567');
        cy.get('#contract_value.form-control').should('be.visible').type('123');
        cy.get('.btn.btn-outline-passaporte-off.toggle-off').should('be.visible').click();
        
        cy.wait(2000);

        cy.get('.btn.btn-passaporte-universitario-blue.btn_save_institution').should('be.visible').click();

        // Verifique se o elemento <span> com o texto '×' está visível e clique nele
        cy.get(".modal-content").should('be.visible');
        cy.get('#btn_modal_msg_close').click({force: true});
    
    });

});