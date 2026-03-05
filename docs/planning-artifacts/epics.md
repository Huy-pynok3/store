---
stepsCompleted:
  - "step-01-validate-prerequisites"
  - "step-02-design-epics"
  - "step-03-create-stories"
  - "step-04-final-validation"
inputDocuments:
  - "Original PRD from conversation - Authentication System Specification"
  - "docs/prd-auth-clarifications.md"
---

# taphoammo - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for taphoammo Authentication System, decomposing the requirements from the PRD and clarifications into implementable stories.

## Requirements Inventory

### Functional Requirements

**FR1:** User can register a new account with username, email, password, and password confirmation

**FR2:** User can log in with email and password

**FR3:** User can log in using Google OAuth

**FR4:** User can enable "Remember Login" to extend session duration from 24h to 7 days

**FR5:** System displays success toast notification after successful registration using SweetAlert2

**FR6:** System validates registration inputs (username 3-20 chars, valid email, password ≥6 chars, matching confirmation)

**FR7:** System validates login inputs (email and password required)

**FR8:** System automatically links Google account to existing email-based account if email matches

**FR9:** System creates new account for Google OAuth users if email doesn't exist

**FR10:** System requires Cloudflare Turnstile captcha verification on registration

**FR11:** System requires Cloudflare Turnstile captcha verification on login after multiple failed attempts

**FR12:** After successful registration, system focuses login form (no auto-login)

**FR13:** After successful login, system redirects user to homepage

**FR14:** System generates JWT token with user_id, email, and role in payload

**FR15:** System sets JWT expiration to 24h for normal login, 7d for "remember me" login

### Non-Functional Requirements

**NFR1:** Passwords must be hashed using bcrypt before storage

**NFR2:** Email addresses must be unique in the system

**NFR3:** password_hash field is nullable (to support Google OAuth users)

**NFR4:** google_id field is nullable (to support email/password users)

**NFR5:** System must use JWT for authentication

**NFR6:** Login page must display split layout (left: login form, right: register form)

**NFR7:** System must use SweetAlert2 for toast notifications (already integrated in UI)

**NFR8:** System must integrate Cloudflare Turnstile for bot protection

**NFR9:** Turnstile verification must be privacy-friendly (no user puzzle interaction)

**NFR10:** System must validate Turnstile token on backend via Cloudflare API

### Additional Requirements

**Technical Stack:**
- Backend: NestJS with AuthModule
- Frontend: React/Next.js with register form, login form, Google login button
- Database: User table with email (unique), password_hash (nullable), google_id (nullable), username
- Security: bcrypt for password hashing, JWT for session management
- Bot Protection: Cloudflare Turnstile integration
- Environment variables: TURNSTILE_SITE_KEY, TURNSTILE_SECRET_KEY, JWT_SECRET

**Error Handling:**
- EMAIL_ALREADY_EXISTS - when registration email is duplicate
- INVALID_CREDENTIALS - when login email/password is incorrect
- INVALID_INPUT - when validation fails
- GOOGLE_LOGIN_FAILED - when Google OAuth fails
- TURNSTILE_VERIFICATION_FAILED - when captcha verification fails

**Out of Scope for V1:**
- Email verification
- Password reset flow
- Refresh token system
- 2FA authentication
- Rate limiting (recommended but deferred)

### FR Coverage Map

FR1: Epic 1 - User registration with username, email, password
FR2: Epic 1 - User login with email/password
FR3: Epic 1 - Google OAuth login
FR4: Epic 1 - Remember login feature (24h vs 7d JWT)
FR5: Epic 1 - Success toast notification after registration
FR6: Epic 1 - Registration input validation
FR7: Epic 1 - Login input validation
FR8: Epic 1 - Google account linking to existing email
FR9: Epic 1 - New account creation for Google OAuth users
FR10: Epic 1 - Turnstile captcha on registration
FR11: Epic 1 - Turnstile captcha on failed login attempts
FR12: Epic 1 - Focus login form after registration (no auto-login)
FR13: Epic 1 - Redirect to homepage after login
FR14: Epic 1 - JWT token generation with payload
FR15: Epic 1 - JWT expiration based on remember me

## Epic List

### Epic 1: User Authentication & Account Access

Users can create accounts, log in securely using email/password or Google OAuth, and access the TapHoaMMO marketplace with protected sessions.

**User Outcomes:**
- New users can register accounts with bot protection
- Users can log in with email/password or Google
- Users can stay logged in for extended periods
- Users receive clear feedback on registration success
- System prevents bot abuse and ensures secure authentication

**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR6, FR7, FR8, FR9, FR10, FR11, FR12, FR13, FR14, FR15

**NFRs addressed:** NFR1-NFR10 (security, validation, UI layout, bot protection)


## Epic 1: User Authentication & Account Access

Users can create accounts, log in securely using email/password or Google OAuth, and access the TapHoaMMO marketplace with protected sessions.

### Story 1.1: Database Schema & User Model Setup

As a developer,
I want to create the User database schema with authentication fields,
So that the system can store user credentials and authentication data securely.

**Acceptance Criteria:**

**Given** the database is accessible
**When** I run the migration
**Then** a User table is created with the following fields:
- id (primary key, auto-increment)
- username (string, required, 3-20 characters)
- email (string, required, unique)
- password_hash (string, nullable)
- google_id (string, nullable)
- role (string, default: 'user')
- created_at (timestamp)
- updated_at (timestamp)
**And** email field has a unique constraint
**And** password_hash is nullable to support Google OAuth users
**And** google_id is nullable to support email/password users

### Story 1.2: User Registration with Email/Password

As a new user,
I want to register an account with username, email, and password,
So that I can access the TapHoaMMO marketplace.

**Acceptance Criteria:**

**Given** I am on the registration page
**When** I submit valid registration data (username, email, password, password confirmation)
**Then** the system validates:
- Username is 3-20 characters
- Email is valid format
- Password is at least 6 characters
- Password confirmation matches password
**And** the system checks email uniqueness in database
**And** if email already exists, return error "EMAIL_ALREADY_EXISTS"
**And** if validation passes, password is hashed using bcrypt
**And** new user record is created in database
**And** system returns success response "REGISTER_SUCCESS"
**And** system does NOT automatically log in the user

**Given** I submit invalid registration data
**When** validation fails
**Then** system returns error "INVALID_INPUT" with specific field errors

### Story 1.3: Cloudflare Turnstile Integration

As a system administrator,
I want to integrate Cloudflare Turnstile captcha on registration and login,
So that the system prevents bot abuse and automated account creation.

**Acceptance Criteria:**

**Given** Turnstile is configured with TURNSTILE_SITE_KEY and TURNSTILE_SECRET_KEY
**When** user opens the registration form
**Then** Turnstile widget loads automatically
**And** widget is privacy-friendly (no user puzzle interaction required)

**Given** user submits registration form
**When** form is submitted
**Then** Turnstile token is generated and sent to backend
**And** backend verifies token with Cloudflare API at https://challenges.cloudflare.com/turnstile/v0/siteverify
**And** if verification succeeds, registration proceeds
**And** if verification fails, return error "TURNSTILE_VERIFICATION_FAILED"

**Given** user has multiple failed login attempts
**When** login failure count exceeds threshold
**Then** Turnstile captcha is required on subsequent login attempts
**And** same verification flow applies

### Story 1.4: User Login with Email/Password

As a registered user,
I want to log in with my email and password,
So that I can access my account and use the marketplace.

**Acceptance Criteria:**

**Given** I am on the login page
**When** I submit valid email and password
**Then** system validates email and password are provided
**And** system looks up user by email
**And** if user not found, return error "INVALID_CREDENTIALS"
**And** system verifies password using bcrypt compare
**And** if password incorrect, return error "INVALID_CREDENTIALS"
**And** if credentials valid, system generates JWT token
**And** JWT payload includes: user_id, email, role
**And** JWT expiration is set to 24 hours (default)
**And** system returns access_token in response
**And** frontend stores token
**And** frontend redirects user to homepage

**Given** I submit invalid credentials
**When** email or password is incorrect
**Then** system returns "INVALID_CREDENTIALS" error
**And** system does NOT reveal whether email or password was wrong

### Story 1.5: Remember Login Feature

As a user,
I want to enable "Remember Login" when logging in,
So that I can stay logged in for an extended period without re-authenticating frequently.

**Acceptance Criteria:**

**Given** I am on the login page
**When** I check the "Remember Login" checkbox
**And** I submit valid credentials
**Then** system generates JWT token with 7-day expiration (instead of 24 hours)
**And** JWT payload includes: user_id, email, role
**And** system returns access_token with extended expiration
**And** frontend stores token
**And** user remains authenticated for 7 days

**Given** I do NOT check "Remember Login"
**When** I log in successfully
**Then** JWT expiration is 24 hours (default)

### Story 1.6: Google OAuth Integration

As a user,
I want to log in using my Google account,
So that I can quickly access the marketplace without creating a separate password.

**Acceptance Criteria:**

**Given** I am on the login page
**When** I click "Login with Google" button
**Then** system redirects to /api/auth/google
**And** Google OAuth flow begins
**And** user selects Google account

**Given** Google authentication succeeds
**When** Google redirects to /api/auth/google/callback
**Then** backend verifies Google token
**And** system extracts email from Google profile

**Given** email already exists in database
**When** Google OAuth completes
**Then** system links Google account by setting google_id field
**And** system generates JWT token
**And** JWT payload includes: user_id, email, role
**And** JWT expiration is 24 hours
**And** system redirects to homepage with token

**Given** email does NOT exist in database
**When** Google OAuth completes
**Then** system creates new user account with:
- email from Google
- username from Google (or generated)
- google_id set
- password_hash remains null
**And** system generates JWT token
**And** system redirects to homepage with token

**Given** Google OAuth fails
**When** authentication error occurs
**Then** system returns error "GOOGLE_LOGIN_FAILED"
**And** user is redirected back to login page

### Story 1.7: Registration Success Toast Notification

As a user,
I want to see a success notification after registering,
So that I know my registration was successful and I should proceed to login.

**Acceptance Criteria:**

**Given** I successfully complete registration
**When** backend returns "REGISTER_SUCCESS"
**Then** frontend displays SweetAlert2 toast with:
- icon: 'success'
- title: 'Đăng ký thành công!'
- text: 'Vui lòng đăng nhập'
- button: 'OK'
**And** when I click "OK", toast closes
**And** login form receives focus
**And** I can immediately enter credentials to login

### Story 1.8: Login/Register Page UI Layout

As a user,
I want to see a split-panel login/register page,
So that I can easily choose between logging in or creating a new account.

**Acceptance Criteria:**

**Given** I navigate to the login/register page
**When** page loads
**Then** page displays split layout with two panels

**Left Panel (Login):**
- Title: "Đăng nhập"
- Email input field
- Password input field
- "Ghi nhớ đăng nhập" checkbox
- "Đăng nhập" button
- "Login with Google" button

**Right Panel (Register):**
- Title: "Đăng ký"
- Username input field
- Email input field
- Password input field
- Confirm Password input field
- "Đồng ý điều khoản" checkbox
- "Đăng ký" button

**And** layout is responsive on mobile devices
**And** all form inputs have proper validation feedback
**And** buttons are properly styled and accessible
