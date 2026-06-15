# HK Leadership & Innovation Summit — Seminar Application System

A full-stack serverless demo project for a professional seminar registration site. The frontend is a pure HTML/CSS/JavaScript static site deployed on **Vercel**; the backend is a **Spring Boot 3** REST API deployed on **Railway** with a **Supabase** (PostgreSQL) database.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Technology Stack](#technology-stack)
3. [Frontend](#frontend)
   - [Design System](#design-system)
   - [Shared Layout](#shared-layout)
   - [Page 1 — Landing Page (index.html)](#page-1--landing-page-indexhtml)
   - [Page 2 — Application Form (apply.html)](#page-2--application-form-applyhtml)
   - [JavaScript Modules](#javascript-modules)
4. [Backend](#backend)
   - [Project Structure](#backend-project-structure)
   - [Data Model](#data-model)
   - [DTOs](#dtos)
   - [Repository](#repository)
   - [Service Layer](#service-layer)
   - [REST API](#rest-api)
   - [CORS Configuration](#cors-configuration)
   - [Global Exception Handling](#global-exception-handling)
   - [Application Configuration](#application-configuration)
5. [Deployment](#deployment)

---

## Project Structure

```
demo-serverless-deployment/
├── frontend/                  # Static site — deploy to Vercel
│   ├── index.html             # Landing page with applications table
│   ├── apply.html             # Application submission form
│   ├── css/
│   │   └── style.css          # Full design system
│   ├── js/
│   │   ├── api.js             # Centralised fetch functions
│   │   ├── index.js           # Table rendering and pagination logic
│   │   └── apply.js           # Form validation and submission logic
│   └── vercel.json            # Vercel static hosting config
└── backend/                   # Spring Boot API — deploy to Railway
    ├── pom.xml
    └── src/main/
        ├── java/com/demo/seminar/
        │   ├── SeminarBackendApplication.java
        │   ├── config/
        │   │   ├── CorsConfig.java
        │   │   └── GlobalExceptionHandler.java
        │   ├── controller/
        │   │   └── ApplicationController.java
        │   ├── service/
        │   │   └── ApplicationService.java
        │   ├── repository/
        │   │   └── ApplicationRepository.java
        │   ├── model/
        │   │   └── Application.java
        │   └── dto/
        │       ├── ApplicationRequest.java
        │       └── ApplicationResponse.java
        └── resources/
            └── application.properties
```

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript (ES2020+) |
| Font | Inter (Google Fonts) — weights 400, 500, 600, 700 |
| Backend | Spring Boot 3.3.4, Java 21 |
| Persistence | Spring Data JPA, Hibernate 6, PostgreSQL |
| Validation | Jakarta Bean Validation (`spring-boot-starter-validation`) |
| Code generation | Lombok (`@Getter`, `@Setter`, `@Builder`, `@RequiredArgsConstructor`) |
| Observability | Spring Boot Actuator (health endpoint) |
| Database | Supabase (hosted PostgreSQL) |
| Backend hosting | Railway (auto-detected Maven build via Nixpacks) |
| Frontend hosting | Vercel (static file serving) |

---

## Frontend

### Design System

All visual tokens are defined as CSS custom properties in `css/style.css` and reused across every component:

```css
--navy:       #0D1B2A   /* primary background: header, hero, table head */
--navy-light: #1A2E45   /* hover states */
--gold:       #C9A84C   /* accent: underline, CTA buttons, section markers */
--gold-hover: #B8942F   /* gold button hover */
--white:      #FFFFFF
--bg:         #F5F6FA   /* page background */
--border:     #E2E8F0   /* card and input borders */
--text:       #1A2332   /* primary body text */
--text-muted: #4A5568   /* secondary text, table cells */
--text-light: #718096   /* tertiary text, row numbers */
--success:    #2D6A4F   /* success alert */
--error:      #C62828   /* error alert, field error text */
--radius:     6px        /* global border radius */
--shadow:     0 2px 16px rgba(13,27,42,0.08)   /* card elevation */
```

**Typography** uses the `Inter` typeface loaded from Google Fonts. Labels are rendered at `11px / 700 weight / 0.06em letter-spacing / uppercase`, giving them a refined tag-like appearance. Body text is `14px / 400 weight`. Page-level headings reach `30px / 700 weight`.

**Responsive breakpoint:** At `640px` and below, the two-column form grid collapses to a single column, hero text scales down to `22px`, and form card padding reduces from `40px` to `24px`.

---

### Shared Layout

Both pages share an identical header and footer defined in `css/style.css`.

**Sticky header** (`position: sticky; top: 0; z-index: 100`) — navy background with a `2px solid gold` bottom border. Contains:
- Left: two-line logo — event name in white uppercase (`13px / 700`) above the sub-label "Hong Kong · 2026" in gold (`10px / uppercase`)
- Right: navigation links + a primary CTA button

**Footer** — navy background, centred text at `12px / 0.04em letter-spacing`, event name highlighted in gold.

**Container** — `max-width: 960px`, horizontally centred, `padding: 0 24px` to maintain gutters on all screen sizes.

**Button variants** defined globally:

| Class | Appearance | Use case |
|-------|-----------|---------|
| `.btn-primary` | Gold fill, navy text | Hero CTA, form submit |
| `.btn-outline` | Transparent, white text, white border | Header navigation |
| `.btn-ghost` | Transparent, muted text, light border | Form cancel action |

All buttons share `font-weight: 600 / letter-spacing: 0.05em / text-transform: uppercase` and a `transform: translateY(1px)` press effect on `:active`.

---

### Page 1 — Landing Page (`index.html`)

#### Hero Section

A full-width dark navy block (`padding: 64px 24px`) with a `3px solid gold` bottom border. Contains:
- **Eyebrow** — "Exclusive Annual Event" in gold uppercase at `11px / 0.2em letter-spacing`
- **Headline** — "Hong Kong Leadership & Innovation Summit 2026" at `30px / 700 weight`
- **Meta row** — three inline icon+text items (date, venue, availability) rendered with inline SVG icons, colour `rgba(255,255,255,0.55)`
- **CTA button** — "Submit Application" linking to `apply.html`

#### Applications Table Section

Positioned below the hero on a `#F5F6FA` page background. Wrapped in a `.card` component (white background, `8px` border-radius, `box-shadow`, `1px` border).

The table has six columns:

| Column | Content |
|--------|---------|
| `#` | Sequential row number across pages (e.g. page 2 row 1 shows `8`) |
| Full Name | Bold, primary text colour — the applicant's name |
| Email | Slightly smaller `13px` text |
| Session | Gold pill badge — "Morning Session", "Afternoon Session", or "Evening Session" |
| Industry | Plain text; shows `—` when not provided |
| Submitted | Date formatted as `dd Mon yyyy` using `en-HK` locale |

**Table header** (`<thead>`) uses the navy background with uppercase `11px` column labels at `0.1em letter-spacing` and `rgba(255,255,255,0.6)` colour. The first and last header cells have a `border-radius` to round the top corners of the card.

**Row hover** — each `<tbody>` row transitions to `#F8F9FC` on hover. The last row's bottom border is removed to avoid double borders with the card.

**All string values are XSS-escaped** via a dedicated `esc()` function in `index.js` before being injected into `innerHTML`.

#### Loading, Empty, and Error States

The table area manages three distinct UI states through a `#table-state` div toggled alongside the `<table>`:

- **Loading** — CSS-animated spinner (24px circular border, `0.6s linear` spin, navy `border-top-color`) with "Loading applications…" text
- **Empty** — text "No applications yet." with an inline link "Be the first to apply →" to `apply.html`
- **Error** — "Failed to load applications. Please refresh the page."

#### Pagination

Rendered below the table inside a flex `.pagination` container. Appears only when `totalPages > 1`.

The algorithm shows at most five numbered buttons centred around the current page, with `…` ellipsis inserted when there is a gap to the first or last page:

```
← Prev   1   …   4   [5]   6   …   12   Next →
```

- `← Prev` is disabled (`opacity: 0.35; cursor: not-allowed`) on the first page
- `Next →` is disabled on the last page
- The active page button has a navy fill (`background: var(--navy); color: white`)
- Clicking any page button re-fetches that page from the API and smooth-scrolls back to the top of the page (`window.scrollTo({ top: 0, behavior: 'smooth' })`)

---

### Page 2 — Application Form (`apply.html`)

#### Page Header

A narrow navy banner (`padding: 40px`) matching the landing page aesthetic, with a `3px gold` bottom border. Shows the form title and a one-line instruction.

#### Form Card

A `.card` at `max-width: 720px` centred on the page (`padding: 40px`), sitting on the `#F5F6FA` background. The form is divided into four named sections, each introduced by a section header — a small `11px / 700 / uppercase` label with a `3px solid gold` left border and `10px` left padding.

---

**Section 1 — Personal Information**

Laid out in a two-column grid (`gap: 20px`):

| Field | Input type | Validation | Notes |
|-------|-----------|-----------|-------|
| Full Name | `<input type="text">` | Required | Placeholder "As per HKID / Passport"; `autocomplete="name"` |
| Email Address | `<input type="email">` | Required + regex | Placeholder "you@example.com"; `autocomplete="email"` |
| Phone Number | `<input type="tel">` | Optional | Placeholder "+852 "; `autocomplete="tel"` |
| Date of Birth | `<input type="date">` | Optional | Native browser date picker |

Below the grid — **Gender** (required): three radio pill buttons: `Male`, `Female`, `Prefer not to say`. The native radio `<input>` is hidden; clicking a styled `<span class="radio-label">` triggers its sibling input. The selected pill fills navy with white text; unselected pills show the navy border and text on hover.

---

**Section 2 — Professional Background**

Two-column grid:

| Field | Input type | Options |
|-------|-----------|---------|
| Occupation | `<select>` (required) | Student / Working Professional / Academic / Researcher / Entrepreneur / Other |
| Industry | `<select>` (optional) | Finance & Banking / Technology / Healthcare / Education / Legal & Compliance / Real Estate / Government & Public Sector / Other |

All `<select>` elements have `appearance: none` with a custom inline SVG chevron arrow (`background-image`) positioned at the right edge. On focus, the border turns gold with a `3px rgba(201,168,76,0.12)` glow.

---

**Section 3 — Session Preferences**

Two-column grid:

| Field | Input type | Options |
|-------|-----------|---------|
| Preferred Session | `<select>` (required) | Morning Session (09:00–12:30) / Afternoon Session (14:00–17:30) / Evening Session (19:00–21:30) |
| How did you hear about us? | `<select>` (optional) | LinkedIn / Email Newsletter / Referral / Social Media / Other |

Below the grid — **Dietary Requirements**: four radio pills: `No Preference` (pre-checked), `Vegetarian`, `Vegan`, `Halal`.

---

**Section 4 — Additional Information**

| Field | Input type | Notes |
|-------|-----------|-------|
| Remarks / Special Requirements | `<textarea>` | `min-height: 96px`, vertically resizable |
| Terms & Conditions | `<input type="checkbox">` | Displayed inside a tinted `.checkbox-field` box; label contains links to T&C and Privacy Policy |

---

#### Form Validation

Validation runs entirely on the client side in `apply.js` before any network call is made. On each submission attempt, all previous error states are cleared first (`clearErrors()`), then each rule is checked:

| Field | Rule |
|-------|------|
| Full Name | Must not be empty |
| Email | Must not be empty; must match `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` |
| Gender | A radio option must be selected |
| Occupation | A non-empty option must be selected |
| Preferred Session | A non-empty option must be selected |
| Terms | Checkbox must be checked |

When a rule fails, the corresponding `<input>` or `<select>` receives the `.error` class (border turns `#C62828`) and the adjacent `<span class="field-error">` receives the error message text. If any rule fails the form is not submitted.

#### Submit Flow

1. Client-side validation runs; if it fails, the function returns early and no request is made
2. The Submit button is disabled and its label changes to "Submitting…" to prevent duplicate submissions
3. `submitApplication(data)` posts JSON to `POST /api/applications`
4. **On success**: the green success alert slides into view ("✓ Your application has been submitted successfully. Redirecting…") and after 2 000 ms the page navigates to `index.html`
5. **On failure**: the red error alert appears with the server's error message (extracted from the JSON response body, falling back to the HTTP status); the Submit button is re-enabled

---

### JavaScript Modules

#### `js/api.js`

The single source of truth for all backend communication. Exports two async functions used by both pages:

```js
const BASE_URL = 'http://localhost:8080'; // replace with Railway URL before deploy

getAllApplications(page, size)   // GET /api/applications?page=…&size=…&sort=createdAt,desc
submitApplication(data)          // POST /api/applications  — body: JSON
```

Both functions throw an `Error` on non-2xx responses. `submitApplication` additionally parses the response JSON to extract `err.message` for display in the UI.

#### `js/index.js`

Handles the landing page entirely:

- `loadApplications(page)` — fetches a page, switches the DOM between loading / empty / error / table states, populates `<tbody>`, then calls `renderPagination`
- `renderPagination(current, total, container)` — builds the pagination bar as an HTML string, inserts it, then attaches click listeners to every `[data-page]` button
- `fmtDate(iso)` — formats an ISO timestamp string using `Intl.DateTimeFormat` with locale `en-HK` and options `{ day: '2-digit', month: 'short', year: 'numeric' }`
- `esc(str)` — escapes `&`, `<`, `>` to prevent XSS when rendering server data into `innerHTML`

#### `js/apply.js`

Handles the application form:

- `val(id)` — reads and trims the value of an input by element ID
- `radio(name)` — returns the `value` of the currently checked radio in a named group
- `setErr(id, msg)` — adds `.error` class to the field and sets the sibling error span text
- `clearErrors()` — removes all `.error` classes and clears all error span text before re-validating
- `showAlert(el, msg)` — hides both alerts, optionally sets the error message, shows the target alert, and smooth-scrolls to it
- `validate(data)` — runs all validation rules, returns `true` only when all pass
- Submit event listener — orchestrates the full submit flow including button state management

---

## Backend

### Backend Project Structure

The backend is a standard Spring Boot Maven project under `backend/`. Railway detects the `pom.xml` automatically via Nixpacks and runs `mvn package` to produce a self-contained JAR.

Package root: `com.demo.seminar`

```
SeminarBackendApplication.java    @SpringBootApplication entry point
config/
  CorsConfig.java                 WebMvcConfigurer — global CORS rules
  GlobalExceptionHandler.java     @RestControllerAdvice — maps exceptions to HTTP responses
controller/
  ApplicationController.java      @RestController — two REST endpoints
service/
  ApplicationService.java         Business logic, entity↔DTO mapping
repository/
  ApplicationRepository.java      JPA repository
model/
  Application.java                JPA entity → `applications` table
dto/
  ApplicationRequest.java         Inbound request body with validation annotations
  ApplicationResponse.java        Outbound response projection
```

---

### Data Model

`Application.java` is a JPA entity mapped to the `applications` table. Hibernate's `SpringPhysicalNamingStrategy` (Spring Boot default) converts camelCase field names to `snake_case` column names automatically.

| Java field | Column name | Type | Constraint |
|-----------|------------|------|-----------|
| `id` | `id` | `UUID` | `@Id`, `@GeneratedValue(UUID)` — auto-generated by Hibernate 6 |
| `fullName` | `full_name` | `VARCHAR` | `NOT NULL` |
| `email` | `email` | `VARCHAR` | `NOT NULL` |
| `phone` | `phone` | `VARCHAR` | nullable |
| `dateOfBirth` | `date_of_birth` | `DATE` | nullable |
| `gender` | `gender` | `VARCHAR` | nullable |
| `occupation` | `occupation` | `VARCHAR` | nullable |
| `industry` | `industry` | `VARCHAR` | nullable |
| `seminarSession` | `seminar_session` | `VARCHAR` | `NOT NULL` |
| `dietaryRequirement` | `dietary_requirement` | `VARCHAR` | nullable |
| `source` | `source` | `VARCHAR` | nullable |
| `remarks` | `remarks` | `TEXT` | nullable — `columnDefinition = "TEXT"` allows long free-text |
| `agreedToTerms` | `agreed_to_terms` | `BOOLEAN` | `NOT NULL` |
| `createdAt` | `created_at` | `TIMESTAMP` | `@CreationTimestamp`, `updatable = false` — set once by Hibernate on insert |

The `@CreationTimestamp` annotation causes Hibernate to populate `createdAt` with the current UTC instant automatically when the entity is first persisted. The `updatable = false` on `@Column` prevents it from being overwritten on subsequent updates.

The schema is created (and evolved) automatically on each startup via:
```properties
spring.jpa.hibernate.ddl-auto=update
```

---

### DTOs

#### `ApplicationRequest`

The inbound JSON body for `POST /api/applications`. Annotated with Jakarta Bean Validation constraints that are enforced by the `@Valid` annotation on the controller method:

| Field | Constraint(s) | Message |
|-------|-------------|---------|
| `fullName` | `@NotBlank` | "Full name is required" |
| `email` | `@NotBlank` + `@Email` | "Email is required" / "Invalid email address" |
| `gender` | `@NotBlank` | "Gender is required" |
| `occupation` | `@NotBlank` | "Occupation is required" |
| `seminarSession` | `@NotBlank` | "Seminar session is required" |
| `agreedToTerms` | `@AssertTrue` | "You must agree to the terms and conditions" |
| `phone`, `dateOfBirth`, `industry`, `dietaryRequirement`, `source`, `remarks` | none — optional | — |

#### `ApplicationResponse`

The outbound projection returned from both endpoints. Built with the Lombok `@Builder` pattern in the service layer. Contains all entity fields except none are omitted — the full record is returned so the frontend can display any field it needs.

---

### Repository

```java
public interface ApplicationRepository extends JpaRepository<Application, UUID> { }
```

`JpaRepository` provides all standard CRUD operations plus Spring Data's `findAll(Pageable)` method, which is the only one used. No custom query methods are needed.

---

### Service Layer

`ApplicationService` is the only class with `@Service`. It is the sole component that touches the repository and owns all entity↔DTO mapping.

**`getAllApplications(Pageable pageable)`**
Calls `repository.findAll(pageable)` which returns a `Page<Application>`. The result is mapped element-by-element to `Page<ApplicationResponse>` using `.map(this::toResponse)`. The `Pageable` (page number, page size, sort) is decided entirely by the controller/caller.

**`saveApplication(ApplicationRequest request)`**
Calls `toEntity(request)` to construct an `Application` instance from the validated DTO, saves it with `repository.save(entity)` (generates UUID + sets `createdAt`), then maps the saved entity back to `ApplicationResponse` and returns it.

**`toResponse(Application)`** — maps every entity field to the response builder.
**`toEntity(ApplicationRequest)`** — creates a new `Application` and sets all fields from the request; `id` and `createdAt` are left unset (handled by JPA/Hibernate).

---

### REST API

#### `GET /api/applications`

Returns a paginated, sorted list of all submitted applications.

**Query parameters** (all optional — defaults applied by `@PageableDefault`):

| Parameter | Default | Description |
|-----------|---------|-------------|
| `page` | `0` | Zero-based page index |
| `size` | `7` | Records per page |
| `sort` | `createdAt,desc` | Sort field and direction |

**Response** — Spring's `Page<T>` serialised as JSON:

```json
{
  "content": [
    {
      "id": "uuid",
      "fullName": "Jane Chan",
      "email": "jane@example.com",
      "phone": "+852 9123 4567",
      "dateOfBirth": "1990-05-20",
      "gender": "Female",
      "occupation": "Working Professional",
      "industry": "Finance",
      "seminarSession": "Morning Session",
      "dietaryRequirement": "Vegetarian",
      "source": "LinkedIn",
      "remarks": null,
      "agreedToTerms": true,
      "createdAt": "2026-06-15T04:30:00Z"
    }
  ],
  "totalElements": 42,
  "totalPages": 6,
  "number": 0,
  "size": 7,
  "first": true,
  "last": false
}
```

The frontend reads `content`, `totalPages`, `number`, and `totalElements` from this structure to render the table and pagination.

#### `POST /api/applications`

Saves a new application. Expects a JSON body matching `ApplicationRequest`.

- Returns **HTTP 201 Created** with the full `ApplicationResponse` body on success
- Returns **HTTP 400 Bad Request** with a structured error body on validation failure (see [Global Exception Handling](#global-exception-handling))

**Example request body:**
```json
{
  "fullName": "Jane Chan",
  "email": "jane@example.com",
  "phone": "+852 9123 4567",
  "dateOfBirth": "1990-05-20",
  "gender": "Female",
  "occupation": "Working Professional",
  "industry": "Finance",
  "seminarSession": "Morning Session",
  "dietaryRequirement": "Vegetarian",
  "source": "LinkedIn",
  "remarks": "Require wheelchair access",
  "agreedToTerms": true
}
```

#### `GET /actuator/health`

Exposed by Spring Boot Actuator. Returns `{"status":"UP"}` when the application is running and the database connection is healthy. Used by Railway as the health check endpoint to determine when a deployment is ready.

---

### CORS Configuration

`CorsConfig.java` implements `WebMvcConfigurer` and registers a global CORS rule:

```
Mapping:         /api/**
Allowed origins: *  (any origin — accommodates Vercel preview domains)
Allowed methods: GET, POST, OPTIONS
Allowed headers: *
Max age:         3600 seconds (preflight cache)
```

This allows the Vercel-hosted frontend (which may have different preview subdomains on each deployment) to call the Railway backend without browser CORS errors.

---

### Global Exception Handling

`GlobalExceptionHandler.java` is annotated with `@RestControllerAdvice`, which makes it intercept exceptions thrown by any controller.

It handles `MethodArgumentNotValidException` — the exception Spring throws when `@Valid` validation fails on a request body. The handler collects every `FieldError`, maps field names to their error messages, and returns:

```json
HTTP 400 Bad Request
{
  "message": "Validation failed",
  "errors": {
    "fullName": "Full name is required",
    "seminarSession": "Seminar session is required"
  }
}
```

The frontend (`apply.js`) reads `err.message` from this response and displays it in the red error alert.

---

### Application Configuration

`src/main/resources/application.properties` reads all sensitive values from environment variables, making the same JAR deployable in any environment:

```properties
# Database connection — set in Railway dashboard from Supabase credentials
spring.datasource.url=jdbc:postgresql://${DB_HOST}:${DB_PORT:5432}/${DB_NAME:postgres}?sslmode=require
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA / Hibernate
spring.jpa.hibernate.ddl-auto=update          # auto-creates / migrates schema on boot
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.show-sql=false

# Server — Railway injects PORT automatically
server.port=${PORT:8080}

# Actuator — expose only the health endpoint
management.endpoints.web.exposure.include=health
management.endpoint.health.show-details=never
```

`sslmode=require` in the JDBC URL enforces an encrypted connection, which Supabase requires for all direct connections.

---

## Deployment

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for the full step-by-step guide covering Supabase setup, Railway backend deployment with environment variables, and Vercel frontend deployment.

Quick reference — required Railway environment variables:

| Variable | Value |
|----------|-------|
| `DB_HOST` | `db.<project-ref>.supabase.co` |
| `DB_PORT` | `5432` |
| `DB_NAME` | `postgres` |
| `DB_USERNAME` | `postgres` |
| `DB_PASSWORD` | your Supabase DB password |

Before deploying the frontend, update the single constant in `frontend/js/api.js`:

```js
const BASE_URL = 'https://<your-service>.up.railway.app';
```
