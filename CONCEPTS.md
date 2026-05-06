# CONCEPTS.md — Understanding the Leave Management Frontend

This document explains every key concept used in this project in plain, simple English.
It is written for Precious Motloung as a learning reference during the BBD graduate programme.

---

## What is Angular?

Angular is a **framework for building web applications** made by Google.

Plain HTML is just a static document — it shows content but cannot react to user actions or load data from a server on its own. Angular adds superpowers on top of HTML:

- It lets you break your app into small, reusable **components** (like building blocks).
- It can automatically update the page when data changes, without reloading.
- It provides tools for routing (moving between pages), making HTTP requests, and protecting pages from unauthorised access.

Think of it like this: HTML is a wall. Angular is a smart building system that assembles walls, doors, and windows into a full house — and can rearrange the rooms whenever a user clicks something.

---

## What is TypeScript and Why Strict Mode?

TypeScript is JavaScript with **types added on top**. A type tells the code exactly what shape a value has — for example, whether something is a number, a string, or a complex object with specific fields.

**Why does this matter?**
- Without types, you can write `user.fistName` and only find out it is wrong when it crashes at runtime.
- With TypeScript, the editor tells you immediately: "There is no property `fistName` on `User` — did you mean `firstName`?"

**Strict mode** turns on the most rigorous set of TypeScript checks. It forces you to:
- Never use `null` or `undefined` by accident
- Always define proper types instead of using `any` (which disables all checks)
- Write cleaner, more predictable code

In a job environment, strict mode prevents entire categories of bugs before the code is even run.

---

## What is a Component?

A **Component** is a self-contained piece of the user interface. Every visible part of this app — the login form, the dashboard cards, the leave request table — is a component.

Each component has three parts:
| File | Purpose |
|---|---|
| `.ts` (TypeScript) | The logic — what data to show, what happens when a button is clicked |
| `.html` (Template) | The structure — what the user actually sees |
| `.scss` (Styles) | The look — colours, spacing, fonts |

**Example:** `LoginComponent` holds the login form. It manages the form fields, calls `AuthService.login()` when submitted, and shows an error message if the login fails. It knows nothing about how to make HTTP calls — that is the service's job.

---

## What is a Service and Why Do HTTP Calls Live There?

A **Service** is a class that holds shared logic and data that multiple components may need.

**Why not just make HTTP calls from the component?**

Imagine three different components all need to call `GET /api/leave/my-requests`. If each component made that call directly, you would have the same code written three times. If the URL ever changed, you would need to update three files.

With a service:
- The HTTP call lives in **one place** (`LeaveService`)
- Any component can inject and reuse it
- Testing is easy — you mock the service, not every component

This project has two services:
- **`AuthService`** — handles login, register, logout, and reading the JWT token
- **`LeaveService`** — handles all leave request and balance API calls

---

## What is an Interceptor and What Does the JWT Interceptor Do?

An **Interceptor** sits between your app and the backend. Every HTTP request passes through it, and it can inspect or modify the request before it leaves.

Think of it like a **toll booth on a highway** — every car (request) must pass through it.

The `JwtInterceptor` in this project does two things:

1. **Attaches the JWT token** to every outgoing request as an `Authorization: Bearer <token>` header. This tells the backend "I am logged in — here is my proof."

2. **Watches for 401 responses.** If the backend replies with 401 (Unauthorized — usually because the token expired), the interceptor automatically calls `logout()` and redirects the user to the login page. The user does not see a blank error screen — they are simply sent back to login.

Without the interceptor, every single HTTP call in every component and service would need to manually add the token header — that is dozens of places to forget.

---

## What is a Guard and How Do AuthGuard and RoleGuard Work?

A **Guard** is a function that decides whether a user is allowed to navigate to a route.

### AuthGuard
- **Question it asks:** "Is the user logged in?"
- **If yes:** Let them through.
- **If no:** Redirect to `/login`.

### RoleGuard
- **Question it asks:** "Does the user have the correct role for this route?"
- **If yes:** Let them through.
- **If their role is different:** Redirect them to their own correct dashboard (e.g. an EMPLOYEE trying to visit `/manager/dashboard` gets sent to `/employee/dashboard`).
- **If no role at all:** Redirect to `/unauthorized`.

Both guards run before the page loads. The user never sees protected content even for a fraction of a second — the redirect happens immediately.

---

## What are RxJS Observables?

RxJS is a library for working with **streams of data over time**.

An **Observable** is like a pipe. Data flows through it — sometimes immediately (like a HTTP response), sometimes repeatedly over time (like user keyboard events).

Instead of writing:
```javascript
// Old callback style
http.get('/api/data', function(response) { ... });
```

You write:
```typescript
// Observable style
this.http.get('/api/data').subscribe({
  next: (data) => { /* use the data */ },
  error: (err) => { /* handle the error */ }
});
```

**Key operators used in this project:**
- `pipe()` — chains operations together
- `takeUntilDestroyed()` — automatically cancels the subscription when the component is destroyed, preventing memory leaks
- `forkJoin()` — runs multiple HTTP calls in parallel and waits for all of them to finish
- `tap()` — performs a side effect (like saving the token) without changing the data

---

## What is Angular Material?

**Angular Material** is a library of pre-built UI components made by the Angular team, following Google's Material Design guidelines.

Instead of building a button, a form field, a table, or a date picker from scratch, you use:
- `<mat-button>` — a styled button
- `<mat-form-field>` — a form input with floating label and validation
- `<mat-table>` — a sortable, paginated data table
- `<mat-dialog>` — a modal popup
- `<mat-snack-bar>` — a toast notification

All components in this project import Material modules through `shared/material.module.ts` — a single place to manage all Material imports rather than repeating them in every component file.

---

## Why SessionStorage Instead of localStorage?

Both `sessionStorage` and `localStorage` store data in the browser. The difference is **how long the data lasts**:

| | sessionStorage | localStorage |
|---|---|---|
| Survives page refresh | ✅ Yes | ✅ Yes |
| Survives closing the tab | ❌ No — cleared | ✅ Yes — persists |
| Survives closing the browser | ❌ No — cleared | ✅ Yes — persists |

**Why sessionStorage is safer for JWTs:**

A JWT is a powerful token — whoever holds it can access the API as that user. If stored in `localStorage`, it stays in the browser indefinitely, even after the user thinks they have "closed" the app. A malicious script or XSS attack running later could steal it.

With `sessionStorage`, the token is **automatically deleted** when the user closes their tab or browser. This limits the window of exposure if something goes wrong.

---

## What Do Environment Files Do?

The app needs to know the URL of the backend API. But this URL is different depending on where the app is running:

- **During development** on your laptop: `http://localhost:8080`
- **In production** on a server: a relative URL or a different domain

Environment files solve this cleanly:

**`environment.ts`** (used during `ng serve` and development builds):
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080'
};
```

**`environment.prod.ts`** (used during `ng build --configuration production`):
```typescript
export const environment = {
  production: true,
  apiUrl: ''  // empty = uses relative URL, works when frontend and backend are on the same server
};
```

Every service imports `environment.apiUrl` instead of hardcoding the URL. When Angular builds for production, it automatically swaps the development file for the production file.

---

## What Does the CI Pipeline Check?

CI stands for **Continuous Integration**. It is an automated process that runs every time code is pushed to GitHub.

The `.github/workflows/ci.yml` file in this project runs three steps:

1. **`npm ci`** — Installs all dependencies cleanly from `package-lock.json`. This ensures the build uses the exact same package versions every time.

2. **`ng build --configuration production`** — Compiles the entire application for production. If there are any TypeScript errors, missing imports, or broken templates, this step fails and the build is blocked.

3. **`ng test --watch=false --browsers=ChromeHeadless`** — Runs all Jasmine unit tests in a headless Chrome browser (no visible window). If any test fails, the CI pipeline fails and the broken code cannot be merged.

**Why does this matter?**

Without CI, a developer could push broken code that compiles locally but fails in production, or code that silently breaks existing tests. CI acts as an automatic safety net — it catches problems before they reach the main branch.

