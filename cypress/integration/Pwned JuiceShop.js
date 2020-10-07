
// broken access control
import { adminSectionChallenge } from "../support/broken access control/adminSectionChallenge.js";
import { basketAccessChallenge } from "../support/broken access control/basketAccessChallenge.js";
import { basketManipulateChallenge } from "../support/broken access control/basketManipulateChallenge.js";
import { forgedFeedbackChallenge } from "../support/broken access control/forgedFeedbackChallenge.js";
import { forgedReviewChallenge } from "../support/broken access control/forgedReviewChallenge.js";

// improper input validation
import { registerAdminChallenge } from "../support/improper input validation/registerAdminChallenge.js";

// Injection
import { christmasSpecialChallenge } from '../support/injection/christmasSpecialChallenge'
import { loginAdminChallenge } from '../support/injection/loginAdminChallenge'

// Insecure deserialization
import { rceChallenge } from '../support/insecure deserialization/rceChallenge'

// Vulnerable Components
import { jwtUnsignedChallenge } from '../support/vulnerable components/jwtUnsignedChallenge' 

describe("Pwned JuiceShop", () => {
  
  describe("adding new user profile", () => {
  
    before(() => {
      // delete cookie ContinuousCode to reset scoreboard
      cy.clearCookies();
    });
      
    beforeEach(() => {
      // set cookie to mask popup
      cy.setCookie('welcomebanner_status', 'dismiss');
      cy.setCookie('cookieconsent_status', 'dismiss');
    });
  
    it("can register a cypress user", () => {
      cy.signup('cypress@mail.com','cypress');
    });
  
    it("can create a shipping address", () => {
        
      cy.signin('cypress@mail.com','cypress');
      
      cy.get('@token').then((token) => {
      
        const options = {
          method: 'POST',
          url: '/api/Addresss',
          body: {
            city: "Fruit City",
            country: "Fruit Country",
            fullName: "Cypress Home",
            mobileNum: 1000000000,
            state: "Fruit State",
            streetAddress: "123 Fruit Street",
            zipCode: "12345"
          },
          auth: {
            bearer: token
          }
        }

        cy.request(options).then((resp) => {
            expect(resp.status).to.eq(201);
            expect(resp.body.status).to.eq('success');
        });
        
      });
      
    });
    
    it("can add a credit or debit card", () => {
        
      cy.signin('cypress@mail.com','cypress');
      
      cy.get('@token').then((token) => {
          
        const options = {
          method: 'POST',
          url: '/api/Cards',
          body: {
            cardNum: 4000000000000000,
            expMonth: "12",
            expYear: "2080",
            fullName: "Cypress Credit Card"
          },
          auth: {
            bearer: token
          }
        };

        cy.request(options).then((resp) => {
            expect(resp.status).to.eq(201);
            expect(resp.body.status).to.eq('success');
            //{"status":"success"
        });
      });
        
    });
  
  });
  
  describe("solving miscellaneous challenge", () => {
      
    beforeEach(() => {
      // set cookie to mask popup
      cy.setCookie('welcomebanner_status', 'dismiss');
      cy.setCookie('cookieconsent_status', 'dismiss');
    });
      
    it("Find the carefully hidden ‘Score Board’ page.", () => {
      
      cy.visit('/#/score-board')
      .then(() => {
        cy.isSolvedChallenge('scoreBoardChallenge').should('eq', true);
      });
        
    });
      
  });
  
  describe("solving Security Misconfiguration challenge", () => {
      
    beforeEach(() => {
      // set cookie to mask popup
      cy.setCookie('welcomebanner_status', 'dismiss');
      cy.setCookie('cookieconsent_status', 'dismiss');
    });
      
    it("Provoke an error that is neither very gracefully nor consistently handled", () => {
      cy.visit('/rest/non-existing-ressource', {failOnStatusCode: false})
      cy.isSolvedChallenge('errorHandlingChallenge').should('eq', true);
    });
      
  });
  
  
  describe("solving improper input validation challenges", () => {
      
    beforeEach(() => {
      // set cookie to mask popup
      cy.setCookie('welcomebanner_status', 'dismiss');
      cy.setCookie('cookieconsent_status', 'dismiss');
    });
    
    it("Register as a user with administrator privileges", () => {
      registerAdminChallenge();
    });
    
  });
  
  
  describe("solving broken access control challenges", () => {
      
    beforeEach(() => {
      // set cookie to mask popup
      cy.setCookie('welcomebanner_status', 'dismiss');
      cy.setCookie('cookieconsent_status', 'dismiss');
    });

    it("Access the administration section of the store.", () => {
      adminSectionChallenge();
    });
    
    it("View another user’s shopping basket", () => {
      basketAccessChallenge();
    });
    
    it("Put an additional product into another user's shopping basket", () => {
      basketManipulateChallenge();
    });
    
    it("Post some feedback in another users name", () => {
      forgedFeedbackChallenge();
    });
  
    it("Post a product review as another user or edit any user’s existing review", () => {
      forgedReviewChallenge();
    });
    
  });
  
    
  describe("solving injection challenges", () => {
      
    beforeEach(() => {
      // set cookie to mask popup
      cy.setCookie('welcomebanner_status', 'dismiss');
      cy.setCookie('cookieconsent_status', 'dismiss');
    });
    
    it("Order the Christmas special offer of 2014.", () => { 
        christmasSpecialChallenge();
    });
    
    it("Log in with the administrator’s user account.", () => {
      loginAdminChallenge();
    });
      
  });
  
  
  describe("Solving insecure deserialization challenges", () => {
      
    beforeEach(() => {
      // set cookie to mask popup
      cy.setCookie('welcomebanner_status', 'dismiss');
      cy.setCookie('cookieconsent_status', 'dismiss');
    });
  
    it("Perform a Remote Code Execution that would keep a less hardened application busy forever", () => {
      rceChallenge();
    });
  
  });
  
  describe("Solving vulnerable components challenges", () => {
      
    beforeEach(() => {
      // set cookie to mask popup
      cy.setCookie('welcomebanner_status', 'dismiss');
      cy.setCookie('cookieconsent_status', 'dismiss');
    });
  
    it("Forge an essentially unsigned JWT token that impersonates the (non-existing) user jwtn3d@juice-sh.op", () => {
      jwtUnsignedChallenge();
    });
    
  });

  
  after(() => {
    cy.visit('/#/score-board');
  });
    
});
