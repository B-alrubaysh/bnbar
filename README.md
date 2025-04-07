# Instant Background Remover

A fast, efficient web application that removes backgrounds from images using U^2-Net.

## Features

- Simple, intuitive interface
- Instant background removal
- No registration required
- Free to use
- Lightning-fast processing

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- U^2-Net (via Replicate)
- Vercel Serverless Functions

## Development

```bash
# Install dependencies
npm install

# Run the development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Configuration

Environment variables:
- `REPLICATE_API_TOKEN` - Your Replicate API token (required for production)

## Deployment

This project is optimized for deployment on Vercel. 