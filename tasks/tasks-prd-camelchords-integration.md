## Relevant Files

- `src/app/camelchords/layout.tsx` - The new layout for the camelchords sub-app, responsible for its specific styling.
- `src/app/camelchords/page.tsx` - The main entry point and dashboard for authenticated users.
- `src/app/camelchords/public/page.tsx` - Page for viewing all public songs.
- `src/app/camelchords/components/Sidebar.tsx` - Component to display a user's libraries and songs.
- `src/app/camelchords/camelchords.css` - Dedicated stylesheet for the camelchords sub-app to ensure UI separation.
- `src/app/api/camelchords/songs/[...routes]/route.ts` - API handlers for song data (CRUD operations), protected by authentication.
- `src/app/api/camelchords/libraries/[...routes]/route.ts` - API handlers for library data (CRUD operations).
- `src/lib/db/schema/camelchords.ts` - New Drizzle schema definition for `libraries` and `songs` tables.
- `drizzle.config.ts` - Configuration for Drizzle ORM; will be updated to include the new schema file.
- `package.json` - Project dependencies; will be updated with dependencies from the original `camelchords` project.
- `.env.local` - Environment variables; will be updated to include the `GEMINI_API_KEY`.

### Notes

- Unit tests should be created alongside new components or utilities where complex logic is introduced.
- Use `bun run test` to run tests.

## Tasks

- [x] 1.0 Project Scaffolding and Configuration
  - [x] 1.1 Create the main directory for the sub-application at `src/app/camelchords/`.
  - [x] 1.2 Identify and merge necessary dependencies from the original `camelchords` `package.json` into the root `package.json`.
  - [x] 1.3 Run `bun install` to install the new dependencies.
  - [x] 1.4 Add the `GEMINI_API_KEY` to the project's `.env.local` file.
  - [x] 1.5 Update the `schema` array in `drizzle.config.ts` to include the path to the new `camelchords` schema file.

- [x] 2.0 Database Schema and Migration
  - [x] 2.1 Create the new schema file at `src/lib/db/schema/camelchords.ts`.
  - [x] 2.2 In the new schema file, define a `pgSchema` named `camelchords`.
  - [x] 2.3 Define the `libraries` table with columns for `id`, `name`, and `userId`.
  - [x] 2.4 Define the `songs` table with a foreign key `libraryId` and a boolean `isPublic`.
  - [x] 2.5 Run `bun run db:generate` to create the new database migration file.
  - [x] 2.6 Review the generated SQL migration file for correctness.
  - [x] 2.7 Run `bun run db:migrate` to apply the new schema to the database.

- [ ] 3.0 Core Application Logic Migration
  - [x] 3.1 Copy components, hooks, and utilities from the original `camelchords` project (https://github.com/jasonherngwang/camelchords) into temporary local folders. Only copy the core functionality, i.e. `app/library`, `components/layout`, `components/library`, `lib/actions/library`, and `lib/songs`. Ignore all auth, web scraping, rate limiting. Ignore NextJS placeholder pages like error, not-found, etc.
  - [x] 3.2 Move and refactor the copied files into the appropriate subdirectories within `src/app/camelchords/` (e.g., `components/`, `hooks/`, `utils/`). Simplify and improve wherever you think is best.
  - [x] 3.3 Refactor all database queries to use the shared Drizzle instance and correctly reference the new `camelchords` schema.
  - [x] 3.4 Implement business logic to automatically create a default "Library" for a user when they create their first song.
  - [x] 3.5 Adapt any logic that uses the song generation feature to pull the `GEMINI_API_KEY` from the application's environment.

- [ ] 4.0 Authentication and API Integration
  - [x] 4.1 Create the API route handlers for songs under `src/app/api/camelchords/songs/`.
  - [x] 4.2 Create the API route handlers for libraries under `src/app/api/camelchords/libraries/`.
  - [x] 4.3 Secure all API routes that perform write operations (create, edit, delete) using the existing `better-auth` middleware/helpers.
  - [x] 4.4 Implement client-side logic to redirect unauthenticated users to the sign-in page when they attempt write actions.
  - [x] 4.5 Remove all remnants of the original authentication system from the migrated code.

- [ ] 5.0 UI and Styling Segregation
  - [ ] 5.1 Create the layout file at `src/app/camelchords/layout.tsx`.
  - [ ] 5.2 Create the dedicated stylesheet at `src/app/camelchords/camelchords.css`.
  - [ ] 5.3 Consolidate and migrate all styles from the original `camelchords` project into `camelchords.css`.
  - [ ] 5.4 Import `camelchords.css` within `src/app/camelchords/layout.tsx` to apply the styles.
  - [ ] 5.5 Create the main app component at `src/app/camelchords/page.tsx` for the authenticated user dashboard.
  - [ ] 5.6 Audit `src/styles/globals.css` and refactor any non-global styles to prevent conflicts with the `camelchords` UI.

- [ ] 6.0 Library Management UI
  - [ ] 6.1 Create a `Sidebar.tsx` component to fetch and display the user's libraries.
  - [ ] 6.2 Implement UI functionality for creating, renaming, and deleting libraries.
  - [ ] 6.3 Add functionality to move a song from one library to another.
  - [ ] 6.4 Ensure the main content area displays the songs of the currently selected library.

- [ ] 7.0 Public Song Feature
  - [ ] 7.1 Create the page component at `src/app/camelchords/public/page.tsx`.
  - [ ] 7.2 Implement the API endpoint and client-side logic to fetch all songs where `isPublic` is true.
  - [ ] 7.3 Add a UI control (e.g., a toggle or button) in the authenticated view to allow a user to mark a song as public/private.
  - [ ] 7.4 Ensure the public view at `/camelchords/public` correctly displays public songs without any user or library details.

- [ ] 8.0 End-to-End Testing and Deployment Prep
  - [ ] 8.1 Test the public song gallery for unauthenticated users.
  - [ ] 8.2 Test all authenticated user flows, including song and library CRUD operations.
  - [ ] 8.3 Test making a song public and verifying it appears in the public gallery.
  - [ ] 8.4 Verify that the `camelchords` styling is correctly applied and isolated.
  - [ ] 8.5 Perform a Lighthouse audit on `/camelchords`