describe('Download Processed Image', () => {
  beforeEach(() => {
    // Mock a successful API response
    cy.intercept('POST', '/api/remove-bg', { fixture: 'valid-image.png' }).as('processImage');
    
    // Visit the homepage
    cy.visit('/');
  });

  it('should allow downloading the processed image', () => {
    // Upload a valid image
    cy.fixture('valid-image.png', 'base64').then((fileContent) => {
      cy.get('input[type="file"]').attachFile({
        fileContent,
        fileName: 'valid-image.png',
        mimeType: 'image/png',
        encoding: 'base64',
      });
    });

    // Click the process button
    cy.contains('button', 'Remove Background').click();

    // Wait for processing to complete
    cy.wait('@processImage');

    // Verify processed image appears
    cy.contains('Background Removed').should('be.visible');

    // Test that download link has the correct attributes
    cy.get('a').contains('Download Image')
      .should('have.attr', 'download')
      .and('have.attr', 'href')
      .and('match', /^blob:/); // Should be a blob URL

    // We can't test the actual download in Cypress, but we can check that the link exists and has the right attributes
    cy.window().then((win) => {
      // Create a spy on window.URL.createObjectURL
      const spy = cy.spy(win.URL, 'createObjectURL');
      
      // Click "Try Another" and upload a new image to trigger a new URL creation
      cy.contains('button', 'Try Another Image').click();
      
      // Upload another image
      cy.fixture('valid-image.png', 'base64').then((fileContent) => {
        cy.get('input[type="file"]').attachFile({
          fileContent,
          fileName: 'another-image.png',
          mimeType: 'image/png',
          encoding: 'base64',
        });
      });
      
      // Process again
      cy.contains('button', 'Remove Background').click();
      cy.wait('@processImage');
      
      // Verify the URL.createObjectURL was called, indicating the download blob was created
      cy.wrap(spy).should('have.been.called');
    });
  });
}); 