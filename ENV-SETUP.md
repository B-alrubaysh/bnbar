# Environment Setup for Background Remover

## Setup Instructions

1. Create an `.env.local` file in the root directory
2. Add your Replicate API token to the file:
```
REPLICATE_API_TOKEN=your_token_here
```

## Security Notes

- The Replicate API token is configured to be accessible **only on the server-side** through Next.js `serverRuntimeConfig`.
- The token is never exposed to the client browser.
- API requests are made server-side via our `/api/remove-bg` endpoint.
- Rate limiting is implemented to prevent token abuse.

## Getting a Replicate API Token

1. Sign up at [replicate.com](https://replicate.com)
2. Navigate to your account settings
3. Create an API token
4. Copy and paste the token into your `.env.local` file

## Testing Your Setup

To verify your token is working:

1. Start the development server: `npm run dev`
2. Upload an image on the app
3. Click "Remove Background"
4. If successful, you'll see the processed image with background removed
5. If unsuccessful, check the console for error messages

## Production Deployment

When deploying to Vercel, add the `REPLICATE_API_TOKEN` as an environment variable in the Vercel dashboard. 