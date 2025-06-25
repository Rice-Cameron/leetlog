# Clerk Authentication Setup

This application now uses Clerk for user authentication. Follow these steps to set up Clerk:

## 1. Create a Clerk Account and Application

1. Go to [clerk.com](https://clerk.com) and create an account
2. Create a new application
3. Choose your preferred authentication methods (email/password, social logins, etc.)

## 2. Set Environment Variables

Copy your keys from the Clerk Dashboard and update `.env.local`:

```bash
# Clerk Keys (replace with your actual keys)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# Clerk URLs (these are already configured)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

## 3. Set Up Webhooks (Optional but Recommended)

1. In your Clerk Dashboard, go to Webhooks
2. Create a new webhook endpoint: `https://your-domain.com/api/webhooks/clerk`
3. Select events: `user.created`, `user.updated`, `user.deleted`
4. Copy the webhook secret and add it to your `.env.local` as `CLERK_WEBHOOK_SECRET`

## 4. Database Changes

The database schema now includes:
- A `User` table to store user information
- A foreign key relationship from `Problem` to `User`
- All problems are now associated with the user who created them

## 5. Authentication Features

- **Sign In/Sign Up**: Available at `/sign-in` and `/sign-up`
- **Protected Routes**: All problem-related pages require authentication
- **User Isolation**: Users can only see and manage their own problems
- **Homepage**: Shows different content based on authentication state

## 6. Development

Run the development server:

```bash
npm run dev
```

The app will now require users to sign in before they can create or view problems.
