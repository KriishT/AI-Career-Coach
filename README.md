# AI Career Coach

An AI-powered career coaching application built with Next.js, Clerk authentication, and Prisma ORM.

## Features

- 🔐 Secure authentication with Clerk
- 📝 AI-powered resume builder
- 💼 Cover letter generator
- 🎯 Interview preparation with quizzes
- 📊 Career insights and analytics
- 🚀 Onboarding flow for new users

## Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Clerk account for authentication
- Google AI API key (for insights generation)

## Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/your_database_name"

# Google AI (for generating insights)
GOOGLE_AI_API_KEY=your_google_ai_api_key_here

# Inngest (for background jobs)
INNGEST_EVENT_KEY=your_inngest_event_key_here
INNGEST_SIGNING_KEY=your_inngest_signing_key_here
```

### Important Notes

- **Clerk Configuration**: Make sure to use production keys from your Clerk dashboard, not development keys
- **Database**: Ensure your PostgreSQL database is running and accessible
- **Redirect URLs**: Configure your Clerk application with the correct redirect URLs:
  - Sign-in redirect: `https://your-domain.com/dashboard`
  - Sign-up redirect: `https://your-domain.com/onboarding`

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

3. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
