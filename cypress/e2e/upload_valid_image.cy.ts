describe('Valid Image Upload and Processing', () => {
  beforeEach(() => {
    // Intercept API calls
    cy.intercept('POST', '/api/remove-bg', {
      statusCode: 200,
      fixture: 'valid-image.json',
      headers: {
        'Content-Type': 'image/png',
      },
      delay: 1000, // Simulate 1 second processing time
    }).as('removeBackground');

    // Visit the homepage
    cy.visit('/');
  });

  it('should upload a valid image, process it, and show download button', () => {
    // Upload a valid image
    cy.fixture('valid-image.png', 'base64').then((fileContent) => {
      cy.get('input[type="file"]').attachFile({
        fileContent,
        fileName: 'valid-image.png',
        mimeType: 'image/png',
        encoding: 'base64',
      });
    });

    // Verify the file was uploaded
    cy.contains('valid-image.png').should('be.visible');

    // Click the "Remove Background" button
    cy.contains('button', 'Remove Background').click();

    // Wait for processing to start and complete
    cy.contains('Removing Background...').should('be.visible');
    cy.wait('@removeBackground');
    cy.contains('Removing Background...').should('not.exist');

    // Verify the processed image appears
    cy.contains('Background Removed').should('be.visible');
    cy.get('a').contains('Download Image').should('be.visible');

    // Test download button triggers download (we can't test the actual download)
    cy.get('a').contains('Download Image').should('have.attr', 'download');

    // Test "Try Another Image" button works
    cy.contains('button', 'Try Another Image').click();
    cy.contains('Upload Image').should('be.visible');
    cy.contains('valid-image.png').should('not.exist');
  });
}); 