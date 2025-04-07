# Testing Guide for Background Remover

This application includes a comprehensive suite of Cypress tests to verify its functionality. The tests cover a range of scenarios from the happy path to edge cases and error handling.

## Running the Tests

```bash
# Install dependencies
npm install

# Start the development server (in a separate terminal)
npm run dev

# Open Cypress UI for interactive testing
npm run cypress:open

# Run all tests headlessly
npm run test
```

## Test Coverage

The tests include:

### 1. Valid Image Upload (`upload_valid_image.cy.ts`)
- Uploading a valid PNG/JPEG image
- Processing the image
- Verifying the results appear
- Testing the "Try Another" button

### 2. Invalid Image Rejection (`reject_invalid_images.cy.ts`)
- Testing rejection of oversized images (>5MB)
- Testing rejection of invalid file formats (not PNG/JPEG)
- Verifying correct error messages

### 3. Download Processed Image (`download_processed_image.cy.ts`)
- Verifying that download functionality works
- Testing the blob URL creation
- Testing attributes of the download link

### 4. Edge Cases (`edge_cases.cy.ts`)
- Testing API error handling
- Testing corrupted image handling
- Testing spam protection (rate limiting)
- Testing behavior when uploading multiple files

## Adding Test Fixtures

Before running tests, you'll need to add some actual image files to the `cypress/fixtures` directory:

- `valid-image.png` - A valid PNG image under 5MB
- You can also add other test files as needed

## Mocking

The tests use Cypress intercept to mock API responses, allowing testing without actual backend processing. This includes:

- Mocking successful responses
- Mocking various error conditions
- Mocking rate-limiting

## Notes

- Some aspects of file downloading can't be fully tested in Cypress due to browser security restrictions
- For a complete end-to-end experience, we check for the presence of download attributes and blob URLs 