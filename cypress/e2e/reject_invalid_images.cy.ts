describe('Invalid Image Rejection', () => {
  beforeEach(() => {
    // Visit the homepage before each test
    cy.visit('/');
  });

  it('should reject oversized images (>5MB)', () => {
    // Create a simple fixture for an oversized file
    const oversizedFile = {
      fileName: 'oversized-image.png',
      filePath: 'oversized-image.json', // Reference the fixture
      mimeType: 'image/png',
    };

    // Mock the file validation function to simulate large file
    cy.window().then((win) => {
      cy.stub(win, 'File', function(bits: any[], name: string, options: any) {
        const file = new Blob(bits, options);
        Object.defineProperty(file, 'name', { value: name });
        Object.defineProperty(file, 'size', { value: 6 * 1024 * 1024 }); // 6MB
        return file as File;
      });
    });

    // Upload the oversized file
    cy.get('input[type="file"]').attachFile(oversizedFile);

    // Verify error message appears
    cy.contains('File size exceeds the maximum limit').should('be.visible');
    
    // Verify the remove background button is not visible
    cy.contains('button', 'Remove Background').should('not.exist');
  });

  it('should reject invalid file formats', () => {
    // Use a fixture for invalid format
    const invalidFormatFile = {
      fileName: 'invalid-format.gif',
      filePath: 'invalid-format.json', // Reference the fixture
      mimeType: 'image/gif',
    };

    // Upload the invalid format file
    cy.get('input[type="file"]').attachFile(invalidFormatFile);

    // Verify error message appears
    cy.contains('Invalid file type').should('be.visible');
    
    // Verify the remove background button is not visible
    cy.contains('button', 'Remove Background').should('not.exist');
  });
}); 