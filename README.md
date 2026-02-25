This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Deploy on Heroku

### Prerequisites

- [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) installed
- A Heroku account

### Setup Steps

#### 1. Create the Procfile

Create a `Procfile` in the project root:

```
web: npm run start
```

#### 2. Configure Heroku

Login to Heroku and create a new app:

```bash
heroku login -i
heroku create your-app-name
```

#### 3. Set Buildpack

Configure the Node.js buildpack:

```bash
heroku buildpacks:set heroku/nodejs
```

#### 4. Configure Environment Variables

Set the required environment variables:

```bash
# Set Node.js version (optional but recommended)
heroku config:set NODE_ENV=production

# Set the port (Heroku sets PORT automatically, but Next.js needs to use it)
# Next.js automatically uses process.env.PORT

# Add any other environment variables your app needs
heroku config:set NEXT_PUBLIC_API_URL=https://your-api-url.com
```

#### 5. Configure pnpm for Heroku

Since this project uses pnpm, add the following to your `package.json`:

```json
{
  "engines": {
    "node": ">=18.0.0"
  },
  "corepack": {
    "enable": true
  }
}
```

Or set the environment variable to enable corepack:

```bash
heroku config:set ENABLE_COREPACK=1
```

#### 6. Deploy

Push your code to Heroku:

```bash
git push heroku main
```

Or deploy from a specific branch:

```bash
git push heroku your-branch:main
```

#### 7. Open the App

```bash
heroku open
```

### Useful Commands

```bash
# View logs
heroku logs --tail

# Restart the app
heroku restart

# Run a one-off command
heroku run bash

# Check app status
heroku ps

# View environment variables
heroku config
```

### Troubleshooting

**Build fails with memory issues:**
```bash
heroku config:set NODE_OPTIONS="--max_old_space_size=2560"
```

**Static files not loading:**
Ensure your `next.config.ts` has the correct configuration for production builds.

**Port binding issues:**
Next.js automatically binds to `process.env.PORT`. Ensure you're using `npm run start` (which runs `next start`) in your Procfile.
