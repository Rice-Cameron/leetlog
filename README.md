# LeetLog

**Live Demo:** [https://leetlog-livid.vercel.app/](https://leetlog-livid.vercel.app/)

A modern web application for tracking and organizing your LeetCode problem solving journey. LeetLog helps you keep track of the problems you've solved, your solutions, and important metadata like time and space complexity.

## Features

- Track LeetCode problems with title, URL, and difficulty
- Document solution approaches and challenges
- Record time and space complexity
- Track problem categories and trigger keywords
- Modern, responsive UI
- Built with TypeScript for type safety

## Tech Stack

- Next.js 15.3.4
- React 19
- TypeScript 5
- Tailwind CSS 4
- Prisma ORM 6.10.1
- Neon (PostgreSQL)

_Note: Initially, SQLite was used for local development, but was later replaced with Neon (PostgreSQL) once deployed._

## Getting Started

Then, edit `.env` to add your own secrets and configuration values.

1. Clone the repository:

   ```bash
   git clone https://github.com/Rice-Cameron/leetlog.git
   cd leetlog
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

   **Environment Variables:**

   Before running the app, copy the example environment file:

   ```bash
   cp .env.copy .env
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

- `/app` - Next.js App Router pages and components
- `/prisma` - Database schema and migrations
- `/src/types` - TypeScript type definitions
- `/public` - Static assets

## Development

The project uses Turbopack for faster development builds. You can run the development server with:

```bash
npm run dev --turbopack
```

### Local Webhook Development

For testing Clerk webhooks locally, you'll need to expose your local development server to the internet using ngrok:

1. **Install ngrok** (if not already installed):
   ```bash
   # macOS
   brew install ngrok
   
   # Or download from https://ngrok.com/download
   ```

2. **Start your development server**:
   ```bash
   npm run dev
   ```

3. **In a separate terminal, expose your local server**:
   ```bash
   ngrok http 3000
   ```

4. **Configure Clerk webhook**:
   - Copy the HTTPS forwarding URL from ngrok (e.g., `https://abc123.ngrok.io`)
   - Go to [Clerk Dashboard](https://dashboard.clerk.com)
   - Navigate to **Configure → Webhooks**
   - Click **Add Endpoint**
   - **Endpoint URL**: `https://your-ngrok-url.ngrok.io/api/webhooks/clerk`
   - **Events**: Select `user.created`, `user.updated`, `user.deleted`
   - Click **Create**
   - Copy the **Signing Secret** and add it to your `.env` as `CLERK_WEBHOOK_SECRET`

5. **Test the webhook**:
   - Create a new user in your app
   - Check your development server logs for webhook POST requests
   - Verify user records are created in your database

**Note**: ngrok URLs change each time you restart ngrok (unless you have a paid plan). Remember to update the webhook URL in Clerk Dashboard if your ngrok URL changes.

## Building

To build the project for production, run:

```bash
npm run build
```

## Database Management

### Prisma Commands

To run the Prisma Studio:

```bash
npx prisma studio
```

To generate Prisma Client:

```bash
npx prisma generate
```

### Database Scripts

⚠️  **IMPORTANT**: All database scripts include environment detection and safety prompts to prevent accidental data loss.

```bash
# Seeding (adds sample data)
npm run seed          # Protected seeding with confirmation prompts
npm run safe-seed     # Alternative seeding script  
npm run quick-data    # Add sample problems (requires existing user)

# Database Reset (DANGEROUS)
npm run safe-reset    # Reset all tables (BLOCKED for production)
```

### Database Safety Features

- **Environment Detection**: Automatically detects production/test/development environments
- **Production Protection**: Blocks destructive operations on production databases  
- **Confirmation Prompts**: Requires explicit "CONFIRM DELETE" for dangerous operations
- **Backup Warnings**: Shows data counts before destructive operations
- **URL Validation**: Checks database URL patterns to identify environments

**Production databases are protected** - destructive operations either require explicit confirmation or are blocked entirely.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## TODO

- [ ] Add more analytics and visualizations
- [ ] Implement more user settings
- [ ] Add support for importing/exporting problems
- [ ] Improve mobile responsiveness
- [ ] Write tests
- [ ] Implement dark mode
- [ ] AI Integration to analyze weeks work of Leetcode problems
- [ ] Add Leetcode tips sections

## Database Recommendation

This project uses [Neon](https://neon.tech/) with PostgreSQL for both local development and production. Neon offers a free, serverless, and cloud-native PostgreSQL database that works perfectly with Vercel and Prisma.
