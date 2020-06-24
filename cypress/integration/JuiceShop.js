describe("JuiceShop setup", () => {
  
  before(() => {
    cy.setCookie('welcomebanner_status', 'dismiss');
    cy.setCookie('cookieconsent_status', 'dismiss');
  });
  
  beforeEach(() => {
    Cypress.Cookies.preserveOnce('welcomebanner_status', 'cookieconsent_status')
  });
  
  it("Register a cypress user", () => {

    cy.signup('cypress@mail.com','cypress');
    
  });
  
}
