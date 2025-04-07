# Deployment Guide for Background Remover

This application is optimized for deployment on Vercel. The configuration has been carefully tuned for performance, cost-efficiency, and reliability.

## Deployment Configuration

### Vercel.json Configuration

The `vercel.json` file includes the following optimizations:

#### 1. Cache Headers

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" },
        { "key": "Content-Encoding", "value": "br" }
      ]
    },
    {
      "source": "/(.*)\\.(jpg|jpeg|png|webp|svg|ico|css|js)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" },
        { "key": "X-Content-Type-Options", "value": "nosniff" }
      ]
    },
    {
      "source": "/_next/static/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "no-store, max-age=0" }
      ]
    }
  ]
}
```

These settings ensure:
- Static assets are aggressively cached for one year
- API routes are never cached to ensure fresh results
- Security headers are properly set

#### 2. Function Configuration

```json
"functions": {
  "api/remove-bg/route.ts": {
    "maxDuration": 20
  }
}
```

This setting:
- Extends the maximum execution time for the background removal API to 20 seconds
- Allows sufficient time for the U²-Net model to process larger images

#### 3. Compression

```json
"compression": {
  "brotli": {
    "enable": true
  }
}
```

Brotli compression:
- Reduces asset size by ~20% compared to gzip
- Improves page load times
- Reduces bandwidth consumption

### Next.js Configuration

In `next.config.js`, we've added the following optimizations:

```js
{
  output: 'standalone',
  swcMinify: true,
  poweredByHeader: false
}
```

These settings:
- `output: 'standalone'`: Creates a standalone output that includes only the necessary dependencies, reducing deployment size
- `swcMinify: true`: Uses SWC for minification instead of terser for faster builds
- `poweredByHeader: false`: Removes the X-Powered-By header for security

## Environment Variables

Make sure to set the following environment variable in your Vercel project settings:

- `REPLICATE_API_TOKEN`: Your Replicate API token for accessing the U²-Net model

## Deployment Steps

1. Connect your GitHub repository to Vercel
2. Add your environment variables in the Vercel dashboard
3. Deploy with the production branch

## Monitoring and Maintenance

- Use Vercel Analytics to monitor performance
- Check function execution times and adjust the `maxDuration` if needed
- Monitor rate limiting effectiveness

## Optimization Benefits

- Faster page loads due to proper caching and compression
- Lower bandwidth costs from optimized assets
- Better user experience with responsive design and quick image processing 