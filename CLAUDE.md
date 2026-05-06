# CLAUDE.md — leave-management-web

## Who You Are Working With
This is Precious Motloung, a junior developer building
a BBD graduate portfolio. This Angular frontend connects
to the leave-management-service Spring Boot backend.
It must look professional and enterprise-ready using
Angular Material only.

## Project Overview
Angular 17+ frontend for the Leave Management System.
Two user roles — EMPLOYEE and MANAGER — each with their
own dashboard, navigation and feature set. Connects to
Spring Boot backend running on localhost:8080.

## Tech Stack — use these exact versions
- Angular 17+
- TypeScript 5.x with strict mode enabled
- Angular Material 17+
- RxJS 7.x
- Angular Router
- HttpClient with interceptors
- JWT decoding (jwt-decode library)

## Folder Structure — never deviate from this
src/app/
├── core/
│   ├── guards/
│   │   ├── auth.guard.ts
│   │   └── role.guard.ts
│   ├── interceptors/
│   │   └── jwt.interceptor.ts
│   ├── models/
│   │   ├── user.model.ts
│   │   ├── leave-request.model.ts
│   │   ├── leave-balance.model.ts
│   │   ├── leave-type.model.ts
│   │   └── auth.model.ts
│   └── services/
│       ├── auth.service.ts
│       └── leave.service.ts
├── features/
│   ├── auth/
│   │   ├── login/
│   │   │   ├── login.component.ts
│   │   │   ├── login.component.html
│   │   │   └── login.component.scss
│   │   └── register/
│   │       ├── register.component.ts
│   │       ├── register.component.html
│   │       └── register.component.scss
│   ├── employee/
│   │   ├── dashboard/
│   │   ├── my-leaves/
│   │   └── apply-leave/
│   └── manager/
│       ├── dashboard/
│       ├── pending-requests/
│       └── team-balances/
├── shared/
│   ├── components/
│   │   ├── confirm-dialog/
│   │   ├── status-chip/
│   │   ├── loading-spinner/
│   │   └── empty-state/
│   ├── material.module.ts
│   └── pipes/
├── environments/
│   ├── environment.ts
│   └── environment.prod.ts
└── app-routing.module.ts

## Critical Rules — never break these
- Never store JWT in localStorage — sessionStorage only
- Never call HttpClient from a component — always
  through a service in core/services
- Never hardcode http://localhost:8080 — always use
  environment.apiUrl
- Never use any as a TypeScript type — always define
  proper interfaces in core/models
- Always use Angular Material — never Bootstrap,
  never plain CSS frameworks
- Always handle loading state — show spinner while
  HTTP call is pending
- Always handle error state — show error message
  when call fails
- Always use constructor injection in services
  and components
- Use takeUntilDestroyed() for Observable cleanup —
  never manual unsubscribe with a Subject
- Import all Angular Material modules through
  shared/material.module.ts only

## Environment Configuration
environment.ts:
apiUrl: 'http://localhost:8080'
environment.prod.ts:
apiUrl: ''
All services must use environment.apiUrl —
never a hardcoded URL string anywhere

## Authentication Rules
- AuthService stores JWT in sessionStorage
- AuthService decodes JWT to extract user role
- AuthGuard redirects to /login if no token
- RoleGuard redirects to correct dashboard by role:
  EMPLOYEE → /employee/dashboard
  MANAGER → /manager/dashboard
- JwtInterceptor adds Authorization: Bearer {token}
  to every outgoing request
- JwtInterceptor calls logout() and redirects to
  /login on any 401 response

## Routing Rules
/login → public
/register → public
/ → redirects to dashboard based on role
/employee/** → AuthGuard + RoleGuard (EMPLOYEE only)
/manager/** → AuthGuard + RoleGuard (MANAGER only)
/unauthorized → shown when role does not match route
/404 → shown for unknown routes

## UI Rules — enforce consistently
Status chip colors:
- PENDING = amber/orange
- APPROVED = green
- REJECTED = red
- CANCELLED = grey

Leave balance color coding:
- Above 5 days remaining = green
- 3 to 5 days remaining = amber
- Below 3 days remaining = red

Every form must:
- Show inline validation errors below each field
- Disable submit button while request is pending
- Show loading spinner on submit button
- Show success message on completion
- Show error message on failure

Every table must:
- Show loading spinner while fetching data
- Show empty state component when no data exists
- Never show a blank white area

Every destructive action must:
- Open ConfirmDialogComponent before executing
- Only proceed after user confirms

## Shared Components — build these once and reuse
ConfirmDialogComponent:
- Inputs: title, message, confirmText, cancelText
- Used for: cancel leave, approve leave, reject leave

StatusChipComponent:
- Input: status string
- Output: colored Material chip

LoadingSpinnerComponent:
- Full page overlay with centered spinner
- Used while any HTTP call is pending

EmptyStateComponent:
- Input: message, icon
- Used when tables or lists have no data

## Naming Conventions
- Component files: kebab-case
  (leave-request.component.ts)
- Classes and interfaces: PascalCase (LeaveRequest)
- Variables and methods: camelCase (getLeaveBalance)
- Observables: suffix with $ (leaveRequests$)
- Constants: UPPER_SNAKE_CASE
- Guards: suffix with .guard.ts
- Services: suffix with .service.ts
- Interceptors: suffix with .interceptor.ts

## Testing Requirements
- Every service must have a Jasmine unit test
- Every component must have a basic render test
- Use HttpClientTestingModule to mock HTTP calls
- Tests run with:
  ng test --watch=false --browsers=ChromeHeadless
- CI must run tests on every push to main
- CI must fail if any test fails

## GitHub Actions CI Requirements
- Trigger on push and pull_request to main
- Steps:
  npm install
  ng build --configuration production
  ng test --watch=false --browsers=ChromeHeadless
- Fail on any error

## Documentation Requirements
- README.md must include:
  What the app does in 2 sentences
  Tech stack with versions
  How to run locally in 3 commands
  How to connect to the backend
  List of all pages and what each one shows
  How to run tests

- CONCEPTS.md must explain in plain simple English:
  What Angular is
  What TypeScript is and why strict mode matters
  What a Component is
  What a Service is and why HTTP calls live there
  What an Interceptor is and what JWT interceptor does
  What a Guard is and how AuthGuard and RoleGuard work
  What RxJS Observables are
  What Angular Material is
  Why sessionStorage is used over localStorage
  What environment files do
  What the CI pipeline checks

- CLASS_GUIDE.md must document every class:
  What each component does
  What each service method does
  What each guard does and when it redirects
  What the interceptor does on each request
  What each unit test covers

## What To Tell Precious After Each Phase
Always end your response with this block exactly:

---
PHASE [N] COMPLETE

Verify with:
[exact command to run]

Commit message:
feat: [description of what was built this phase]

Push to GitHub then confirm you are ready for Phase [N+1].
---

## Common Mistakes — never do these
- Do not use localStorage — sessionStorage only
- Do not hardcode localhost:8080 in services
- Do not use any TypeScript type
- Do not import Material modules in every component —
  use shared MaterialModule
- Do not subscribe manually when async pipe works
- Do not leave loading or error states unhandled
- Do not call HttpClient directly from components
- Do not skip the phase complete block at the end
- Do not use Bootstrap or any CSS framework —
  Angular Material only
- Do not forget to add the commit message after
  every phase