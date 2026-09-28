# Articulate

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.2.0.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Authentication and multi-user testing

Google and email/password use the same Firebase Authentication project and session.
In Firebase Console for `articulate-241c7`, open Authentication > Sign-in method,
enable Email/Password, and save (keep Google enabled). No manual user creation is
needed: choose "Create an account" on the landing page to register each test user.
Signup requires a name, saved in Firebase Authentication as the user's `displayName`
before entering the app. If saving the name fails after account creation, "Save name"
retries the profile update without creating another account.
Existing email/password users created in Firebase Console can also sign in here.
Use distinct email addresses for distinct test users; an existing Google account's
email is not a separate test identity.

Use Sign out in the header to switch users. For simultaneous tests, use separate
browser profiles or a normal and private window, since tabs in one profile share
the Firebase session. Verify that each account sees only its own drafts and that
published stories and comments are shared. Passwords are handled by Firebase Auth,
not stored in Firestore. Live authentication requires the provider to be enabled;
unit tests mock Firebase and do not create real accounts.

## Content storage

The story editor uses ngx-quill (MIT) with Angular form binding and supports H1–H3
headings. The default image button selects PNG/JPEG files from the device and
embeds them as base64 data in the story; it does not upload to a storage service.
The complete story must fit within 500 KB, including embedded images. Oversized
stories show an inline error before saving. Existing URL images remain supported.
The optional thumbnail URL is separate from images in the story
and supplies the cover on article cards and the article page. Blank thumbnails use
the default cover. Deploy the updated Firestore rules before saving thumbnails.

ngx-quill uses Quill 2 (BSD-3-Clause) internally, loaded when the editor opens.
Kendo and its licensing/localization dependencies have been removed.

The existing Firebase project configuration is in `src/app/landing/firebase.config.ts`.
Enable Cloud Firestore in project `articulate-241c7` and deploy the checked-in access
rules before using the app:

```sh
firebase deploy --only firestore:rules --project articulate-241c7
```

This command requires the Firebase CLI and an account with deployment access.
Rules are not deployed by the application or build.

- `posts/{autoId}` stores drafts and published stories, including the author's profile.
  Drafts are readable/writable only by their owner; published stories are public.
  The document ID is also the article ID in URLs. Authors are derived from published
  Firestore posts; the most recently updated post supplies their profile.
- `comments/{autoId}` stores comments/replies linked by `articleId` and `parentId`.
  Likes use transactions and rules allow a user to change only their own membership.
- `FirestoreService` handles queries and atomic writes. `PublishingStore` and
  `CommentStore` expose server snapshots as reactive display state. Form fields and
  display signals are transient UI state, never a fallback database. Transactions fail
  offline; the UI retains unsaved form text and reports the failure.
- No seed catalog or browser-stored content is read, migrated, or written. An empty
  database displays an empty catalog. Theme preference remains a local UI setting.
- Content routes render in the browser so private data is never prerendered. Queries
  filter on one field and use Firestore's default single-field indexes.

Run `npm test -- --watch=false` and `npm run build` for local checks. Unit tests mock
Firestore boundaries; an authenticated live project or Firestore emulator is needed
for end-to-end permission and cross-client persistence verification.
