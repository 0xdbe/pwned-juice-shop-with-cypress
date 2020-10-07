export function basketAccessChallenge() {
      
  cy.signin('cypress@mail.com','cypress');
    
  cy.get('@token').then((token) => {
        
    // Get basket ID
    var basketId = sessionStorage.getItem('bid') - 1;
    //var basketId = 5;

    const options = {
      method: 'GET',
      url: `/rest/basket/${basketId}`,
      auth: { 
        bearer: token
      }
    };

    cy.request(options).then(() => {
      cy.isSolvedChallenge('basketAccessChallenge').should('eq', true);
    });
        
  });
    
}
