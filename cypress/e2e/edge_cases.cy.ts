describe('Edge Cases and Error Handling', () => {
  beforeEach(() => {
    // Visit the homepage before each test
    cy.visit('/');
  });

  it('should handle API errors gracefully', () => {
    // Intercept the API call and return an error
    cy.intercept('POST', '/api/remove-bg', {
      statusCode: 500,
      body: {
        error: 'Failed to process image',
        message: 'Internal server error occurred',
        statusCode: 500
      }
    }).as('apiError');

    // Upload a valid image
    cy.fixture('valid-image.png', 'base64').then((fileContent) => {
      cy.get('input[type="file"]').attachFile({
        fileContent,
        fileName: 'valid-image.png',
        mimeType: 'image/png',
        encoding: 'base64',
      });
    });

    // Click process button
    cy.contains('button', 'Remove Background').click();

    // Wait for API call to complete
    cy.wait('@apiError');

    // Verify error message is displayed
    cy.contains('Failed to process image').should('be.visible');
    cy.contains('Try Another').should('not.exist');
  });

  it('should handle corrupted images properly', () => {
    // Intercept the API call for corrupted image
    cy.intercept('POST', '/api/remove-bg', {
      statusCode: 400,
      body: {
        error: 'Failed to process image',
        message: 'Image appears to be corrupted',
        statusCode: 400
      }
    }).as('corruptedImage');

    // Upload a "corrupted" image 
    // We'll just use a normal fixture but mock the API to return an error
    cy.fixture('valid-image.png', 'base64').then((fileContent) => {
      cy.get('input[type="file"]').attachFile({
        fileContent,
        fileName: 'corrupted-image.png',
        mimeType: 'image/png',
        encoding: 'base64',
      });
    });

    // Click process button
    cy.contains('button', 'Remove Background').click();

    // Wait for API call to complete
    cy.wait('@corruptedImage');

    // Verify error message is displayed
    cy.contains('Failed to process image').should('be.visible');
    cy.contains('Image appears to be corrupted').should('be.visible');
  });

  it('should prevent rapid fire upload spam attempts', () => {
    // Intercept and mock the rate limit response
    cy.intercept('POST', '/api/remove-bg', {
      statusCode: 429,
      body: {
        error: 'Rate limit exceeded',
        message: 'Too many requests. Please try again later.',
        statusCode: 429,
        retryAfter: 60
      }
    }).as('rateLimited');

    // Upload a valid image multiple times
    for (let i = 0; i < 3; i++) {
      cy.fixture('valid-image.png', 'base64').then((fileContent) => {
        cy.get('input[type="file"]').attachFile({
          fileContent,
          fileName: `valid-image-${i}.png`,
          mimeType: 'image/png',
          encoding: 'base64',
        }, { force: true });
      });

      // Click process button
      cy.contains('button', 'Remove Background').click({ force: true });
      
      if (i < 2) {
        // Reset for next loop by clicking "Try Another" if not last loop
        cy.contains('button', 'Try Another Image').click({ force: true });
      }
    }

    // Wait for the rate limit error
    cy.wait('@rateLimited');

    // Verify rate limit error message is displayed
    cy.contains('Rate limit exceeded').should('be.visible');
    cy.contains('Too many requests').should('be.visible');
  });

  it('should handle double-upload attempts', () => {
    // Upload the first image
    cy.fixture('valid-image.png', 'base64').then((fileContent) => {
      cy.get('input[type="file"]').attachFile({
        fileContent,
        fileName: 'first-image.png',
        mimeType: 'image/png',
        encoding: 'base64',
      });
    });

    // Verify first image is uploaded
    cy.contains('first-image.png').should('be.visible');

    // Try to upload a second image without clicking "Try Another"
    cy.fixture('valid-image.png', 'base64').then((fileContent) => {
      cy.get('input[type="file"]').attachFile({
        fileContent,
        fileName: 'second-image.png',
        mimeType: 'image/png',
        encoding: 'base64',
      }, { force: true });
    });

    // Verify the second image replaced the first one
    cy.contains('second-image.png').should('be.visible');
    cy.contains('first-image.png').should('not.exist');
  });
}); 