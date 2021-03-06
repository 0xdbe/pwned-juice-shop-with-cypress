// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add("signup", (email, password) => { 
    
    // Forge POST request to create an admin user
    const options = {
      method: 'POST',
      url: '/api/Users/',
      form: true, // we are submitting a regular form body
      body: {
        email: email,
        password:password,
        passwordRepeat:password,
        securityQuestion: {
          id:5,
          question:'Maternal grandmother\'s first name?',
          createdAt:'2020-06-11T21:38:56.400Z',
          updatedAt:'2020-06-11T21:38:56.400Z'
        },
        "securityAnswer":"cypress"
      }
    }

    cy.request(options);
    
});

Cypress.Commands.add("signin", (email, password) => { 
    
    cy.visit('http://localhost:3000/#/login').then(() => {
        
      // Complete login form
      cy.get('#email').type(email);
      cy.get('#password').type(password);
      cy.get('#loginButton').click();
      
      // Waiting for token cookie (that will be set by front end)
      cy.wait(2000);
      
      // Check if token cookie exist
      cy.getCookie('token').should('exist');
     
      // Setting token alias
      cy.getCookie('token').then((cookie) => {
        cy.wrap(cookie.value).as('token');
      });
      
    });
    
});

Cypress.Commands.add('isSolvedChallenge', ( challengeKey ) => {
  cy.request('GET', `/api/Challenges/?key=${challengeKey}`)
    .then((resp) => {
      return resp.body.data[0].solved;
  })
});
