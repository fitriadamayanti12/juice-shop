"use strict";
describe('/#/photo-wall', () => {
    beforeEach(() => {
        cy.visit('/#/forgot-password');
        cy.intercept('GET', '/rest/user/security-question?email=*').as('securityQuestion');
    });
    describe('challenge "geoStalkingMeta"', () => {
        it('Should be possible to find the answer to a security question in the meta-data of a photo on the photo wall', () => {
            cy.task('GetFromMemories', 'geoStalkingMetaSecurityAnswer').then((answer) => {
                cy.task('GetFromConfig', 'application.domain').then((appDomain) => {
                    cy.get('#email').type(`john@${appDomain}`);
                    cy.wait('@securityQuestion');
                    cy.get('#securityAnswer').should('not.be.disabled').focus().type(answer);
                    cy.get('#newPassword').focus().type('123456');
                    cy.get('#newPasswordRepeat').focus().type('123456');
                    cy.get('#resetButton').click();
                    cy.expectChallengeSolved({ challenge: 'Meta Geo Stalking' });
                });
            });
        });
    });
    describe('challenge "geoStalkingVisual"', () => {
        it('Should be possible to determine the answer to a security question by looking closely at an image on the photo wall', () => {
            cy.task('GetFromMemories', 'geoStalkingVisualSecurityAnswer').then((answer) => {
                cy.task('GetFromConfig', 'application.domain').then((appDomain) => {
                    cy.get('#email').type(`emma@${appDomain}`);
                    cy.wait('@securityQuestion');
                    cy.get('#securityAnswer').should('not.be.disabled').focus().type(answer);
                    cy.get('#newPassword').focus().type('123456');
                    cy.get('#newPasswordRepeat').focus().type('123456');
                    cy.get('#resetButton').click();
                    cy.expectChallengeSolved({ challenge: 'Visual Geo Stalking' });
                });
            });
        });
    });
});
//# sourceMappingURL=geoStalking.spec.js.map