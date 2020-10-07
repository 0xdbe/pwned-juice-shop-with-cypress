export function adminSectionChallenge() {
      
  // Prerequiste: Register as a user with administrator privileges
  cy.signin('pwned@juiceshop.com','pwned');
      
  // Access the administration section of the store
  cy.visit('/#/administration');
      
  // Wait ContinuousCode
  cy.wait(2000);
  cy.isSolvedChallenge('adminSectionChallenge').should('eq', true);

}
