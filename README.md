# LeetLog

**Live Demo:** [https://leetlog-livid.vercel.app/](https://leetlog-livid.vercel.app/)

A modern web application for tracking and organizing your LeetCode problem solving journey. LeetLog helps you keep track of the problems you've solved, your solutions, and important metadata like time and space complexity.

## Features

- Track LeetCode problems with title, URL, and difficulty
- Document solution approaches and challenges
- Record time and space complexity
- Track problem categories and trigger keywords
- Modern, responsive UI with dark mode support
- Built with TypeScript for type safety

## Tech Stack

- Next.js 15.3.4
- React 19
- TypeScript 5
- Tailwind CSS 4
- Prisma ORM 6.10.1
- SQLite Database

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/Rice-Cameron/leetlog.git
   cd leetlog
   ```

2. Install dependencies:

   ```bash
   npm install
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

## Building

To build the project for production, run:

```bash
npm run build
```

## Prisma

To run the Prisma Studio, run:

```bash
npm run studio
```

To generate Prisma Client, run:

```bash
npm run generate
```

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
