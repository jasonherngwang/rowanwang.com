# PRD: CamelChords Integration

## 1. Introduction/Overview

This document outlines the requirements for integrating the standalone `camelchords` application into the main `rowanwang.com` project. The goal is to embed `camelchords` as a sub-application under the `/camelchords` route, leveraging the existing authentication, database, and UI systems of the main application.

The `camelchords` app allows users to generate, view, and manage ukulele song chords and lyrics. This integration will make it a seamless part of the main site, providing both public, read-only functionality and full-featured, write-access for authenticated users.

## 2. Goals

- Successfully migrate the `camelchords` frontend and backend logic into the `rowanwang.com` monorepo.
- Replace the original authentication system with the existing `better-auth` module.
- Merge the `camelchords` database schema into the main application's database.
- Integrate the `camelchords` app while allowing it to maintain its own independent and distinct UI and styling, separate from the main application.
- Establish a clear distinction between public (read-only) and private (full-access) functionality.
- Ensure the integrated app is robust, secure, and maintainable.

## 3. User Stories

- **As an unauthenticated user,** I want to visit `/camelchords` and view a selection of public songs so that I can see what the app is about without needing to sign up.
- **As an unauthenticated user,** I want to be prompted to sign in when I try to create or edit a song.
- **As an authenticated user,** I want to access all my saved songs and create new ones using the song generator.
- **As an authenticated user,** I want to be able to organize my songs into different libraries that I can create and manage.
- **As an authenticated user,** I want to be able to mark any of my songs as "public" so they can be viewed by anyone.
- **As an authenticated user,** I want my session from the main application to be automatically recognized in `camelchords` without needing to log in again.
- **As a user,** I understand that the `camelchords` sub-app has a unique look and feel that is different from the main website.

## 4. Functional Requirements

### 4.1. File Structure & Routing

1.  The `camelchords` application will be located in a new `src/app/camelchords/` directory.
2.  The main page of the app will be accessible at the `/camelchords` route.
3.  All app-specific components, hooks, and utilities from the original `camelchords` repo will be migrated into subdirectories within `src/app/camelchords/`.
4.  API routes required by `camelchords` will be moved to `src/app/api/camelchords/`.

### 4.2. Authentication

1.  The existing `better-auth` system will completely replace the authentication logic from the original `camelchords` app.
2.  The `/camelchords` route will be the main dashboard for authenticated users. A separate `/camelchords/public` route will exist for unauthenticated users.
3.  Write operations (creating, editing, deleting songs and libraries) must be protected and only available to authenticated users.
4.  If an unauthenticated user attempts a write action, they must be redirected to the sign-in page.

### 4.3. Database

1.  The database tables required for `camelchords` will be created within a new `camelchords` PostgreSQL schema.
2.  The `camelchords` schema will contain a `libraries` table (`id`, `name`, `userId`) and a `songs` table.
3.  The `songs` table will include a `libraryId` foreign key referencing the `libraries` table and an `isPublic` boolean flag (defaulting to `false`).
4.  When a user creates their first song, a default library named "Library" will be created for them automatically. All new songs will be placed in this library by default.
5.  A new Drizzle migration file must be created to set up the new `camelchords` schema and its tables. No data will be migrated from the old application.
6.  All database queries within `camelchords` must use the shared Drizzle instance from the main application's `src/lib/db/` and correctly reference tables within the `camelchords` schema.

### 4.4. UI/UX & Styling

1.  The `camelchords` application will maintain its own independent styling.
2.  The UI for authenticated users will feature a sidebar listing their libraries. Selecting a library will display the songs within it.
3.  A new page will be created at `/camelchords/public` to display a generic list of all public songs from all users. This view will not show user or library information.
4.  A new layout file will be created at `src/app/camelchords/layout.tsx`. This layout will be responsible for importing the specific stylesheets for the `camelchords` app.
5.  Styles from the original `camelchords` project should be consolidated into a dedicated stylesheet, e.g., `src/app/camelchords/camelchords.css`.
6.  The root `src/styles/globals.css` file should be reviewed and potentially stripped of any styles that are not truly global, to avoid conflicts with sub-app styles.

### 4.5. Environment

1.  The `GEMINI_API_KEY` required for song generation will be added to the main application's environment variables (`.env`).

## 5. Non-Goals (Out of Scope)

- **Data Migration:** No user data or song data will be migrated from the original `camelchords` application. The database will be set up from scratch.
- **Separate Authentication:** The app will not maintain any part of its original authentication system.
- **Separate Database:** The app will not connect to its own database; it will be fully integrated into the existing one using a dedicated schema.
- **New Feature Development:** This project is focused solely on integration. No new features will be added to `camelchords` at this time.

## 6. Design Considerations

- The UI for `camelchords` should follow the design principles of its original implementation. It does not need to use shared components from the main application's `src/components/ui/`.

## 7. Technical Considerations

1.  **Dependency Management:** Add all necessary dependencies from `camelchords`'s `package.json` to the root `package.json` of the main project and run `bun install`. Note any styling-related libraries (`shadcn/ui`, `tailwindcss-animate`, etc.) that might conflict and handle them on a case-by-case basis.
2.  **Code Migration:**
    - Copy `app`, `components`, `hooks`, `lib` from `camelchords` into a temporary folder.
    - Move and refactor code into `src/app/camelchords/`.
    - Merge any utility functions from `camelchords/lib` into `src/lib/` if they are generic, or keep them in `src/app/camelchords/utils/` if they are specific.
3.  **Styling Implementation:**
    - Create `src/app/camelchords/layout.tsx` to wrap the `camelchords` pages.
    - Create `src/app/camelchords/camelchords.css` and migrate all necessary styles into it.
    - Import `./camelchords.css` within the new layout file.
    - Audit `src/styles/globals.css` and move any non-essential, app-specific styles into their respective app stylesheets.
4.  **Database Schema and Migrations:**
    - Create a new schema definition file at `src/lib/db/schema/camelchords.ts`.
    - In this file, use Drizzle ORM to define a `pgSchema` named `camelchords`.
    - Define the `libraries` table and the `songs` table. The `songs` table must include `libraryId` and `isPublic` fields. Foreign keys should be configured to correctly reference the `libraries` table and the `public.users` table.
    - Add logic to create a default "Library" for a user upon creation of their first song.
    - Add the path to the new schema file (`./src/lib/db/schema/camelchords.ts`) to the `schema` array in `drizzle.config.ts`.
    - Run `bun run db:generate` to create a new migration file that contains the SQL to create the new schema and tables.
    - Run `bun run db:migrate` to apply the changes to the database.
5.  **Middleware:** The logic from `camelchords/middleware.ts` will be discarded in favor of the existing authentication checks.
6.  **Refactoring:** Component refactoring will now focus on adapting to the new data flow (auth and database) rather than adopting a new UI library.

## 8. Success Metrics

- The `camelchords` application is fully functional at `/camelchords`.
- The public song gallery is available at `/camelchords/public`.
- All write actions are successfully protected by `better-auth`.
- Authenticated users can create and manage libraries for their songs.
- The UI of `camelchords` loads correctly with its own distinct styling, without interfering with the main application's styles.
- The Lighthouse scores (Performance, Accessibility, Best Practices) for the new section are on par with the rest of the site.

## 9. Open Questions

- None at this time.
