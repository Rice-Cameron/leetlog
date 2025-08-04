# LeetLog

**Live Demo:** [https://leetlog-livid.vercel.app/](https://leetlog-livid.vercel.app/)

A modern full-stack application for tracking LeetCode problem-solving progress with advanced database safety features and comprehensive testing infrastructure.

## Key Features

- **Problem Tracking**: LeetCode problems with difficulty, categories, and complexity analysis
- **Advanced Database Management**: Multi-environment system with production safety locks
- **Comprehensive Testing**: Vitest + isolated test database with 100% passing tests
- **Modern Stack**: Next.js 15, React 19, TypeScript, Prisma ORM, Neon PostgreSQL
- **Production Ready**: Deployed on Vercel with CI/CD and database migrations

## Tech Highlights

- **Backend**: Next.js 15 App Router, Prisma ORM, PostgreSQL (Neon)
- **Frontend**: React 19, TypeScript 5, Tailwind CSS 4
- **Authentication**: Clerk with webhook-based user management
- **Testing**: Vitest, React Testing Library, database isolation
- **Database Safety**: Multi-environment protection, confirmation prompts, automatic detection
- **DevOps**: Vercel deployment, environment management, schema migrations

## Quick Start

```bash
# Clone and setup
git clone https://github.com/Rice-Cameron/leetlog.git
cd leetlog
npm install

# Configure environment
cp .env.copy .env
# Edit .env with your database URLs and Clerk keys

# Start development
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Database Safety System

LeetLog implements a sophisticated `DATABASE_MODE` system to prevent accidental production data loss:

```bash
DATABASE_MODE=1  # Development (default)
DATABASE_MODE=2  # Production (protected)  
DATABASE_MODE=3  # Testing (isolated)
```

**Safety Features:**
- ✅ Production operations require explicit confirmation
- ✅ Tests automatically use isolated database branch
- ✅ Multiple validation layers prevent cross-environment contamination
- ✅ Runtime checks with detailed logging

## Key Commands

```bash
# Development
npm run dev              # Start dev server (with Turbopack support)
npm run build            # Production build

# Database
npx prisma studio        # Database browser
npm run seed             # Add sample data (production-safe)
npm run test-db-mode     # Validate database configuration

# Testing
npm run test             # Run full test suite
npm run test:ui          # Interactive test UI
```

## Project Architecture

```
src/
├── app/                 # Next.js App Router (pages & API)
├── components/          # Reusable UI components
├── lib/                 # Database config & utilities
├── types/               # TypeScript definitions
└── test/                # Test setup & utilities

scripts/                 # Database management scripts
docs/                    # Detailed documentation
```

## Documentation

- 🏗️ **[Technical Architecture](./src/README.md)** - Implementation details, patterns
- 🗄️ **[Database System](./docs/DATABASE_MODES.md)** - Environment management guide  
- 📊 **[Scripts & Tools](./scripts/README.md)** - Database utilities documentation

## Development Highlights

**Testing Infrastructure:**
- Vitest with React Testing Library
- Isolated test database (Neon branch)
- Sequential test execution for database safety
- Comprehensive API and component testing

**Database Safety:**
- Multi-environment configuration system
- Production database protection with confirmation prompts
- Automatic environment detection and validation
- Safe seeding and migration scripts

**Modern Development:**
- TypeScript strict mode with comprehensive type safety
- Tailwind CSS 4 for styling
- Clerk authentication with webhook integration
- Prisma ORM with PostgreSQL

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)  
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## TODO

- [ ] Add more analytics and visualizations
- [ ] Implement more user settings
- [ ] Add support for importing/exporting problems
- [ ] Improve mobile responsiveness
- [x] Write tests (Vitest + testing infrastructure complete)
- [ ] Implement dark mode
- [ ] AI Integration to analyze weeks work of Leetcode problems
- [ ] Add Leetcode tips sections

## License

MIT License - see LICENSE file for details.