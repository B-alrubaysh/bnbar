// ***********************************************
// Custom commands for Cypress tests
// ***********************************************
import 'cypress-file-upload';

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Upload a file to the dropzone
       * @param fileName - Name of the file in the fixtures folder
       * @example cy.uploadFile('valid-image.png')
       */
      uploadFile(fileName: string): Chainable<Element>;

      /**
       * Wait for the background removal process to complete
       * @example cy.waitForProcessing()
       */
      waitForProcessing(): Chainable<Element>;

      /**
       * Verify that a processed image appears
       * @example cy.verifyProcessedImage()
       */
      verifyProcessedImage(): Chainable<Element>;
    }
  }
}

// Command to upload a file to the dropzone
Cypress.Commands.add('uploadFile', (fileName: string) => {
  cy.get('input[type="file"]').attachFile(fileName);
});

// Command to wait for processing to complete
Cypress.Commands.add('waitForProcessing', () => {
  // First, check if processing has started
  cy.get('button').contains('Removing Background...').should('exist');
  
  // Then wait for processing to complete (button to disappear)
  cy.get('button').contains('Removing Background...', { timeout: 15000 }).should('not.exist');
});

// Command to verify a processed image appears
Cypress.Commands.add('verifyProcessedImage', () => {
  cy.get('div').contains('Background Removed').should('exist');
  cy.get('a').contains('Download Image').should('exist');
});

export {}; 