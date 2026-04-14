# Booking Ticket Project

A modern booking ticket system built with Next.js, featuring localization, robust authentication, and high test coverage. The system manages core entities such as **Events**, **Seats**, and **Orders**.

## Project Structure

The project follows a modular structure within the `src` directory:

- **`prisma/`**: Database schema definitions and migrations.
- **`public/`**: Static assets such as images and fonts.
- **`src/app/`**: Next.js App Router directory.
  - **`[locale]/`**: Localized routes supporting multiple languages.
  - **`(auth)/`**: Authentication-related pages (Login, Signup).
  - **`(private)/`**: Protected routes accessible only to authenticated users.
  - **`(public)/`**: Publicly accessible pages.
  - **`api/`**: Backend API routes, including the Better Auth handler.
- **`src/actions/`**: Server Actions for handling data mutations and business logic on the server.
- **`src/components/`**: Reusable UI components.
- **`src/constants/`**: Global constants and configuration values.
- **`src/helpers/`**: Utility functions and core configuration (e.g., Auth client, logging).
- **`src/infrastructure/`**: Core infrastructure setup, such as the Prisma database client.
- **`src/schema/`**: Validation schemas (using Yup) for forms and data integrity.
- **`src/stores/`**: Client-side state management using Zustand.
- **`src/types/`**: Global TypeScript type definitions and interfaces.
- **`tests/`**: End-to-End (E2E) testing suite using Playwright.

## Libraries & Technologies

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Authentication**: [Better Auth](https://better-auth.com/)
- **Database/ORM**: [Prisma](https://www.prisma.io/) with PostgreSQL
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Localization**: `i18next`, `react-i18next`, and `next-i18n-router`
- **Forms & Validation**: `react-hook-form` and `yup`
- **Testing**:
  - **Unit/Integration**: [Vitest](https://vitest.dev/)
  - **E2E**: [Playwright](https://playwright.dev/)
- **Logging**: [Pino](https://github.com/pinojs/pino)
- **Error Tracking**: [Sentry](https://sentry.io/)
- **Code Quality**: [Biome](https://biomejs.dev/) (Fast Linting & Formatting)

## Workflow

### Development
1. **Environment Setup**: Copy `.env.example` to `.env` and fill in the necessary values.
2. **Install Dependencies**: `npm install`
3. **Database Migration**: Run `npx prisma migrate dev` to synchronize the database schema.
4. **Run Development Server**: `npm run dev`

### Building
- Generate production build: `npm run build`
- Preview production build locally: `npm run start`

### Code Quality
- **Linting & Formatting**: `npm run lint` or `npm run format` to ensure code consistency using Biome.

## Testing Flow

The project implements a multi-layered testing strategy to ensure reliability:

1. **Unit & Integration Tests (Vitest)**:
   - Focuses on utility functions, server actions, and logic validation.
   - Tests are co-located with the source code (e.g., `*.test.ts`).
   - Run tests: `npm run test`
   - UI mode for visual debugging: `npm run test:ui`

2. **End-to-End Tests (Playwright)**:
   - Validates full user journeys across the application (Sign in, Sign up, etc.).
   - Tests are located in the root `tests/` directory.
   - Run tests: `npm run test:e2e`

## Authentication Flow

Authentication is powered by **Better Auth**, providing a secure and flexible experience:

1. **Integrated Configuration**: The core logic is defined in `src/helpers/auth.ts`, utilizing Prisma as the database adapter.
2. **Standardized API**: Auth requests are processed through a catch-all API route at `src/app/api/auth/[...all]`.
3. **Consistent Client Access**: Sign-in, sign-up, and session management are performed using a unified auth client helper.
4. **Security Measures**:
   - **Password Protection**: Passwords are securely hashed using `bcrypt`.
   - **Session Management**: Secure sessions with configurable expiration and automatic updates.
5. **Authorization & Roles**: Support for user roles (e.g., `USER`, `ADMIN`) is built directly into the user schema and authentication logic.
